"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@repo/common/schema";
import { useRef, useState } from "react";
import InputWrapper from "@/components/InputWrapper";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";
import {z} from "zod"

export default function SignIn() {
  const router = useRouter();
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          Sign In
        </h2>

        <div className="flex flex-col gap-4">
          <InputWrapper error={errors.login}>
            <Input placeholder="Email or Username" type="text" ref={loginRef} />
          </InputWrapper>

          <InputWrapper error={errors.password}>
            <Input placeholder="Password" type="password" ref={passwordRef} />
          </InputWrapper>
        </div>

        <div className="flex flex-col items-center mt-6 gap-4">
          <Button
            variant="secondary"
            size="medium"
            text="Sign In"
            auth={true}
            onClick={async () => {
              const login = loginRef.current?.value;
              const password = passwordRef.current?.value;

              const authData = { login, password };
              const result = AuthSchema.safeParse(authData);

              if (!result.success) {
                const tree = z.treeifyError(result.error);

                setErrors({
                  login: tree.properties?.login?.errors[0] ?? "",
                  password: tree.properties?.password?.errors[0] ?? "",
                });

                return;
              }

              try {
                const response = await axios.post(`${BACKEND_URL}/signin`, authData);
                const token = response.data.token;
                localStorage.setItem("token", token);
                router.push("/dashboard");
              } catch (err) {
                if (axios.isAxiosError(err)) {
                  setErrors({ login: err.response?.data.message || "Sign in failed" });
                } else {
                  setErrors({ login: "Unexpected Error" });
                }
              }
            }}
          />

          <button
            className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            {"Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}