interface ellipseProps {
  startX: number;
  startY: number;
  posX: number;
  posY: number;
  ctx: CanvasRenderingContext2D;
}

export function drawEllipse({startX,startY,posX,posY,ctx}: ellipseProps) {
  const dx = posX - startX;
  const dy = posY - startY;

  const radiusX = Math.sqrt(dx * dx + dy * dy) / 2;
  const radiusY = radiusX * 0.6;
  const centerX = startX + dx / 2;
  const centerY = startY + dy / 2;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, angle, 0, 2 * Math.PI);
  ctx.stroke();


  return {radiusX,radiusY,centerX,centerY,angle};
}


export function drawPencil(startX : number , startY : number , ctx : CanvasRenderingContext2D , points : {x : number , y : number}[]){
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  points.forEach((p)=>{
    ctx.lineTo(p.x,p.y);
  })
  ctx.stroke();
}