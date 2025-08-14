import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  // ✅ Check if socket exists AND is connected
  if (socket && socket.connected) {
    return socket;
  }

  // ✅ If socket exists but disconnected, disconnect it first
  if (socket && !socket.connected) {
    socket.disconnect();
    socket = null;
  }

  // Create new socket connection
  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 3,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection failed:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected");
  }
};

export const getSocket = () => socket;