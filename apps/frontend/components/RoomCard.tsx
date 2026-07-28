"use client";

import Delete from "@/icons/Delete";
import Button from "./Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";

function getDate(str: string) {
  const date = new Date(str);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RoomCard({
  name,
  createdAt,
  onDelete,
}: {
  name: string;
  createdAt: string;
  onDelete: (slug: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-indigo-500/50 transition-all duration-300 w-72 h-48 flex flex-col justify-between p-5 backdrop-blur-sm">
      
      {/* Delete button */}
      <button
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-red-500/10"
        title="Delete room"
        onClick={async () => {
          try {
            await axios.delete(`${BACKEND_URL}/room/${name}`, {
              headers: { Authorization: localStorage.getItem("token") },
            });
            onDelete(name);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <Delete className="text-red-400 size-4" />
      </button>

      {/* Room icon */}
      <div className="flex items-center gap-3 mt-2">
        <div className="size-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <span className="text-indigo-400 text-lg font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-lg truncate max-w-40">
            {name}
          </span>
          <span className="text-zinc-500 text-xs">
            Created {getDate(createdAt)}
          </span>
        </div>
      </div>

      {/* Join button */}
      <Button
        variant="secondary"
        size="medium"
        onClick={() => router.push(`canvas/${name}`)}
        text="Join Room"
      />
    </div>
  );
}
