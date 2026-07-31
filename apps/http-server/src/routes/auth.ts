import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { JWT_SECRET } from "@repo/backend-common/config";
import { AuthSchema, EmailSchema, OtpSchema, SignupSchema } from "@repo/common/schema";
import { prisma } from "@repo/db/client";

const router: Router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Create OTP
router.post("/create-otp", async (req, res) => {
  const result = EmailSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Invalid email",
      error: result.error,
    });
  }

  const { email } = result.data;

  try {
    
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).send({ message: "User already exists with this email" });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 5 min expiry
    await prisma.otpVerification.create({
      data: {
        email,
        otp: hashedOtp,
        expiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    
    await resend.emails.send({
      from: "InkCalibur <auth@ronaksingh.me>",
      to: [email],
      subject: "Your InkCalibur OTP Code",
      html: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #6366f1;">InkCalibur</h2>
        <p>Your OTP for signup is:</p>
        <h1 style="color: #6366f1; font-size: 32px; letter-spacing: 8px; text-align: center;">${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>`,
    });

    res.send({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to send OTP",
      error,
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const result = OtpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Invalid input",
      error: result.error,
    });
  }

  const { email, otp } = result.data;

  try {
    
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return res.status(404).send({ message: "No OTP found. Please request a new one." });
    }

    
    if (new Date() > otpRecord.expiry) {
      return res.status(410).send({ message: "OTP has expired. Please request a new one." });
    }

   
    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
      return res.status(403).send({ message: "Invalid OTP" });
    }

    res.send({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to verify OTP",
      error,
    });
  }
});

// Sign Up
router.post("/signup", async (req, res) => {
  const result = SignupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Incorrect Input",
      error: result.error,
    });
  }

  const { email, name, username, password } = result.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return res.status(409).send({ message: "Username already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      },
    });

    res.send({
      message: "Signed Up",
      userId: user.id,
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  const result = AuthSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Incorrect Input",
      error: result.error,
    });
  }

  const { login, password } = result.data;

  try {
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { username: login },
        ],
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(403).send({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string);

    res.send({ message: "Signed In", token });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

export default router;
