import { Shape } from "./types";

export function createShape(
  tool: string,
  startX: number,
  startY: number,
  posX: number,
  posY: number,
  points: { x: number; y: number }[],
  tempId: number,
  strokeColor?: string,
  strokeWidth?: number
): Shape | null {
  if (tool === "rectangle") {
    const w = posX - startX;
    const h = posY - startY;

    return {
      id: tempId,
      type: "rectangle",
      posX: startX,
      posY: startY,
      data: JSON.stringify({ width: w, height: h }),
      strokeColor,
      strokeWidth,
    };
  }

  if (tool === "ellipse") {
    const dx = posX - startX;
    const dy = posY - startY;
    const radiusX = Math.sqrt(dx * dx + dy * dy) / 2;
    const radiusY = radiusX * 0.6;
    const centerX = startX + dx / 2;
    const centerY = startY + dy / 2;
    const angle = Math.atan2(dy, dx);

    return {
      id: tempId,
      type: "ellipse",
      posX: centerX,
      posY: centerY,
      data: JSON.stringify({ angle, radiusX, radiusY }),
      strokeColor,
      strokeWidth,
    };
  }

  if (tool === "line") {
    return {
      id: tempId,
      type: "line",
      posX: startX,
      posY: startY,
      data: JSON.stringify({ endPointX: posX, endPointY: posY }),
      strokeColor,
      strokeWidth,
    };
  }

  if (tool === "circle") {
    const dx = posX - startX;
    const dy = posY - startY;
    const radiusX = Math.abs(dx) / 2;
    const radiusY = Math.abs(dy) / 2;
    const centerX = startX + dx / 2;
    const centerY = startY + dy / 2;

    return {
      id: tempId,
      type: "circle",
      posX: centerX,
      posY: centerY,
      data: JSON.stringify({ radiusX, radiusY }),
      strokeColor,
      strokeWidth,
    };
  }

  if (tool === "pencil") {
    return {
      id: tempId,
      type: "pencil",
      posX: startX,
      posY: startY,
      data: JSON.stringify({ points }),
      strokeColor,
      strokeWidth,
    };
  }

  return null;
}