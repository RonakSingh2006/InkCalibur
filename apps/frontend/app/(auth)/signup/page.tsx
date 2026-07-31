"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRef, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { BACKEND_URL } from "@repo/common/config";
import { EmailSchema, OtpSchema, SignupSchema } from "@repo/common/schema";
import { useRouter } from "next/navigation";
import InputWrapper from "@/components/InputWrapper";
import { z } from "zod";

const OTP_EXPIRY_SECONDS = 300;

export default function SignUp() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp" | "details">("email");
  const [email, setEmail] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRY_SECONDS);
  const [timerKey, setTimerKey] = useState<number>(0);

  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== "otp") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timerKey]);

  const handleGetOtp = async () => {
    setErrors({});
    setMessage("");
    const emailValue = emailRef.current?.value || "";
    setEmail(emailValue);

    const result = EmailSchema.safeParse({ email: emailValue });
    
    if (!result.success) {
      const tree = z.treeifyError(result.error);
      
      setErrors({
        email: tree.properties?.email?.errors[0] ?? "Invalid email",
      });
      
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/create-otp`, { email: emailValue });
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setTimerKey((k) => k + 1);
      setOtpVerified(false);
      setStep("otp");
      setMessage("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrors({ email: err.response?.data.message || "Failed to send OTP" });
      } else {
        setErrors({ email: "Unexpected Error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrors({});
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/create-otp`, { email });
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setTimerKey((k) => k + 1);
      setOtpVerified(false);
      setMessage("New OTP sent to your email.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrors({ otp: err.response?.data.message || "Failed to resend OTP" });
      } else {
        setErrors({ otp: "Unexpected Error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleVerifyOtp = async () => {
    setErrors({});
    setMessage("");
    const otpValue = otpRef.current?.value || "";

    const result = OtpSchema.safeParse({ email, otp: otpValue });

    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setErrors({
        otp: tree.properties?.otp?.errors[0] ?? "Invalid OTP",
      });

      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/verify-otp`, { email, otp: otpValue });
      setOtpVerified(true);
      setMessage("OTP verified successfully!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrors({ otp: err.response?.data.message || "Failed to verify OTP" });
      } else {
        setErrors({ otp: "Unexpected Error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setErrors({});
    setMessage("");
    const name = nameRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    const user = { email, name, username, password, confirmPassword };
    const result = SignupSchema.safeParse(user);

    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setErrors({
        name: tree.properties?.name?.errors[0] ?? "",
        username: tree.properties?.username?.errors[0] ?? "",
        password: tree.properties?.password?.errors[0] ?? "",
        confirmPassword: tree.properties?.confirmPassword?.errors[0] ?? "",
      });

      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/signup`, {
        email,
        name,
        username,
        password,
        confirmPassword
      });

      router.push("/signin");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrors({ name: err.response?.data.message || "Signup failed" });
      } else {
        setErrors({ name: "Unexpected Error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <h1
        className="text-3xl font-bold tracking-wide text-white mb-10 cursor-pointer"
        onClick={() => router.push("/")}
      >
        Ink<span className="text-indigo-500">Calibur</span>
      </h1>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h2 className="text-white text-2xl font-bold text-center mb-8">
          Sign Up
        </h2>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["email", "otp", "details"].map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  step === s
                    ? "bg-indigo-500"
                    : ["email", "otp", "details"].indexOf(step) > idx
                    ? "bg-indigo-300"
                    : "bg-zinc-700"
                }`}
              />
              {idx < 2 && <div className="w-8 h-px bg-zinc-700" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {/* Step 1: Email */}
          {step === "email" && (
            <>
              <InputWrapper error={errors.email}>
                <Input
                  placeholder="Email"
                  type="email"
                  ref={emailRef}
                />
              </InputWrapper>

              {message && (
                <p className="text-indigo-400 text-sm text-center">{message}</p>
              )}

              <div className="flex flex-col items-center mt-2 gap-4">
                <Button
                  variant="secondary"
                  size="medium"
                  text={loading ? "Sending..." : "Get OTP"}
                  auth={true}
                  onClick={handleGetOtp}
                />
              </div>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <>
              <InputWrapper error={errors.otp}>
                <Input
                  placeholder="Enter OTP"
                  type="text"
                  ref={otpRef}
                />
              </InputWrapper>

              {message && (
                <p className="text-indigo-400 text-sm text-center">{message}</p>
              )}

              {/* OTP expiry timer */}
              {!otpVerified && (
                <div className="flex flex-col items-center gap-2">
                  {timeLeft > 0 ? (
                    <p className="text-sm text-zinc-400">
                      OTP expires in{" "}
                      <span className={`font-mono font-semibold ${timeLeft <= 60 ? "text-red-400" : "text-indigo-400"}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-red-400">OTP has expired. Please resend a new one.</p>
                      <button
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
                        onClick={handleResendOtp}
                      >
                        {loading ? "Resending..." : "Resend OTP"}
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col items-center mt-2 gap-4">
                <Button
                  variant="secondary"
                  size="medium"
                  text={loading ? "Verifying..." : "Verify"}
                  auth={true}
                  onClick={handleVerifyOtp}
                />

                {otpVerified && (
                  <Button
                    variant="primary"
                    size="medium"
                    text="Next"
                    auth={true}
                    onClick={() => {
                      setStep("details");
                      setMessage("");
                    }}
                  />
                )}

                <button
                  className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  onClick={() => {
                    setStep("email");
                    setMessage("");
                    setOtpVerified(false);
                  }}
                >
                  Change email
                </button>
              </div>
            </>
          )}

          {/* Step 3: User Details */}
          {step === "details" && (
            <>
              <div className="text-sm text-zinc-400 text-center mb-2">
                Signing up with <span className="text-indigo-400">{email}</span>
              </div>

              <InputWrapper error={errors.name}>
                <Input placeholder="Name" type="text" ref={nameRef} />
              </InputWrapper>

              <InputWrapper error={errors.username}>
                <Input placeholder="Username" type="text" ref={usernameRef} />
              </InputWrapper>

              <InputWrapper error={errors.password}>
                <Input placeholder="Password" type="password" ref={passwordRef} />
              </InputWrapper>

              <InputWrapper error={errors.confirmPassword}>
                <Input placeholder="Confirm Password" type="password" ref={confirmPasswordRef} />
              </InputWrapper>

              <div className="flex flex-col items-center mt-2 gap-4">
                <Button
                  variant="secondary"
                  size="medium"
                  text={loading ? "Signing Up..." : "Sign Up"}
                  auth={true}
                  onClick={handleSignup}
                />

                <button
                  className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  onClick={() => {
                    setStep("otp");
                    setErrors({});
                  }}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center mt-6 gap-4">
          <button
            className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}