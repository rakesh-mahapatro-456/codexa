import mongoose from 'mongoose';

const userProblemLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'problemModel',
  },
  problemModel: {
    type: String,
    required: true,
    enum: ['DSAProblem', 'RandomProblem'], 
  },
  status: {
    type: Number,
    enum: [-1, 0, 1,2], // -1 = red/backlog, 0 = blue/todays target, 1 = green/solved ,2 = grey/future
    default: 2,
  },
  xpAwarded: {
    type: Number,
    default: 0,
  },
  solvedAt: {
    type: Date,
  }
}, { timestamps: true });

userProblemLogSchema.index({ user: 1, problemId: 1, problemModel: 1 }, { unique: true });

const UserProblemLog = mongoose.model('UserProblemLog', userProblemLogSchema);
export default UserProblemLog;
