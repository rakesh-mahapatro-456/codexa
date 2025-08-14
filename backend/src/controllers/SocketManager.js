import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import InstantSolveSession from "../models/InstantSolveSession.js";

let io;

export const connectToSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  // 🔹 Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];
      if (!token) return next(new Error("No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id)
        .select("-password")
        .populate("levelId", "name"); // populate level to avoid undefined

      if (!user) return next(new Error("User not found"));

      socket.user = user;

      // Update InstantSolveSession
      await InstantSolveSession.findOneAndUpdate(
        { userId: user._id },
        { socketId: socket.id, status: "available", updatedAt: new Date() },
        { upsert: true }
      );

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Invalid or expired token"));
    }
  });

  // 🔹 Main connection handler
  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`✅ User connected: ${userId}`);
    socket.join(`user_${userId}`);

    // Join room
    socket.on("join-room", async (roomId) => {
      try {
        const session = await InstantSolveSession.findOne({ userId: socket.user._id });
        if (session?.roomId === roomId) {
          socket.join(roomId);
          console.log(`👥 ${userId} joined room ${roomId}`);

          socket.to(roomId).emit("user-joined", {
            userId,
            username: socket.user.username,
          });
        } else {
          console.warn(`🚫 Unauthorized room join attempt by ${userId}`);
        }
      } catch (err) {
        console.error("Join room error:", err);
      }
    });

    // Send message
    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("receive-message", {
        sender: socket.user.username,
        message,
        timestamp: new Date().toISOString(),
        userId,
      });
      console.log(`📨 Message from ${socket.user.username} in room ${roomId}:`, message);
    });

    // End session
    socket.on("end-session", async ({ roomId, endedBy }) => {
      try {
        const { endSession } = await import("../controllers/party.controller.js");
        const req = { body: { roomId, endedBy } };
        const res = {
          status: (code) => ({
            json: (data) => {
              if (code === 200) {
                io.to(roomId).emit("session-ended", { roomId, duration: data.duration || 0, endedBy });
                console.log(`✅ Session ended for room ${roomId}`);
              } else {
                socket.emit("error", data);
                console.error(`❌ Failed to end session for room ${roomId}:`, data);
              }
            },
          }),
        };
        await endSession(req, res);
      } catch (err) {
        console.error("Socket end-session error:", err);
        socket.emit("error", { message: err.message || "Failed to end session" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ roomId, isTyping }) => {
      socket.to(roomId).emit("user-typing", {
        userId,
        username: socket.user.username,
        isTyping,
      });
    });

    // Update availability
    socket.on("update-availability", async ({ isAvailable }) => {
      try {
        await InstantSolveSession.findOneAndUpdate(
          { userId: socket.user._id },
          { status: isAvailable ? "available" : "unavailable", updatedAt: new Date() }
        );
        io.emit("availability-updated", { userId, isAvailable });
        console.log(`User ${userId} set availability to ${isAvailable}`);
      } catch (err) {
        console.error("Error updating availability:", err);
        socket.emit("error", { message: "Failed to update availability" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${userId}`);
      await InstantSolveSession.findOneAndUpdate(
        { userId: socket.user._id },
        { status: "offline", socketId: null }
      );
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
