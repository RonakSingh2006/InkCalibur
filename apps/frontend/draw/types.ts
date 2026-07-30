export interface Shape {
  id: number;
  type: "circle" | "line" | "rectangle" | "ellipse" | "pencil";
  posX: number;
  posY: number;
  data: string;
}

export type tool = "rectangle" | "circle" | "line" | "ellipse" | "pencil" | "hand" | "select" | "eraser";