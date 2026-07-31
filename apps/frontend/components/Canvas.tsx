"use client";
import { useEffect, useRef, useCallback } from "react";
import { Game } from "@/draw/Game";
import { useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Toolbar from "./Toolbar";
import { useRouter } from "next/navigation";
import Trash from "@/icons/Trash";
import Logout from "@/icons/Logout";

type Shape = "rectangle" | "circle" | "line" | "ellipse" | "pencil" | "hand" | "select" | "eraser";

export default function Canvas({ slug, socket, roomId }: { slug: string; socket: WebSocket; roomId: number }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<Shape>("rectangle");
  const [color, setColor] = useState<string>("#ffffff");
  const { size } = useWindowDimensions();
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    gameRef.current?.setTool(shape);
  }, [shape]);

  useEffect(() => {
    gameRef.current?.setStrokeColor(color);
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return;

    canvas.width = size.width;
    canvas.height = size.height;

    socket.send(
      JSON.stringify({
        type: "join_room",
        roomId: roomId,
      })
    );

    gameRef.current = new Game(canvas, slug, socket, roomId);
    gameRef.current?.setTool(shape);

    return () => {
      gameRef.current?.destroy();
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, socket, roomId, size]);

  const handleLeaveRoom = useCallback(() => {
    socket.send(
      JSON.stringify({
        type: "leave_room",
        roomId: roomId,
      })
    );
    router.push("/dashboard");
  }, [socket, roomId, router]);

  const handleClearCanvas = useCallback(() => {
    gameRef.current?.clearCanvas();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950">
      <canvas
        className="block w-full h-full"
        ref={canvasRef}
      />

      <Toolbar
        activeTool={shape}
        onToolChange={setShape}
        color={color}
        onColorChange={setColor}
      />

      {/* Top-right action buttons */}
      <div className="fixed top-5 right-5 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl">
        <div className="relative group">
          <button
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            onClick={handleClearCanvas}
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
            onClick={handleLeaveRoom}
          >
            <Logout size={20} color="currentColor" />
          </button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Leave Room
          </div>
        </div>
      </div>
    </div>
  );
}