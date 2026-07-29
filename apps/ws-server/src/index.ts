import "dotenv/config"
import { WebSocketServer } from "ws";
import { checkUser } from "./auth";
import { socketMap } from "./store";
import {
  handleJoinRoom,
  handleLeaveRoom,
  handleAddShape,
  handleUpdateShape,
  handleClearCanvas,
  handleDisconnect,
} from "./handlers";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, req) => {
  const url = req.url;
  if (!url) {
    socket.close();
    return;
  }

  const query = url.split("?")[1];
  const queryParams = new URLSearchParams(query);
  const token = queryParams.get("token") || "";

  const userId = checkUser(token);
  if (!userId) {
    socket.close();
    return;
  }

  socketMap.set(userId, socket);

  socket.on("message", async (data) => {
    let parsedData: any;
    try {
      parsedData = JSON.parse(data.toString());
    } catch {
      return;
    }

    const { type, roomId } = parsedData;

    if (type === "join_room") {
      handleJoinRoom(socket, roomId, userId);
    } else if (type === "leave_room") {
      handleLeaveRoom(socket, roomId, userId);
    } else if (type === "add_shape") {
      await handleAddShape(socket, roomId, parsedData.shape, userId);
    } else if (type === "update_shape") {
      await handleUpdateShape(socket, roomId, parsedData.shape);
    } else if (type === "clear_canvas") {
      await handleClearCanvas(socket, roomId);
    }
  });

  socket.on("close", () => {
    socketMap.delete(userId);
    handleDisconnect(userId);
  });
});