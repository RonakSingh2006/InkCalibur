import { Shape } from "./types";

export function drawHighlight(ctx: CanvasRenderingContext2D, s: Shape) {
  ctx.strokeStyle = "#6366F1";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 2]);

  if (s.type === "rectangle") {
    const data = JSON.parse(s.data);
    ctx.strokeRect(s.posX - 4, s.posY - 4, data.width + 8, data.height + 8);
  } 
  else if (s.type === "ellipse" || s.type === "circle") {
    const data = JSON.parse(s.data);
    const padding = 6;
    const rx = (data.radiusX || 0) + padding;
    const ry = (data.radiusY || 0) + padding;
    const angle = data.angle || 0;
    ctx.beginPath();
    ctx.ellipse(s.posX, s.posY, rx, ry, angle, 0, 2 * Math.PI);
    ctx.stroke();
  } 
  else if (s.type === "line") {
    const data = JSON.parse(s.data);
    const x1 = s.posX;
    const y1 = s.posY;
    const x2 = data.endPointX;
    const y2 = data.endPointY;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.strokeRect(-length / 2 - 6, -8, length + 12, 16);
    ctx.restore();
  } 
  else if (s.type === "pencil") {
    const data = JSON.parse(s.data);
    if (data.points && data.points.length > 0) {
      let minX = s.posX, maxX = s.posX;
      let minY = s.posY, maxY = s.posY;
      data.points.forEach((p: {x: number, y: number}) => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      });
      ctx.strokeRect(minX - 6, minY - 6, maxX - minX + 12, maxY - minY + 12);
    }
  }

  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
}