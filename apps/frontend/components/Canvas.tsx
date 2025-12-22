"use client";
import { useEffect, useRef } from "react";
import { initDraw } from "@/draw";


export default function Canvas({ slug , socket , roomId}: { slug: string , socket : WebSocket , roomId : number}) {

  const convasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = convasRef.current;

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    socket.send(JSON.stringify({
        type : "join_room",
        roomId : roomId
    }))

    initDraw(canvas, slug , socket , roomId);
  }, [convasRef, slug, socket , roomId]);

  return (
    <div>
      <canvas className="bg-black" ref={convasRef}></canvas>
    </div>
  );
}
