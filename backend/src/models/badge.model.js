import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  iconUrl: {
    type: String,
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ['xp', 'level', 'streak', 'problems_count', 'topic_problems_count'],
    },
    valueInt: {
      type: Number,
    },
    valueStr: {
      type: String, // Used for topic name in topic_problems_count
    },
  },
}, {
  timestamps: true,
});

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
