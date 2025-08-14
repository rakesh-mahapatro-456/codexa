import mongoose from "mongoose";

const helpSessionLogSchema = new mongoose.Schema({
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  asker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  endedBy: {
    type: String,
    enum: ['helper', 'asker', 'system'],
  }
}, { timestamps: true });

export default mongoose.model('HelpSessionLog', helpSessionLogSchema);