import mongoose from 'mongoose';
import DailyChallenge from '../models/dailyChallenge.model.js';
import RandomProblem from '../models/randomPrblm.models.js';

export const assignDailyChallenges = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today's challenge already exists
    const existing = await DailyChallenge.findOne({ date: today });
    if (existing) {
      console.log('✅ Daily challenge already exists for today.');
      return;
    }

    // Fetch all random problems
    const allProblems = await RandomProblem.find({});
    if (allProblems.length < 5) {
      console.log('❌ Not enough problems to assign a challenge.');
      return;
    }

    // Randomly select 5 unique problems
    const selected = [];
    const usedIndexes = new Set();

    while (selected.length < 5) {
      const index = Math.floor(Math.random() * allProblems.length);
      if (!usedIndexes.has(index)) {
        usedIndexes.add(index);
        selected.push(allProblems[index]._id);
      }
    }

    // Create the daily challenge with 5 problems
    await DailyChallenge.create({
      date: today,
      randomProblemIds: selected,
    });

    console.log('✅ Assigned 1 daily challenge with 5 problems.');
  } catch (err) {
    console.error('❌ Error in daily challenge cron:', err);
  }
};
