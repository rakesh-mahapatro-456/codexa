import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  link: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  xpReward: { type: Number, default: 10 },
  sheetName: { type: String, default: 'MainSheet' },
  orderInSheet: { type: Number, required: true }
});

const DSAProblem =  mongoose.model('DSAProblem', dsaProblemSchema);

export default DSAProblem;
