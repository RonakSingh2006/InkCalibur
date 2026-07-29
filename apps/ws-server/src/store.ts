import { WebSocket } from "ws";

// user -> ws
export const socketMap = new Map<string, WebSocket>();

// room -> users
export const roomsMap = new Map<number, Set<string>>();

// tempId -> { dbId, roomId }
export const shapeIdMap = new Map<number, { dbId: number; roomId: number }>();

export function addUserToRoom(roomId: number, userId: string) {
  if (!roomsMap.has(roomId)) roomsMap.set(roomId, new Set());
  roomsMap.get(roomId)!.add(userId);
}

export function removeUserFromRoom(roomId: number, userId: string) {
  roomsMap.get(roomId)?.delete(userId);
}

export function getRoomUsers(roomId: number): Set<string> | undefined {
  return roomsMap.get(roomId);
}

export function getSocket(userId: string): WebSocket | undefined {
  return socketMap.get(userId);
}

export function broadcastToRoom(roomId: number, message: object) {
  const users = roomsMap.get(roomId);
  if (!users) return;
  users.forEach((u) => {
    const ws = socketMap.get(u);
    ws?.send(JSON.stringify(message));
  });
}

export function getDbId(shapeId: number): number {
  const mapping = shapeIdMap.get(shapeId);
  return mapping ? mapping.dbId : shapeId;
}

export function storeShapeMapping(tempId: number, dbId: number, roomId: number) {
  shapeIdMap.set(tempId, { dbId, roomId });
}

export function clearRoomMappings(roomId: number) {
  for (const [tempId, mapping] of shapeIdMap.entries()) {
    if (mapping.roomId === roomId) {
      shapeIdMap.delete(tempId);
    }
  }
}

export function removeUserFromAllRooms(userId: string) {
  roomsMap.forEach((users) => {
    users.delete(userId);
  });
}