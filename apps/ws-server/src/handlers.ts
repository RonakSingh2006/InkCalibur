import { WebSocket } from "ws";
import { prisma } from "@repo/db/client";
import {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
  broadcastToRoom,
  getSocket,
  getDbId,
  storeShapeMapping,
  clearRoomMappings,
  removeShapeMapping,
  removeUserFromAllRooms,
} from "./store";

interface Shape {
  id: number;
  type: "circle" | "line" | "rectangle" | "ellipse" | "pencil";
  posX: number;
  posY: number;
  data: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export function handleJoinRoom(socket: WebSocket, roomId: number, userId: string) {
  const users = getRoomUsers(roomId);
  if (users?.has(userId)) {
    socket.send(
      JSON.stringify({ type: "server_message", message: "Already Connected" })
    );
    return;
  }
  addUserToRoom(roomId, userId);
  socket.send(JSON.stringify({ type: "server_message", message: "Joined Room" }));
}

export function handleLeaveRoom(socket: WebSocket, roomId: number, userId: string) {
  removeUserFromRoom(roomId, userId);
  socket.send(JSON.stringify({ type: "server_message", message: "Leaved Room" }));
  socket.close();
}

export async function handleAddShape(
  socket: WebSocket,
  roomId: number,
  shape: Shape,
  userId: string
) {
  const users = getRoomUsers(roomId);
  if (!users) return;

  try {
    const dbShape = await prisma.shape.create({
      data: {
        type: shape.type,
        posX: shape.posX,
        posY: shape.posY,
        data: shape.data,
        strokeColor: shape.strokeColor || null,
        strokeWidth: shape.strokeWidth || 2,
        userId,
        roomId,
      },
    });

    storeShapeMapping(shape.id, dbShape.id, roomId);

    broadcastToRoom(roomId, { type: "shape", data: dbShape });
  } catch (err) {
    socket.send(JSON.stringify({ type: "server_message", message: "DB ERROR" }));
    socket.close();
  }
}

export async function handleUpdateShape(
  socket: WebSocket,
  roomId: number,
  shape: Shape
) {
  const users = getRoomUsers(roomId);
  if (!users) return;

  const dbId = getDbId(shape.id);

  try {
    const updatedShape = await prisma.shape.update({
      where: { id: dbId },
      data: {
        posX: shape.posX,
        posY: shape.posY,
        data: shape.data,
        strokeColor: shape.strokeColor || null,
        strokeWidth: shape.strokeWidth || 2,
      },
    });

    broadcastToRoom(roomId, { type: "update_shape", data: updatedShape });
  } catch (err) {
    socket.send(JSON.stringify({ type: "server_message", message: "DB ERROR" }));
  }
}

export async function handleDeleteShape(socket: WebSocket, roomId: number, shapeId: number) {
  const users = getRoomUsers(roomId);
  if (!users) return;

  const dbId = getDbId(shapeId);

  try {
    await prisma.shape.delete({ where: { id: dbId } });
    removeShapeMapping(shapeId);
    broadcastToRoom(roomId, { type: "delete_shape", data: { id: dbId } });
  } catch (err) {
    socket.send(JSON.stringify({ type: "server_message", message: "DB ERROR" }));
  }
}

export async function handleClearCanvas(socket: WebSocket, roomId: number) {
  const users = getRoomUsers(roomId);
  if (!users) return;

  try {
    await prisma.shape.deleteMany({ where: { roomId } });
    clearRoomMappings(roomId);
    broadcastToRoom(roomId, { type: "clear_canvas", roomId });
  } catch (err) {
    socket.send(JSON.stringify({ type: "server_message", message: "DB ERROR" }));
  }
}

export function handleDisconnect(userId: string) {
  removeUserFromAllRooms(userId);
  const ws = getSocket(userId);
  try {
    ws?.send(JSON.stringify({ type: "server_message", message: "Disconnected" }));
  } catch (e) {
    // Socket already closed
  }
}