
/**
 * CRON JOB: Runs every day at midnight (00:00)
 * - Assigns 'dailyTarget' number of unsolved problems to each user.
 * - Marks them as status = 0 (today's target) with assignedDate = today.
 */
import cron from 'node-cron';
import User from '../models/user.models.js';
import DSAProblem from '../models/dsaPrblm.models.js';
import UserProblemLog from '../models/userProblemLog.model.js';

export const assignDailyDSAProblems = async () => {
  try {
    console.log('⏳ Running daily DSA target assignment...');
    const todayDate = new Date().toISOString().split('T')[0];
    const users = await User.find();

    for (const user of users) {
      const dailyTarget = user.dailyTarget || 3;

      const existingTodayLogs = await UserProblemLog.find({
        user: user._id,
        status: 0,
        assignedDate: { $gte: new Date(todayDate) },
      });

      if (existingTodayLogs.length >= dailyTarget) {
        console.log(`✅ User ${user._id} already has today's target.`);
        continue;
      }

      const allUserLogs = await UserProblemLog.find({ user: user._id });
      const attemptedProblemIds = new Set(allUserLogs.map(log => log.problemId.toString()));

      const unsolvedProblems = await DSAProblem.find({
        _id: { $nin: Array.from(attemptedProblemIds) },
      }).sort({ orderInSheet: 1 }).limit(dailyTarget);

      for (const problem of unsolvedProblems) {
        await UserProblemLog.create({
          user: user._id,
          problemId: problem._id,
          problemModel: 'DSAProblem',
          status: 0,
          assignedDate: new Date(),
          xpEarned: 0,
        });
      }

      console.log(`📌 Assigned ${unsolvedProblems.length} problems to user ${user._id}`);
    }

    console.log('✅ DSA target assignment complete');
  } catch (err) {
    console.error('❌ Error in DSA target cron:', err);
  }
};

// Auto-scheduled version
export const startDailyTargetCron = () => {
  cron.schedule('0 0 * * *', assignDailyDSAProblems);
};
