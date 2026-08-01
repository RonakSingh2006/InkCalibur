"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputWrapper from "@/components/InputWrapper";
import { BACKEND_URL } from "@repo/common/config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function JoinByInvite() {
  const router = useRouter();
  const params = useParams<{ inviteCode: string }>();
  const inviteCode = params.inviteCode;

  const [roomInfo, setRoomInfo] = useState<{ slug: string; visibility: "PUBLIC" | "PRIVATE" } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Fetch room info to determine if it's public or private
  useEffect(() => {
    async function fetchRoomInfo() {
      try {
        const response = await axios.get(`${BACKEND_URL}/room/invite/${inviteCode}`);
        setRoomInfo(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setErrors({ inviteCode: err.response?.data.message || "Room not found" });
        } else {
          setErrors({ inviteCode: "Unexpected Error" });
        }
      } finally {
        setLoadingInfo(false);
      }
    }
    fetchRoomInfo();
  }, [inviteCode]);

  const handleJoin = async () => {
    setErrors({});
    setLoading(true);

    const password = passwordRef.current?.value;

    try {
      await axios.post(`${BACKEND_URL}/join`, { inviteCode, password });
      router.push(`/canvas/${inviteCode}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data.message;
        if (message === "Password required") {
          setErrors({ password: "This room is private. Enter the password." });
        } else if (message === "Invalid room password") {
          setErrors({ password: "Invalid room password. Please try again." });
        } else {
          setErrors({ inviteCode: message || "Failed to join room" });
        }
      } else {
        setErrors({ inviteCode: "Unexpected Error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const isPrivate = roomInfo?.visibility === "PRIVATE";

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
        <h2 className="text-white text-2xl font-bold text-center mb-2">
          Join Room
        </h2>
        {roomInfo && (
          <p className="text-zinc-400 text-sm text-center mb-8">
            {isPrivate ? "🔒 This room is private" : "🌍 This room is public"}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {/* Show password field only for private rooms */}
          {isPrivate && (
            <div className="flex flex-col items-center">
              <InputWrapper error={errors.password}>
                <Input placeholder="Room Password" type="password" ref={passwordRef} />
              </InputWrapper>
            </div>
          )}

          <div className="flex flex-col items-center mt-2 gap-4">
            <Button
              variant="secondary"
              size="medium"
              text={loading ? "Joining..." : loadingInfo ? "Loading..." : "Join Room"}
              auth={true}
              onClick={handleJoin}
            />

            <button
              className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}