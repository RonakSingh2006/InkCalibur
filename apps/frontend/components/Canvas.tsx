"use client";
import { useEffect, useRef } from "react";
import { initDraw } from "@/draw";
import Square from "@/icons/Sqaure";
import Circle from "@/icons/Circle";
import Line from "@/icons/Line";
import { useState } from "react";

type Shape = "rectangle" | "circle" | "line";


export default function Canvas({ slug , socket , roomId}: { slug: string , socket : WebSocket , roomId : number}) {

  const convasRef = useRef<HTMLCanvasElement>(null);
  const [shape,setShape] = useState<Shape>("rectangle");


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

      <div className="fixed top-5 w-screen flex justify-end pr-10">
        <div className="flex gap-5 p-3 rounded bg-zinc-900">

          <button className="cursor-pointer" title="rectangle" onClick={()=>{
            setShape("rectangle");
          }}>
            <Square size={30} color={`${shape === "rectangle" ? "green" : "white"}`}/>
          </button>

          <button className="cursor-pointer" title="circle" onClick={()=>{
            setShape("circle");
          }}>
            <Circle size={30} color={`${shape === "circle" ? "green" : "white"}`}/>
          </button>

          <button className="cursor-pointer" title="line" onClick={()=>{
            setShape("line");
          }}>
            <Line size={30} color={`${shape === "line" ? "green" : "white"}`}/>
          </button>

        </div>
      </div>
    </div>
  );
}
