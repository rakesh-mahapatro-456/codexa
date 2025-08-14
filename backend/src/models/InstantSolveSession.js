import mongoose from "mongoose";

const instantSolveSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One entry per user
  },
  status: {
    type: String,
    enum: ["available", "doubt", "in-session", "offline"],
    default: "offline",
  },
  socketId: {
    type: String,
  },
  roomId: {
    type: String,
  },
  lastMatchedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sessionStartTime: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const InstantSolveSession = mongoose.model("InstantSolveSession", instantSolveSessionSchema);

export default InstantSolveSession;
