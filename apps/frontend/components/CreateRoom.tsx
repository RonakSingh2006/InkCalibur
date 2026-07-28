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

export default function CreateRoom({ closeRoom }: { closeRoom: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);
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

        <Button
          variant="secondary"
          size="medium"
          text="Create Room"
          auth={true}
          onClick={async () => {
            const slug = nameRef.current?.value;
            const roomData = { name: slug };
            const result = RoomSchema.safeParse(roomData);

            if (!result.success) {
              const fieldErrors = result.error.flatten().fieldErrors;
              setErrors({ name: fieldErrors.name?.[0] ?? "" });
              return;
            }

            try {
              await axios.post(`${BACKEND_URL}/room`, roomData, {
                headers: { Authorization: localStorage.getItem("token") },
              });
              router.push(`/canvas/${roomData.name}`);
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