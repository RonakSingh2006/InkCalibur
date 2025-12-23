import { BACKEND_URL } from "@repo/common/config";
import axios from "axios";

interface Shape {
  type: "circle" | "line" | "rectangle";
  posX: number;
  posY: number;
  data: string;
}

type tool = "circle" | "rectangle" | "line";

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
    this.shapes = [];
    this.startX = 0;
    this.startY = 0;

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
        const s: Shape = parsedData.data;

        this.shapes.push(s);

        this.render();
      }
    };
  }

  initHandlers(){
    this.canvas.addEventListener("mousedown",this.handleMouseDown);
    this.canvas.addEventListener("mousemove",this.handlemouseMove);
    this.canvas.addEventListener("mouseup",this.handlemouseUp);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shapes.forEach((s) => {
      if (s.type === "rectangle") {
        const data = JSON.parse(s.data);

        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(s.posX, s.posY, data.width, data.height);
      } else if (s.type === "circle") {
        const data = JSON.parse(s.data);

        this.ctx.beginPath();
        this.ctx.ellipse(
          s.posX,
          s.posY,
          data.radiusX,
          data.radiusY,
          data.angle,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
      } else if (s.type === "line") {
        const data = JSON.parse(s.data);

        this.ctx.beginPath();
        this.ctx.moveTo(s.posX, s.posY);
        this.ctx.lineTo(data.endPointX, data.endPointY);
        this.ctx.stroke();
      }
    });
  }

  handleMouseDown = (event: MouseEvent) => {
    this.draw = true;

    const mousePos = this.getMousePos(event);
    this.startX = mousePos.x;
    this.startY = mousePos.y;

    this.ctx.strokeStyle = "white";
  };

  handlemouseMove = (event: MouseEvent) => {
    if (!this.draw) return;

    const mousePos = this.getMousePos(event);
    const posX = mousePos.x;
    const posY = mousePos.y;

    this.render();

    if (this.currTool === "rectangle") {
      const w = posX - this.startX;
      const h = posY - this.startY;

      this.ctx.strokeRect(this.startX, this.startY, w, h);
    } else if (this.currTool === "circle") {
      const dx = posX - this.startX;
      const dy = posY - this.startY;

      const radiusX = Math.sqrt(dx * dx + dy * dy) / 2;
      const radiusY = radiusX * 0.6;
      const centerX = this.startX + dx / 2;
      const centerY = this.startY + dy / 2;
      const angle = Math.atan2(dy, dx);

      this.ctx.beginPath();
      this.ctx.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        angle,
        0,
        2 * Math.PI
      );
      this.ctx.stroke();
    } else if (this.currTool === "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(posX, posY);
      this.ctx.stroke();
    }
  };

  handlemouseUp = async (event: MouseEvent) => {
    this.draw = false;

    const mousePos = this.getMousePos(event);
    const posX = mousePos.x;
    const posY = mousePos.y;

    let s: Shape | null = null;

    if (this.currTool === "rectangle") {
      const w = posX - this.startX;
      const h = posY - this.startY;

      s = {
        type: "rectangle",
        posX: this.startX,
        posY: this.startY,
        data: JSON.stringify({
          width: w,
          height: h,
        }),
      };
    } else if (this.currTool === "circle") {
      const dx = posX - this.startX;
      const dy = posY - this.startY;

      const radiusX = Math.sqrt(dx * dx + dy * dy) / 2;
      const radiusY = radiusX * 0.6;
      const centerX = this.startX + dx / 2;
      const centerY = this.startY + dy / 2;
      const angle = Math.atan2(dy, dx);

      s = {
        type: "circle",
        posX: centerX,
        posY: centerY,
        data: JSON.stringify({
          angle,
          radiusX,
          radiusY,
        }),
      };
    } else if (this.currTool === "line") {
      s = {
        type: "line",
        posX: this.startX,
        posY: this.startY,
        data: JSON.stringify({
          endPointX: posX,
          endPointY: posY,
        }),
      };
    }

    if (s) {
      this.socket.send(
        JSON.stringify({
          type: "add_shape",
          roomId: this.roomId,
          shape: s,
        })
      );
    }
  };



  getMousePos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  setTool(t: tool) {
    this.currTool = t;
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handlemouseMove);
    this.canvas.removeEventListener("mouseup", this.handlemouseUp);
  }
}

async function getAllShapes(slug: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/shapes/${slug}`);
    return response.data.shapes;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data.message);
    } else {
      console.log(err);
    }

    return [];
  }
}
