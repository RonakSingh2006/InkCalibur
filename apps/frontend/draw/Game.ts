import { Shape, tool } from "./types";
import { rectangleCheck, circleCheck, ellipseCheck, lineCheck, pencilCheck } from "./shapeChecks";
import { drawHighlight } from "./highlight";
import { drawShape } from "./shapeRenderer";
import { drawPencil } from "./draw";
import { createShape } from "./shapeFactory";
import { moveShape } from "./moveHandler";
import { getAllShapes } from "./api";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private socket: WebSocket;
  private shapes: Shape[];
  private slug: string;
  private roomId: number;
  private startX: number;
  private startY: number;
  private currTool: tool;
  private draw: boolean;
  private move: boolean;
  private points: { x: number; y: number }[];
  private selectedShape: Shape | null;
  private offsetX: number;
  private offsetY: number;
  private highlightShape: Shape | null;
  private nextTempId: number;

  constructor(
    canvas: HTMLCanvasElement,
    slug: string,
    socket: WebSocket,
    roomId: number
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.slug = slug;
    this.socket = socket;
    this.roomId = roomId;
    this.currTool = "rectangle";
    this.draw = false;
    this.move = false;
    this.shapes = [];
    this.startX = 0;
    this.startY = 0;
    this.points = [];
    this.selectedShape = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.highlightShape = null;
    this.nextTempId = -1;
    this.canvas.style.cursor = "crosshair";

    this.init();
    this.initHandlers();
    this.initSocketHandler();
  }

  async init() {
    this.shapes = await getAllShapes(this.slug);
    this.render();
  }

  initSocketHandler() {
    this.socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      if (parsedData.type === "shape") {
        this.shapes.push(parsedData.data);
        this.render();
      } else if (parsedData.type === "clear_canvas") {
        this.shapes = [];
        this.render();
      } else if (parsedData.type === "update_shape") {
        const updatedShape: Shape = parsedData.data;
        const index = this.shapes.findIndex((s) => s.id === updatedShape.id);
        if (index !== -1) {
          this.shapes[index] = updatedShape;
          this.render();
        }
      }
    };
  }

  initHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handlemouseMove);
    this.canvas.addEventListener("mouseup", this.handlemouseUp);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach((s) => drawShape(this.ctx, s));
    if (this.highlightShape) {
      drawHighlight(this.ctx, this.highlightShape);
    }
  }

  private getSelectedShape(px: number, py: number): Shape | null {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const s = this.shapes[i];
      if (s.type === "rectangle" && rectangleCheck(s, px, py)) return s;
      if (s.type === "circle" && circleCheck(s, px, py)) return s;
      if (s.type === "ellipse" && ellipseCheck(s, px, py)) return s;
      if (s.type === "line" && lineCheck(s, px, py)) return s;
      if (s.type === "pencil" && pencilCheck(s, px, py)) return s;
    }
    return null;
  }

  handleMouseDown = (event: MouseEvent) => {
    const mousePos = this.getMousePos(event);

    if (this.currTool === "select") {
      const shape = this.getSelectedShape(mousePos.x, mousePos.y);
      if (shape) {
        this.selectedShape = shape;
        this.highlightShape = shape;
        this.move = true;
        this.offsetX = mousePos.x - shape.posX;
        this.offsetY = mousePos.y - shape.posY;
        this.canvas.style.cursor = "move";
        this.render();
      } else {
        this.selectedShape = null;
        this.highlightShape = null;
        this.move = false;
        this.render();
      }
    } else if (this.currTool === "hand") {
      
    } else {
      this.draw = true;
      this.startX = mousePos.x;
      this.startY = mousePos.y;
      this.points = [{ x: this.startX, y: this.startY }];
      this.ctx.strokeStyle = "white";
    }
  };

  handlemouseMove = (event: MouseEvent) => {
    const mousePos = this.getMousePos(event);

    if (this.currTool === "select") {
      if (this.move && this.selectedShape) {
        const dx = mousePos.x - this.offsetX - this.selectedShape.posX;
        const dy = mousePos.y - this.offsetY - this.selectedShape.posY;
        moveShape(this.selectedShape, dx, dy);
        this.render();
      } else {
        const shape = this.getSelectedShape(mousePos.x, mousePos.y);
        if (shape) {
          this.canvas.style.cursor = "pointer";
          this.highlightShape = shape;
        } else {
          this.canvas.style.cursor = "default";
          this.highlightShape = null;
        }
        this.render();
      }
    } else if (this.currTool === "hand") {
       
    } else {
      if (!this.draw) return;
      const posX = mousePos.x;
      const posY = mousePos.y;
      this.render();

      if (this.currTool === "pencil") {
        this.points.push({ x: posX, y: posY });
      }

      
      if (this.currTool === "rectangle") {
        this.ctx.strokeRect(this.startX, this.startY, posX - this.startX, posY - this.startY);
      } else if (this.currTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(posX, posY);
        this.ctx.stroke();
      } else if (this.currTool === "circle") {
        const dx = posX - this.startX;
        const dy = posY - this.startY;
        this.ctx.beginPath();
        this.ctx.ellipse(this.startX + dx / 2, this.startY + dy / 2, Math.abs(dx) / 2, Math.abs(dy) / 2, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
      } else if (this.currTool === "ellipse") {
        const dx = posX - this.startX;
        const dy = posY - this.startY;
        const rx = Math.sqrt(dx * dx + dy * dy) / 2;
        const ry = rx * 0.6;
        const angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.ellipse(this.startX + dx / 2, this.startY + dy / 2, rx, ry, angle, 0, 2 * Math.PI);
        this.ctx.stroke();
      } else if (this.currTool === "pencil") {
        drawPencil(this.startX, this.startY, this.ctx, this.points);
      }
    }
  };

  handlemouseUp = async (_event: MouseEvent) => {
    if (this.currTool === "select") {
      if (this.move && this.selectedShape) {
        this.move = false;
        this.socket.send(
          JSON.stringify({
            type: "update_shape",
            roomId: this.roomId,
            shape: this.selectedShape,
          })
        );
        this.selectedShape = null;
        this.canvas.style.cursor = "default";
      }
    } else if (this.currTool === "hand") {
     
    } else {
      this.draw = false;
      const mousePos = this.getMousePos(_event);
      const tempId = this.nextTempId--;

      const s = createShape(this.currTool, this.startX, this.startY, mousePos.x, mousePos.y, this.points, tempId);
      this.points = [];

      if (s) {
        this.socket.send(
          JSON.stringify({ type: "add_shape", roomId: this.roomId, shape: s })
        );
      }
    }
  };

  getMousePos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  setTool(t: tool) {
    if (this.currTool === "select") {
      this.highlightShape = null;
      this.render();
    }
    this.currTool = t;
    if (t === "hand") this.setCursor("grab");
    else if (t === "select") this.setCursor("default");
    else this.setCursor("crosshair");
  }

  clearCanvas() {
    this.shapes = [];
    this.render();
    this.socket.send(JSON.stringify({ type: "clear_canvas", roomId: this.roomId }));
  }

  setCursor(cursor: string) {
    this.canvas.style.cursor = cursor;
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handlemouseMove);
    this.canvas.removeEventListener("mouseup", this.handlemouseUp);
  }
}