"use client";
import React from "react";
import Trash from "@/icons/Trash";
import Logout from "@/icons/Logout";
import Download from "@/icons/Download";
import Share from "@/icons/Share";

interface ActionBarProps {
  onDownload: () => void;
  onClearCanvas: () => void;
  onLeaveRoom: () => void;
  onShare: () => void;
}

export default function ActionBar({ onDownload, onClearCanvas, onLeaveRoom, onShare }: ActionBarProps) {
  return (
    <div className="fixed top-5 right-5 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl">
      <div className="relative group">
        <button
          className="p-2 rounded-lg text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all duration-200 cursor-pointer"
          onClick={onShare}
        >
          <Share size={20} color="currentColor" />
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Share
        </div>
      </div>

      <div className="relative group">
        <button
          className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 cursor-pointer"
          onClick={onDownload}
        >
          <Download size={20} color="currentColor" />
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Download
        </div>
      </div>

      <div className="relative group">
        <button
          className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
          onClick={onClearCanvas}
        >
          <Trash size={20} color="currentColor" />
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Clear Canvas
        </div>
      </div>

      <div className="relative group">
        <button
          className="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200 cursor-pointer"
          onClick={onLeaveRoom}
        >
          <Logout size={20} color="currentColor" />
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Leave Room
        </div>
      </div>
    </div>
  );
}