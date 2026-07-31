import { Shape, tool } from "./types";
import { rectangleCheck, circleCheck, ellipseCheck, lineCheck, pencilCheck } from "./shapeChecks";
import { drawHighlight, drawEraserHighlight } from "./highlight";
import { drawShape } from "./shapeRenderer";
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
  private panOffsetX : number;
  private panOffsetY : number;
  private panning : boolean;
  private panStartX: number;
  private panStartY: number;
  private strokeColor: string;

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
    this.panOffsetX = 0;
    this.panOffsetY = 0;
    this.panning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.strokeColor = "white";
    this.loadPanOffset();

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
      } else if (parsedData.type === "delete_shape") {
        const deletedId = parsedData.data.id;
        this.shapes = this.shapes.filter((s) => s.id !== deletedId);
        if (this.highlightShape?.id === deletedId) this.highlightShape = null;
        if (this.selectedShape?.id === deletedId) this.selectedShape = null;
        this.render();
      }
    };
  }

  initHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handlemouseMove);
    this.canvas.addEventListener("mouseup", this.handlemouseUp);
  }

  render() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.panOffsetX,this.panOffsetY);
    this.ctx.strokeStyle = this.strokeColor;
    this.shapes.forEach((s) => drawShape(this.ctx, s));

    if (this.highlightShape) {
      if (this.currTool === "eraser") {
        drawEraserHighlight(this.ctx, this.highlightShape);
      } else {
        drawHighlight(this.ctx, this.highlightShape);
      }
    }
    this.ctx.restore();
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

  private deleteShape(shape: Shape) {
    
    this.shapes = this.shapes.filter((s) => s.id !== shape.id);

    
    this.socket.send(
      JSON.stringify({
        type: "delete_shape",
        roomId: this.roomId,
        shapeId: shape.id,
      })
    );
  }

  handleMouseDown = (event: MouseEvent) => {
    const mousePos = this.getMousePos(event);

    if (this.currTool === "eraser") {
      const shape = this.getSelectedShape(mousePos.x, mousePos.y);
      if (shape) {
        this.deleteShape(shape);
        this.highlightShape = null;
        this.render();
      }
    } else if (this.currTool === "select") {
      const shape = this.getSelectedShape(mousePos.x, mousePos.y);
      if (shape) {
        this.selectedShape = shape;
        this.highlightShape = shape;
        this.move = true;
        this.offsetX = mousePos.x - shape.posX;
        this.offsetY = mousePos.y - shape.posY;
        this.setCursor("move");
        this.render();
      } else {
        this.selectedShape = null;
        this.highlightShape = null;
        this.move = false;
        this.render();
      }
    } else if (this.currTool === "hand") {
      this.setCursor("grabbing");
      const rect = this.canvas.getBoundingClientRect();
      this.panStartX = event.clientX - rect.left;
      this.panStartY = event.clientY - rect.top;
      this.panning = true;
    } else {
      this.draw = true;
      this.startX = mousePos.x;
      this.startY = mousePos.y;
      this.points = [{ x: this.startX, y: this.startY }];
      this.ctx.strokeStyle = this.strokeColor;
    }
  };

  handlemouseMove = (event: MouseEvent) => {
    const mousePos = this.getMousePos(event);

    if (this.currTool === "eraser") {
      const shape = this.getSelectedShape(mousePos.x, mousePos.y);
      if (shape) {
        this.setCursor("pointer");
        this.highlightShape = shape;
      } else {
        this.setCursor("crosshair");
        this.highlightShape = null;
      }
      this.render();
    } else if (this.currTool === "select") {
      if (this.move && this.selectedShape) {
        const dx = mousePos.x - this.offsetX - this.selectedShape.posX;
        const dy = mousePos.y - this.offsetY - this.selectedShape.posY;
        moveShape(this.selectedShape, dx, dy);
        this.render();
      } else {
        const shape = this.getSelectedShape(mousePos.x, mousePos.y);
        if (shape) {
          this.setCursor("pointer");
          this.highlightShape = shape;
        } else {
          this.setCursor("default");
          this.highlightShape = null;
        }
        this.render();
      }
    } else if (this.currTool === "hand") {
      if(this.panning){
        const rect = this.canvas.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;
        this.panOffsetX += screenX - this.panStartX;
        this.panOffsetY += screenY - this.panStartY;
        this.panStartX = screenX;
        this.panStartY = screenY;
        this.savePanOffset();

        this.render();
      }
    } else {
      if (!this.draw) return;
      const posX = mousePos.x;
      const posY = mousePos.y;
      this.render();

      if (this.currTool === "pencil") {
        this.points.push({ x: posX, y: posY });
      }

      if (this.currTool === "rectangle") {
        this.ctx.strokeRect(this.startX + this.panOffsetX, this.startY + this.panOffsetY, posX - this.startX, posY - this.startY);
      } else if (this.currTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX + this.panOffsetX, this.startY + this.panOffsetY);
        this.ctx.lineTo(posX + this.panOffsetX, posY + this.panOffsetY);
        this.ctx.stroke();
      } else if (this.currTool === "circle") {
        const dx = posX - this.startX;
        const dy = posY - this.startY;
        this.ctx.beginPath();
        this.ctx.ellipse(this.startX + dx / 2 + this.panOffsetX, this.startY + dy / 2 + this.panOffsetY, Math.abs(dx) / 2, Math.abs(dy) / 2, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
      } else if (this.currTool === "ellipse") {
        const dx = posX - this.startX;
        const dy = posY - this.startY;
        const rx = Math.sqrt(dx * dx + dy * dy) / 2;
        const ry = rx * 0.6;
        const angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.ellipse(this.startX + dx / 2 + this.panOffsetX, this.startY + dy / 2 + this.panOffsetY, rx, ry, angle, 0, 2 * Math.PI);
        this.ctx.stroke();
      } else if (this.currTool === "pencil") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX + this.panOffsetX, this.startY + this.panOffsetY);
        this.points.forEach((p) => {
          this.ctx.lineTo(p.x + this.panOffsetX, p.y + this.panOffsetY);
        });
        this.ctx.stroke();
      }
    }
  };

  handlemouseUp = async (_event: MouseEvent) => {
    if (this.currTool === "eraser" || this.currTool === "select") {
      if (this.currTool === "select" && this.move && this.selectedShape) {
        this.move = false;
        this.socket.send(
          JSON.stringify({
            type: "update_shape",
            roomId: this.roomId,
            shape: this.selectedShape,
          })
        );
        this.selectedShape = null;
        this.setCursor("default");
      }
    } else if (this.currTool === "hand") {
      this.setCursor("grab");
      this.panning = false;
    } else {
      this.draw = false;
      const mousePos = this.getMousePos(_event);
      const tempId = this.nextTempId--;

      const s = createShape(this.currTool, this.startX, this.startY, mousePos.x, mousePos.y, this.points, tempId, this.strokeColor);
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
    return { x: e.clientX - rect.left - this.panOffsetX, y: e.clientY - rect.top - this.panOffsetY };
  }

  setTool(t: tool) {
    if (this.currTool === "select" || this.currTool === "eraser") {
      this.highlightShape = null;
      this.render();
    }
    this.currTool = t;
    if (t === "hand") this.setCursor("grab");
    else if (t === "select") this.setCursor("default");
    else if (t === "eraser") this.setCursor("crosshair");
    else this.setCursor("crosshair");
  }

  setStrokeColor(color: string) {
    this.strokeColor = color;
    this.ctx.strokeStyle = color;
  }

  clearCanvas() {
    this.shapes = [];
    this.highlightShape = null;
    this.selectedShape = null;
    this.render();
    this.socket.send(JSON.stringify({ type: "clear_canvas", roomId: this.roomId }));
  }

  private loadPanOffset() {
    try {
      const saved = localStorage.getItem(`panOffset_${this.slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.panOffsetX = parsed.x || 0;
        this.panOffsetY = parsed.y || 0;
      }
    } catch (e) {
        console.log(e);
    }
  }

  private savePanOffset() {
    try {
      localStorage.setItem(
        `panOffset_${this.slug}`,
        JSON.stringify({ x: this.panOffsetX, y: this.panOffsetY })
      );
    } catch (e) {
      console.log(e);
    }
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