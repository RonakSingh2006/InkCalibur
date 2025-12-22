"use client"
import { useEffect, useRef } from "react";
import { initDraw } from "@/draw";
import { useParams } from "next/navigation";

export default function Canvas(){

  const convasRef = useRef<HTMLCanvasElement>(null);
  const params = useParams();

  const slug = params.slug as string;

  useEffect(()=>{

    const canvas = convasRef.current;

    if(!canvas || !slug) return;

    initDraw(canvas,slug);

  },[convasRef,slug])

  return <div>
      <canvas className="bg-black" ref={convasRef}></canvas>
  </div>
} 

