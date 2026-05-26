/**
 * Socket.io server stub for realtime community chat & voice rooms.
 * Run as a separate process or integrate with a custom Next.js server.
 *
 * Example (standalone):
 *   npx ts-node lib/socket-server.ts
 *
 * Client: import { io } from "socket.io-client"
 *   const socket = io("http://localhost:3001")
 *   socket.emit("join-room", { roomId, userId, name })
 */

import { Server } from "socket.io";
import { createServer } from "http";

const PORT = Number(process.env.SOCKET_PORT) || 3001;

export function createSocketServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: { origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000" },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, name }) => {
      socket.join(roomId);
      io.to(roomId).emit("user-joined", { name, socketId: socket.id });
    });

    socket.on("chat-message", ({ roomId, message, author }) => {
      io.to(roomId).emit("chat-message", { message, author, at: Date.now() });
    });

    socket.on("voice-speaking", ({ roomId, speaking }) => {
      socket.to(roomId).emit("voice-speaking", { socketId: socket.id, speaking });
    });

    socket.on("disconnect", () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("user-left", { socketId: socket.id });
        }
      });
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`LingoFox Socket.io listening on :${PORT}`);
  });

  return io;
}

if (require.main === module) {
  createSocketServer();
}
