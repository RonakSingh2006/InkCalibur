"use client"
import { useSocket } from "@/hooks/useSocket";
import Canvas from "./Canvas";

export default function CanvasSocket({inviteCode , roomId} : {inviteCode : string , roomId : number}){
  const {loading,socket} = useSocket();

  if(loading || !socket){
    return <div>
      Connecting.....
    </div>
  }
  return <Canvas inviteCode={inviteCode} socket = {socket} roomId = {roomId}/>
}