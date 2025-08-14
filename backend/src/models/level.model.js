import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  xpRequired: { type: Number, required: true, unique: true }
});

const Level = mongoose.model('Level', levelSchema)
export default Level;
