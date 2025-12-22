"use client"
import { useEffect, useRef } from "react";
import { initDraw } from "@/draw";

export default function Canvas({slug} : {slug : string}){
    const convasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{

    const canvas = convasRef.current;

    if(!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initDraw(canvas,slug);

  },[convasRef,slug])

  return <div>
      <canvas className="bg-black" ref={convasRef}></canvas>
  </div>
}