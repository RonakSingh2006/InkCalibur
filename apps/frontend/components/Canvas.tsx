"use client";
import { useEffect, useRef, useCallback } from "react";
import { Game } from "@/draw/Game";
import { useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Toolbar from "./Toolbar";
import { useRouter } from "next/navigation";

type Shape = "rectangle" | "circle" | "line" | "ellipse" | "pencil" | "hand";

export default function Canvas({ slug, socket, roomId }: { slug: string; socket: WebSocket; roomId: number }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<Shape>("rectangle");
  const { size } = useWindowDimensions();
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    gameRef.current?.setTool(shape);
  }, [shape]);

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
        className={`block w-full h-full ${shape === "hand" ? "cursor-grab" : "cursor-crosshair"}`}
        ref={canvasRef}
      />

      <Toolbar
        activeTool={shape}
        onToolChange={setShape}
        onLeaveRoom={handleLeaveRoom}
        onClearCanvas={handleClearCanvas}
      />
    </div>
  );
}