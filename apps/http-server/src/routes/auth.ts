import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { AuthSchema, UserSchema } from "@repo/common/schema";
import { prisma } from "@repo/db/client";

const router: Router = Router();

// Sign Up
router.post("/signup", async (req, res) => {
  const result = UserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Incorrect Input",
      error: result.error,
    });
  }

  const { username, password, name } = result.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const check = await prisma.user.findFirst({
      where: { username },
    });

    if (check) {
      return res.status(409).send({ message: "User already exsists" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name: name,
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

  const { username, password } = result.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "user Does not exsists" });
    }

    const passKey = user.password;

    const valid = await bcrypt.compare(password, passKey);

    if (!valid) {
      return res.status(403).send({ message: "Invalid Password" });
    }

    const id = user.id;

    const token = jwt.sign({ userId: id }, JWT_SECRET as string);

    res.send({ message: "Signed Up", token });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

export default router;