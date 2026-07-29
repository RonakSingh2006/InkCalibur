import { Shape } from "./types";

export function moveShape(shape: Shape, dx: number, dy: number) {
  shape.posX += dx;
  shape.posY += dy;

  if (shape.type === "line") {
    const data = JSON.parse(shape.data);
    data.endPointX += dx;
    data.endPointY += dy;
    shape.data = JSON.stringify(data);
  }

  if (shape.type === "pencil") {
    const data = JSON.parse(shape.data);
    if (data.points) {
      data.points = data.points.map((p: { x: number; y: number }) => ({
        x: p.x + dx,
        y: p.y + dy,
      }));
    }
    shape.data = JSON.stringify(data);
  }
}