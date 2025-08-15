/**
 * CRON JOB: Runs every day at midnight (00:00)
 * - Assigns 'dailyTarget' number of unsolved problems to each user.
 * - Marks them as status = 0 (today's target) with assignedDate = today.
 */
import cron from 'node-cron';
import User from '../models/user.models.js';
import DSAProblem from '../models/dsaPrblm.models.js';
import UserProblemLog from '../models/userProblemLog.model.js';

export const assignDailyDSAProblems = async (specificUserId = null) => {
  try {
    console.log('⏳ Running daily DSA target assignment...');
    
    // Fix 1: Use consistent date handling (same as your other functions)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    console.log('Assignment date:', today.toISOString());

    // Fix 2: Handle both single user (signup) and all users (cron)
    const users = specificUserId 
      ? await User.find({ _id: specificUserId }) 
      : await User.find();

    console.log(`Processing ${users.length} users...`);

    for (const user of users) {
      const dailyTarget = user.dailyTarget || 3;

      // Fix 3: Add problemModel filter and use proper date range
      const existingTodayLogs = await UserProblemLog.find({
        user: user._id,
        problemModel: 'DSAProblem', // Important: filter by problem type
        assignedDate: { $gte: today, $lte: todayEnd }, // Proper date range
      });

      console.log(`User ${user._id}: Found ${existingTodayLogs.length} existing assignments (target: ${dailyTarget})`);

      if (existingTodayLogs.length >= dailyTarget) {
        console.log(`✅ User ${user._id} already has today's target.`);
        continue;
      }

      // Calculate remaining assignments needed
      const remainingTarget = dailyTarget - existingTodayLogs.length;

      // Fix 4: Add problemModel filter for attempted problems check
      const allUserLogs = await UserProblemLog.find({ 
        user: user._id,
        problemModel: 'DSAProblem' 
      });
      const attemptedProblemIds = new Set(allUserLogs.map(log => log.problemId.toString()));

      console.log(`User ${user._id}: Has attempted ${attemptedProblemIds.size} problems, need ${remainingTarget} more`);

      // Fix 5: Limit to remaining target, not full dailyTarget
      const unsolvedProblems = await DSAProblem.find({
        _id: { $nin: Array.from(attemptedProblemIds) },
      }).sort({ orderInSheet: 1 }).limit(remainingTarget);

      if (unsolvedProblems.length === 0) {
        console.log(`⚠️ No unsolved problems available for user ${user._id}`);
        continue;
      }

      // Fix 6: Batch create and use consistent field names
      const assignments = unsolvedProblems.map(problem => ({
        user: user._id,
        problemId: problem._id,
        problemModel: 'DSAProblem',
        status: 0,
        assignedDate: today, // Use the same today date for all
        xpAwarded: 0, // Fix 7: Use xpAwarded instead of xpEarned
      }));

      await UserProblemLog.insertMany(assignments);
      console.log(`📌 Assigned ${assignments.length} problems to user ${user._id}`);
    }

    console.log('✅ DSA target assignment complete');
    return { success: true, assignedUsers: users.length };
  } catch (err) {
    console.error('❌ Error in DSA target cron:', err);
    return { success: false, error: err.message };
  }
};

// Auto-scheduled version
export const startDailyTargetCron = () => {
  console.log('🕐 Starting daily target cron job...');
  cron.schedule('0 0 * * *', () => {
    console.log('🔄 Daily cron triggered at:', new Date().toISOString());
    assignDailyDSAProblems(); // Don't pass specificUserId for cron
  });
  console.log('✅ Daily target cron job scheduled');
};