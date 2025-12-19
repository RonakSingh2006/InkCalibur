"use client"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useRef, useState } from "react";

interface Chat{
  id : number,
  message :  string,
  userId :   string,
  roomId :   number
}

export default function ChatRoomClient({chats,id} : {chats : Chat[] , id : string}){

  const {loading,socket} = useSocket();
  const inpRef = useRef<HTMLInputElement>(null);
  const [messages,setMessages] = useState(chats);

  useEffect(()=>{
    if(socket && !loading){

      socket.send(JSON.stringify({
        type : "join_room",
        roomId : id
      }))

      socket.onmessage = (event)=>{

        const parsedData = JSON.parse(event.data);

        
        if(parsedData.type === "chat"){
          setMessages(prev => [...prev,parsedData.data]);
        }
      }

    }
  },[socket,loading,id]);

  return <div>

    {messages.map((m)=><div key={m.id}>{`${m.message}  ${m.id}`}</div>)}

    <div>
      <input placeholder="Enter Text" ref={inpRef}></input>
      <button onClick={()=>{
        
        if(inpRef.current && socket){
          socket?.send(JSON.stringify({
          type : "chat",
          roomId : id,
          message : inpRef.current.value
        }));

        }
      }}>Send</button>
    </div>
  </div>
}