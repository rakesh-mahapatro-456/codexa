import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  streak: { type: Number, default: 0 }, // only current streak
  problemsSolved: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  helpCount: { type: Number, default: 0 },
  xpEarnedFromHelping: { type: Number, default: 0 },
  dateJoined: { type: Date, default: Date.now },
  dailyTarget: { type: Number, default: 1 },
  currentDsaProblemIndex: { type: Number, default: 0 },
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', default: new mongoose.Types.ObjectId('6891abe50d74f4b927106857') },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  language: { type: String, enum: ['java', 'python', 'c++'], default: 'java' },
  lastStreakDate: { type: String, default: null }, // "YYYY-MM-DD"
});


const User = mongoose.model('User', userSchema);
export default User;
