import mongoose from 'mongoose';

const randomProblemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  link: { type: String, required: true },
  topic: { type: String, required: true },
  sheetName: { type: String, default: 'RandomSheet' },
  xpReward: { type: Number, default: 10 }
});

const RandomProblem = mongoose.model('RandomProblem', randomProblemSchema);
export default RandomProblem;
