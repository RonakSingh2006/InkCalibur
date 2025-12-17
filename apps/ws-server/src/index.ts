import "dotenv/config"
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"

const wss = new WebSocketServer({port : 8080});

wss.on('connection',(socket,req)=>{

  const url = req.url;

  if(!url){
    wss.close();
    return;
  }

  const query = url.split("?")[1];

  const queryParams = new URLSearchParams(query);

  const token = queryParams.get('token') || "";
  
  try{
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;

    const userId = decoded.userId;

    console.log(userId);

    socket.on('message',(data)=>{
      console.log(data);
      socket.send(data);
    })

  }
  catch(err){
    wss.close();
  }

})