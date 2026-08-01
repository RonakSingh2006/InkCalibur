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
  visibility,
  inviteCode,
  onDelete,
}: {
  name: string;
  createdAt: string;
  visibility: "PUBLIC" | "PRIVATE";
  inviteCode: string;
  onDelete: (slug: string) => void;
}) {
  const router = useRouter();

  const handleJoin = () => {
    if (visibility === "PRIVATE") {
      router.push(`/join/${inviteCode}`);
    } else {
      router.push(`canvas/${name}`);
    }
  };

  return (
    <div className={`group relative rounded-xl border bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 w-72 h-48 flex flex-col justify-between p-5 backdrop-blur-sm ${
      visibility === "PRIVATE"
        ? "border-amber-500/30 hover:border-amber-500/60"
        : "border-zinc-800 hover:border-indigo-500/50"
    }`}>
      
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
        <div className={`size-10 rounded-lg border flex items-center justify-center ${
          visibility === "PRIVATE"
            ? "bg-amber-500/10 border-amber-500/20"
            : "bg-indigo-500/10 border-indigo-500/20"
        }`}>
          <span className={`text-lg font-bold ${
            visibility === "PRIVATE" ? "text-amber-400" : "text-indigo-400"
          }`}>
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

      {/* Visibility badge */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          visibility === "PRIVATE"
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        }`}>
          {visibility === "PRIVATE" ? "🔒 Private" : "🌍 Public"}
        </span>
      </div>

      {/* Join button */}
      <Button
        variant="secondary"
        size="medium"
        onClick={handleJoin}
        text={visibility === "PRIVATE" ? "Enter Room" : "Join Room"}
      />
    </div>
  );
}