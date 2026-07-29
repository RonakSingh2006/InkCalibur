import { Shape } from "./types";

export function rectangleCheck(s: Shape, px: number, py: number): boolean {
  const data = JSON.parse(s.data);
  const x1 = s.posX;
  const y1 = s.posY;
  const x2 = s.posX + data.width;
  const y2 = s.posY + data.height;

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  const tolerance = 8;
  return px >= minX - tolerance && px <= maxX + tolerance &&
         py >= minY - tolerance && py <= maxY + tolerance;
}

export function circleCheck(s: Shape, px: number, py: number): boolean {
  const data = JSON.parse(s.data);
  const dx = px - s.posX;
  const dy = py - s.posY;
  const rx = data.radiusX + 8;
  const ry = data.radiusY + 8;
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
}

export function ellipseCheck(s: Shape, px: number, py: number): boolean {
  const data = JSON.parse(s.data);
  const dx = px - s.posX;
  const dy = py - s.posY;
  const cos = Math.cos(-data.angle);
  const sin = Math.sin(-data.angle);
  const rotatedX = dx * cos - dy * sin;
  const rotatedY = dx * sin + dy * cos;
  const rx = data.radiusX + 8;
  const ry = data.radiusY + 8;
  return (rotatedX * rotatedX) / (rx * rx) + (rotatedY * rotatedY) / (ry * ry) <= 1;
}

export function lineCheck(s: Shape, px: number, py: number): boolean {
  const data = JSON.parse(s.data);
  const x1 = s.posX;
  const y1 = s.posY;
  const x2 = data.endPointX;
  const y2 = data.endPointY;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    const dist = Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    return dist <= 8;
  }

  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const dist = Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));

  return dist <= 8;
}

export function pencilCheck(s: Shape, px: number, py: number): boolean {
  const data = JSON.parse(s.data);
  const points = data.points as {x: number, y: number}[];

  if (!points || points.length === 0) {
    const dist = Math.sqrt((px - s.posX) * (px - s.posX) + (py - s.posY) * (py - s.posY));
    return dist <= 8;
  }

  let prevX = s.posX;
  let prevY = s.posY;

  for (const p of points) {
    const dx = p.x - prevX;
    const dy = p.y - prevY;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq > 0) {
      const t = Math.max(0, Math.min(1, ((px - prevX) * dx + (py - prevY) * dy) / lengthSq));
      const projX = prevX + t * dx;
      const projY = prevY + t * dy;
      const dist = Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
      if (dist <= 8) return true;
    }

    prevX = p.x;
    prevY = p.y;
  }

  return false;
}