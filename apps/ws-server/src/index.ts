import "dotenv/config"
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import {prisma} from "@repo/db/client"

const wss = new WebSocketServer({port : 8080});

function checkUser(token :string) : null | string{
  try{
    const decoded = jwt.verify(token,JWT_SECRET);

    if(typeof decoded === "string") return null;

    if(!decoded || !decoded.userId){
      return null;
    }

    return decoded.userId;
  }
  catch(err){
    return null;
  }
}

//  user -> ws
const socketMap = new Map<string,WebSocket>();

// room -> users
const roomsMap = new Map<number,Set<string>>();

interface Join_Leave{
  type : "join_room" | "leave_room",
  roomId : number
}

interface Message{
  type : "chat",
  roomId : number,
  message : string
}

wss.on('connection',(socket,req)=>{

  const url = req.url;

  if(!url){
    socket.close();
    return;
  }

  const query = url.split("?")[1];
  const queryParams = new URLSearchParams(query);
  const token = queryParams.get('token') || "";

  const userId = checkUser(token);

  if(!userId){
    socket.close();
    return;
  }

  socketMap.set(userId,socket);

  socket.on('message',async (data)=>{

    let parsedData: Message | Join_Leave;
    try {
      parsedData = JSON.parse(data.toString());
    } catch(error) {
      return;
    }


    if(parsedData.type === "join_room"){
      const roomId = parsedData.roomId;

      if(!roomsMap.get(roomId)) roomsMap.set(roomId,new Set());

      if(roomsMap.get(roomId)?.has(userId)){
        socket.send("Already Connected");
        return;
      }

      roomsMap.get(roomId)?.add(userId);

      socket.send("Joined Room");
    }
    else if(parsedData.type === "leave_room"){
      const roomId = parsedData.roomId;

      roomsMap.get(roomId)?.delete(userId);

      socket.send("Leaved Room");
      socket.close();

    }
    else if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      const users = roomsMap.get(roomId);

      if(!users) return;

      try{
        await prisma.chat.create({
          data : {
            message,
            userId,
            roomId
          }
        })

        users.forEach(u=>{
          const ws = socketMap.get(u);

          ws?.send(message);
        })

      }
      catch(err){
        socket.send("DB ERROR");
        socket.close();
      }
    }
  })


  socket.on("close",()=>{
    socketMap.delete(userId);

    roomsMap.forEach(users=>{
      users.delete(userId);
    })

    socket.send("Disconnected");
  })
})