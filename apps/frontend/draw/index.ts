import { BACKEND_URL } from "@repo/common/config";
import axios from "axios"

interface Shape {
  type : "circle" | "line" | "rectangle",
  posX  : number,
  posY  : number
  data  : string
}


export async function initDraw(canvas : HTMLCanvasElement , slug : string){

  const shapes : Shape[] = await getAllShapes(slug);

  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  
  let draw:boolean = false;
  let startX:number = 0;
  let startY:number = 0;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  render(shapes,ctx);
  
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
      render(shapes,ctx);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX,startY,w,h);
    }
  });

  canvas.addEventListener("mouseup",async (event)=>{
    draw = false;
    const posX = event.clientX;
    const posY = event.clientY;

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

    shapes.push(s);

    try{
      await axios.post(`${BACKEND_URL}/shape/${slug}`,s,{
        headers : {"Authorization" : localStorage.getItem('token')}
      });
    }
    catch(error){
      console.log(error);
    }
    
    render(shapes,ctx);

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