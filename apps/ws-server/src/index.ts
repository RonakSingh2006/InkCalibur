import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});

wss.on('connection',socket=>{

  console.log("user connected");

  socket.on('message',(data)=>{
    console.log(data);
    socket.send(data);
  })

})