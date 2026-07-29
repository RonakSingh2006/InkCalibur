import { Shape } from "./types";
import { drawPencil } from "./draw";

export function drawShape(ctx: CanvasRenderingContext2D, s: Shape) {
  if (s.type === "rectangle") {
    const data = JSON.parse(s.data);
    ctx.strokeStyle = "white";
    ctx.strokeRect(s.posX, s.posY, data.width, data.height);
  } else if (s.type === "ellipse") {
    const data = JSON.parse(s.data);
    ctx.beginPath();
    ctx.ellipse(s.posX, s.posY, data.radiusX, data.radiusY, data.angle, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (s.type === "line") {
    const data = JSON.parse(s.data);
    ctx.beginPath();
    ctx.moveTo(s.posX, s.posY);
    ctx.lineTo(data.endPointX, data.endPointY);
    ctx.stroke();
  } else if (s.type === "circle") {
    const data = JSON.parse(s.data);
    ctx.beginPath();
    ctx.ellipse(s.posX, s.posY, data.radiusX, data.radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (s.type === "pencil") {
    const data = JSON.parse(s.data);
    drawPencil(s.posX, s.posY, ctx, data.points);
  }
}