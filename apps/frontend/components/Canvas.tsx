"use client";
import { useEffect, useRef, useCallback } from "react";
import { Game } from "@/draw/Game";
import { useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Toolbar from "./Toolbar";
import { useRouter } from "next/navigation";
import ActionBar from "./ActionBar";

type Shape = "rectangle" | "circle" | "line" | "ellipse" | "pencil" | "hand" | "select" | "eraser";

export default function Canvas({ inviteCode, socket, roomId }: { inviteCode: string; socket: WebSocket; roomId: number }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<Shape>("rectangle");
  const [color, setColor] = useState<string>("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [scale, setScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`panOffset_${inviteCode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.scale || 1;
      }
    } catch (e) {console.log(e)}
    return 1;
  });
  const { size } = useWindowDimensions();
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    gameRef.current?.setTool(shape);
  }, [shape]);

  useEffect(() => {
    gameRef.current?.setStrokeColor(color);
  }, [color]);

  useEffect(() => {
    gameRef.current?.setStrokeWidth(strokeWidth);
  }, [strokeWidth]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setScale(scale);
    }
  }, [scale]);

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

    gameRef.current = new Game(canvas, inviteCode, socket, roomId);
    gameRef.current?.setTool(shape);

    return () => {
      gameRef.current?.destroy();
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, socket, roomId, size]);

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

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `canvas-${inviteCode}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [inviteCode]);

  const handleShare = useCallback(() => {
    const inviteLink = `${window.location.origin}/join/${inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  }, [inviteCode]);

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
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        scale={scale}
        onScaleChange={setScale}
      />

      <ActionBar
        onDownload={handleDownload}
        onClearCanvas={handleClearCanvas}
        onLeaveRoom={handleLeaveRoom}
        onShare={handleShare}
      />
    </div>
  );
}