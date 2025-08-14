import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  randomProblemIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RandomProblem',
      required: true,
    }
  ],
});

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
export default DailyChallenge;
