"use client"

import InputWrapper from "@/components/InputWrapper";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Button from "./Button";
import Cross from "@/icons/Cross";

export default function JoinRoom({ closeRoom }: { closeRoom: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inviteRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const extractInviteCode = (input: string): string => {
    const match = input.match(/\/join\/([A-Za-z0-9_-]+)/);
    if (match) return match[1];
    return input.trim();
  };

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
        Join Room
      </div>

      {/* Input */}
      <div className="flex flex-col items-center gap-6">
        <InputWrapper error={errors.inviteCode}>
          <Input
            placeholder="Paste invite link or code"
            type="text"
            ref={inviteRef}
          />
        </InputWrapper>

        <Button
          variant="secondary"
          size="medium"
          text="Join Room"
          auth={true}
          onClick={() => {
            const inviteInput = inviteRef.current?.value || "";
            const inviteCode = extractInviteCode(inviteInput);

            if (!inviteCode) {
              setErrors({ inviteCode: "Please enter an invite link or code" });
              return;
            }

            // Forward to the join page which handles public/private logic
            router.push(`/join/${inviteCode}`);
          }}
        />
      </div>
    </div>
  );
}