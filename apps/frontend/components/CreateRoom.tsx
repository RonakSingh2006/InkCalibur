"use client"

import InputWrapper from "@/components/InputWrapper";
import Input from "@/components/Input";
import { RoomSchema } from "@repo/common/schema";
import { BACKEND_URL } from "@repo/common/config";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Button from "./Button";
import Cross from "@/icons/Cross";
import {z} from "zod";

export default function CreateRoom({ closeRoom }: { closeRoom: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return (
    <div className="relative w-96 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
      {/* Close button */}
      <button
        title="close"
        className="absolute right-4 top-4 cursor-pointer text-zinc-500 hover:text-red-400 transition-colors"
        onClick={closeRoom}
      >
        <Cross className="size-5" />
      </button>

      {/* Title */}
      <div className="text-white text-2xl font-bold text-center mb-8">
        Create Room
      </div>

      {/* Input */}
      <div className="flex flex-col items-center gap-6">
        <InputWrapper error={errors.name}>
          <Input placeholder="Room Name" type="text" ref={nameRef} />
        </InputWrapper>

        {/* Visibility selector */}
        <div className="w-72">
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 rounded-lg border transition-all duration-200 cursor-pointer text-sm font-medium ${
                visibility === "PUBLIC"
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
              onClick={() => setVisibility("PUBLIC")}
            >
              🌍 Public
            </button>
            <button
              className={`flex-1 py-2 rounded-lg border transition-all duration-200 cursor-pointer text-sm font-medium ${
                visibility === "PRIVATE"
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
              onClick={() => setVisibility("PRIVATE")}
            >
              🔒 Private
            </button>
          </div>
        </div>

        {visibility === "PRIVATE" && (
          <InputWrapper error={errors.password}>
            <Input placeholder="Room Password" type="password" ref={passwordRef} />
          </InputWrapper>
        )}

        <Button
          variant="secondary"
          size="medium"
          text="Create Room"
          auth={true}
          onClick={async () => {
            const slug = nameRef.current?.value;
            const password = passwordRef.current?.value;
            const roomData = { name: slug, visibility, password };

            const result = RoomSchema.safeParse(roomData);

            if (!result.success) {
              const errors = z.treeifyError(result.error);

              setErrors({
                name: errors.properties?.name?.errors?.[0] ?? "",
                password: errors.properties?.password?.errors?.[0] ?? "",
              });

              return;
            }

            try {
              const response = await axios.post(`${BACKEND_URL}/room`, roomData, {
                headers: { Authorization: localStorage.getItem("token") },
              });
              const inviteCode = response.data.inviteCode;
              router.push(`/canvas/${roomData.name}?invite=${inviteCode}`);
            } catch (error) {
              if (axios.isAxiosError(error)) {
                setErrors({ name: error.response?.data.message });
              } else {
                setErrors({ name: "Unexpected Error" });
              }
            }
          }}
        />
      </div>
    </div>
  );
}