import { BACKEND_URL } from "@repo/common/config";
import axios from "axios"

interface Shape {
  type : "circle" | "line" | "rectangle",
  posX  : number,
  posY  : number
  data  : string
}


export async function initDraw(canvas : HTMLCanvasElement , slug : string , socket : WebSocket , roomId : number){

  const shapes : Shape[] = await getAllShapes(slug);

  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  
  let draw:boolean = false;
  let startX:number = 0;
  let startY:number = 0;
  
  render(shapes,ctx);


  socket.onmessage = (event)=>{
    const parsedData = JSON.parse(event.data);

    if(parsedData.type === "shape"){
      const s:Shape = parsedData.data;

      shapes.push(s);

      render(shapes,ctx);
    }
  }

  canvas.addEventListener("mousedown",(event)=>{
    const currShape = window.selectedShape;

    draw = true;
    const posX = event.clientX;
    const posY = event.clientY;
    startX = posX;
    startY = posY;
  });

  canvas.addEventListener("mousemove",(event)=>{
    const currShape = window.selectedShape;

    const posX = event.clientX;
    const posY = event.clientY;

    if(currShape === "rectangle"){
      const w = posX - startX;
      const h = posY - startY;

      if(draw){
        render(shapes,ctx);
        ctx.strokeStyle = "white";
        ctx.strokeRect(startX,startY,w,h);
      }
    }
    else if(currShape === "circle"){
      const dx = posX - startX;
      const dy = posY - startY;

      const radiusX = Math.sqrt(dx * dx + dy * dy) / 2;
      const radiusY = radiusX * 0.6; 
      const centerX = startX + dx/2;
      const centerY = startY + dy/2;
      const angle = Math.atan2(dy,dx);

      if(draw){
        render(shapes,ctx);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, angle, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
    else if(currShape === "line"){
      if(draw){
        render(shapes,ctx);

        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(posX,posY);
        ctx.stroke();
      }
    }
    
  });

  canvas.addEventListener("mouseup",async (event)=>{
    const currShape = window.selectedShape;
    draw = false;
    const posX = event.clientX;
    const posY = event.clientY;

    if(currShape === "rectangle"){
      const w = posX - startX;
      const h = posY - startY;

      const s:Shape = {
        type : "rectangle",
        posX : startX,
        posY : startY,
        data : JSON.stringify({
          width : w,
          height : h
        })
      }


      socket.send(JSON.stringify({
        type : "add_shape",
        roomId : roomId,
        shape : s
      }))
    }
    else if(currShape === "circle"){
      const dx = posX - startX;
      const dy = posY - startY;

      const radiusX = Math.sqrt(dx * dx + dy * dy) / 2;
      const radiusY = radiusX * 0.6; 
      const centerX = startX + dx/2;
      const centerY = startY + dy/2;
      const angle = Math.atan2(dy,dx);

      const s:Shape = {
        type : "circle",
        posX : centerX,
        posY : centerY,
        data : JSON.stringify({
          angle,
          radiusX,
          radiusY
        })
      }

      socket.send(JSON.stringify({
        type : "add_shape",
        roomId : roomId,
        shape : s
      }))
    }
    else if(currShape === "line"){
      const s:Shape = {
        type : "line",
        posX : startX,
        posY : startY,
        data : JSON.stringify({
          endPointX : posX,
          endPointY : posY
        })
      }

      socket.send(JSON.stringify({
        type : "add_shape",
        roomId : roomId,
        shape : s
      }))
    }
  });
}

function render(shapes : Shape[] , ctx : CanvasRenderingContext2D){
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  
  shapes.forEach((s)=>{
    if(s.type === "rectangle"){
      const data = JSON.parse(s.data);

      ctx.strokeStyle = "white";
      ctx.strokeRect(s.posX,s.posY,data.width,data.height);
    }
    else if(s.type === "circle"){

      const data = JSON.parse(s.data);

      ctx.beginPath();
      ctx.ellipse(s.posX, s.posY, data.radiusX, data.radiusY, data.angle, 0, 2 * Math.PI);
      ctx.stroke();
    }
    else if(s.type === "line"){
      const data = JSON.parse(s.data);

      ctx.beginPath();
      ctx.moveTo(s.posX,s.posY);
      ctx.lineTo(data.endPointX,data.endPointY);
      ctx.stroke();
    }
  })
}

async function getAllShapes(slug : string) {
  try{
    const response = await axios.get(`${BACKEND_URL}/shapes/${slug}`);
    return response.data.shapes;
  }

  catch(err){
    if(axios.isAxiosError(err)){
      console.log(err.response?.data.message);
    }
    else{
      console.log(err);
    }

    return [];
  }
}