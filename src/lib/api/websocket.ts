import { Server } from "socket.io";
import { messaging } from "../messaging";

export const initializeWebSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", async (message) => {
      try {
        // Process message
        const response = await messaging.emit("MESSAGE_RECEIVED", message);
        socket.emit("message", response);
      } catch (error) {
        socket.emit("error", { message: "Failed to process message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};
