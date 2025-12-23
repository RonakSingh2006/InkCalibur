"use client";
import { useEffect, useRef } from "react";
import { Game } from "@/draw/Game";
import Square from "@/icons/Sqaure";
import Circle from "@/icons/Circle";
import Line from "@/icons/Line";
import { useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Ellipse from "@/icons/Ellipse";
import Pencil from "@/icons/Pencil";
import Hand from "@/icons/Hand";

type Shape = "rectangle" | "circle" | "line" | "ellipse" | "pencil" | "hand";


export default function Canvas({ slug , socket , roomId}: { slug: string , socket : WebSocket , roomId : number}) {

  const convasRef = useRef<HTMLCanvasElement>(null);
  const [shape,setShape] = useState<Shape>("rectangle");
  const {size} = useWindowDimensions();
  const gameRef = useRef<Game | null>(null);


  useEffect(()=>{

    gameRef.current?.setTool(shape);

  },[shape])


  useEffect(() => {
    const canvas = convasRef.current;

    if (!canvas || !size) return;

    canvas.width = size.width;
    canvas.height = size.height;

    socket.send(JSON.stringify({
        type : "join_room",
        roomId : roomId
    }))

    gameRef.current = new Game(canvas,slug,socket,roomId);
    gameRef.current?.setTool(shape);

    return ()=>{
      gameRef.current?.destroy();
      gameRef.current = null;
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, socket , roomId , size]);

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

          <button className="cursor-pointer" title="ellipse" onClick={()=>{
            setShape("ellipse");
          }}>
            <Ellipse size={60} color={`${shape === "ellipse" ? "green" : "white"}`}/>
          </button>

          <button className="cursor-pointer" title="line" onClick={()=>{
            setShape("line");
          }}>
            <Line size={30} color={`${shape === "line" ? "green" : "white"}`}/>
          </button>

          <button className="cursor-pointer" title="pencil" onClick={()=>{
            setShape("pencil");
          }}>
            <Pencil size={60} color={`${shape === "pencil" ? "green" : "white"}`}/>
          </button>

          <button className="cursor-pointer" title="hand" onClick={()=>{
            setShape("hand");
          }}>
            <Hand size={60} color={`${shape === "hand" ? "green" : "white"}`}/>
          </button>

        </div>
      </div>
    </div>
  );
}
