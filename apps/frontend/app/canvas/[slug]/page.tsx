"use client"
import { useEffect, useRef } from "react";

// export default async function Canvas({params} : {params : Promise<{slug : string}>}){

//   const {slug} = await params;

//   const convasRef = useRef<HTMLCanvasElement>(null);

//   return <div>
//       <canvas className="w-screen h-screen bg-zinc-900"></canvas>
//   </div>
// } 

export default function Canvas(){

  const convasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{

    const canvas = convasRef.current;

    initCanvas(canvas);

  },[convasRef])

  return <div>
      <canvas className="bg-zinc-900" ref={convasRef}></canvas>
  </div>
} 

function initCanvas(canvas : HTMLCanvasElement | null){
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  let draw:boolean = false;
  let startX:number = 0;
  let startY:number = 0;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;



  canvas.addEventListener("mousedown",(event)=>{
    draw = true;
    const posX = event.clientX;
    const posY = event.clientY;
    startX = posX;
    startY = posY;
  });

  canvas.addEventListener("mousemove",(event)=>{
    const posX = event.clientX;
    const posY = event.clientY;

    const w = posX - startX;
    const h = posY - startY;

    if(draw){
      ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX,startY,w,h);
    }
  });

  canvas.addEventListener("mouseup",(event)=>{
    draw = false;
    const posX = event.clientX;
    const posY = event.clientY;
    console.log(posX,posY);
  });


}