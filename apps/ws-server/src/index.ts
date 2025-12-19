import "dotenv/config"
import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"

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
const roomsMap = new Map<string,Set<string>>();

interface Join_Leave{
  type : "join_room" | "leave_room",
  roomId : string
}

interface Message{
  type : "chat",
  roomId : string,
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

  socket.on('message',(data)=>{

    if(typeof data !== "string"){
      socket.close();
      console.log("Invalid Data");
      return;
    }

    let parsedData: Message | Join_Leave;
    try {
      parsedData = JSON.parse(data);
    } catch(error) {
      return;
    }


    if(parsedData.type === "join_room"){
      const roomId = parsedData.roomId;

      if(!roomsMap.get(roomId)) roomsMap.set(roomId,new Set());

      roomsMap.get(roomId)?.add(userId);
    }
    else if(parsedData.type === "leave_room"){
      const roomId = parsedData.roomId;

      roomsMap.get(roomId)?.delete(userId);

    }
    else if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      const users = roomsMap.get(roomId);

      if(!users) return;

      users.forEach(u=>{
        const ws = socketMap.get(u);

        ws?.send(message);
      })
    }
  })


  socket.on("close",()=>{
    socketMap.delete(userId);

    roomsMap.forEach(users=>{
      users.delete(userId);
    })
  })
})