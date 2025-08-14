import InstantSolveSession from "../models/InstantSolveSession.js";
import HelpSessionLog from "../models/HelpSessionLog.js";
import { getIO } from "./SocketManager.js";

// Set status for a user
export const setStatus = async (req, res) => {
  try {
    const { userId, status, socketId } = req.body;

    const session = await InstantSolveSession.findOneAndUpdate(
      { userId },
      { status, socketId, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Status updated", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request help session
export const askHelp = async (req, res) => {
  const userId = req.user.id;
  const { duration } = req.body;

  try {
    // Find available helper
    const helperSession = await InstantSolveSession.findOneAndUpdate(
      { status: "available", userId: { $ne: userId } },
      { status: "in-session" }
    );

    if (!helperSession) {
      return res.status(404).json({ success: false, message: "No helper available" });
    }

    const roomId = `${userId}_${helperSession.userId}_${Date.now()}`;

    // Update both sessions
    const seekerSession = await InstantSolveSession.findOneAndUpdate(
      { userId },
      { roomId, status: "in-session", sessionStartTime: new Date() },
      { new: true }
    );

    await InstantSolveSession.findOneAndUpdate(
      { userId: helperSession.userId },
      { roomId, status: "in-session", sessionStartTime: new Date() }
    );

    const io = getIO();

    // Emit match event to both participants
    io.to(helperSession.socketId).emit("matched", {
      roomId,
      duration,
      role: "helper",
      partnerId: userId
    });

    io.to(seekerSession.socketId).emit("matched", {
      roomId,
      duration,
      role: "asker",
      partnerId: helperSession.userId
    });

    res.status(200).json({
      success: true,
      message: "Matched successfully",
      roomId,
      helperId: helperSession.userId
    });

  } catch (error) {
    console.error("Ask Help Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// End a help session
export const endSession = async (req, res) => {
  const { roomId } = req.body;

  const sessions = await InstantSolveSession.find({ roomId });
  if (sessions.length !== 2) {
    return res.status(404).json({ error: "Session not found" });
  }

  const [sessionA, sessionB] = sessions;
  const start = sessionA.sessionStartTime || sessionB.sessionStartTime;
  const duration = Math.ceil((Date.now() - new Date(start)) / 60000);

  // Log the session
  await HelpSessionLog.create({
    helper: sessionB.userId,
    asker: sessionA.userId,
    roomId,
    duration
  });

  // Reset statuses
  await InstantSolveSession.updateMany(
    { userId: { $in: [sessionA.userId, sessionB.userId] } },
    { $set: { status: "available", roomId: null, sessionStartTime: null } }
  );

  const io = getIO();

  // Emit session-ended to both
  io.to(sessionA.socketId).emit("session-ended", { roomId, duration });
  io.to(sessionB.socketId).emit("session-ended", { roomId, duration });

  res.status(200).json({ message: "Session ended" });
};


// ✅ Get session statistics (optional - for analytics)
export const getSessionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await HelpSessionLog.aggregate([
      {
        $match: {
          $or: [{ helper: userId }, { asker: userId }]
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          helpedOthers: {
            $sum: { $cond: [{ $eq: ["$helper", userId] }, 1, 0] }
          },
          receivedHelp: {
            $sum: { $cond: [{ $eq: ["$asker", userId] }, 1, 0] }
          },
          averageDuration: { $avg: "$duration" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalSessions: 0,
        totalDuration: 0,
        helpedOthers: 0,
        receivedHelp: 0,
        averageDuration: 0
      }
    });
  } catch (error) {
    console.error("Get Session Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get session statistics"
    });
  }
};