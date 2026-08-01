"use client"
import { useSocket } from "@/hooks/useSocket";
import Canvas from "./Canvas";

export default function CanvasSocket({slug , roomId, inviteCode} : {slug : string , roomId : number, inviteCode?: string}){
  const {loading,socket} = useSocket();

  if(loading || !socket){
    return <div>
      Connecting.....
    </div>
  }
  return <Canvas slug={slug} socket = {socket} roomId = {roomId} inviteCode={inviteCode}/>
}