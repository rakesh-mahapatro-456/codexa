/**
 * CRON JOB: Runs every day at midnight (00:00)
 * - Assigns 'dailyTarget' number of unsolved problems to each user.
 * - Marks them as status = 0 (today's target) with proper field names.
 */
import cron from 'node-cron';
import User from '../models/user.models.js';
import DSAProblem from '../models/dsaPrblm.models.js';
import UserProblemLog from '../models/userProblemLog.model.js';

export const assignDailyDSAProblems = async (specificUserId = null) => {
  try {
    console.log('⏳ Running daily DSA target assignment...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    console.log(`Assignment date: ${today.toISOString()}`);

    // Handle both single user (signup) and all users (cron)
    const users = specificUserId 
      ? await User.find({ _id: specificUserId }) 
      : await User.find();

    console.log(`Processing ${users.length} users...`);

    for (const user of users) {
      const dailyTarget = user.dailyTarget || 3;
      console.log(`\n--- Processing User ${user._id} (Target: ${dailyTarget}) ---`);

      // Check existing assignments for today using createdAt (no assignedDate in schema)
      const existingTodayLogs = await UserProblemLog.find({
        user: user._id,
        problemModel: 'DSAProblem',
        status: 0, // Today's target
        createdAt: { $gte: today, $lte: todayEnd }
      });

      console.log(`Found ${existingTodayLogs.length} existing assignments for today`);

      if (existingTodayLogs.length >= dailyTarget) {
        console.log(`✅ User ${user._id} already has today's target.`);
        continue;
      }

      const remainingTarget = dailyTarget - existingTodayLogs.length;
      console.log(`Need to assign ${remainingTarget} more problems`);

      // Get all problems user has ever attempted (any status)
      const allUserLogs = await UserProblemLog.find({ 
        user: user._id,
        problemModel: 'DSAProblem' 
      });
      const attemptedProblemIds = new Set(allUserLogs.map(log => log.problemId.toString()));

      console.log(`User has attempted ${attemptedProblemIds.size} problems total`);

      // Find unsolved problems (not in attempted list)
      const unsolvedProblems = await DSAProblem.find({
        _id: { $nin: Array.from(attemptedProblemIds) },
      }).sort({ orderInSheet: 1 }).limit(remainingTarget);

      console.log(`Found ${unsolvedProblems.length} unsolved problems available`);

      if (unsolvedProblems.length === 0) {
        console.log(`⚠️ No unsolved problems available for user ${user._id}`);
        continue;
      }

      // Create assignments with correct field names (matching schema)
      const assignments = unsolvedProblems.map(problem => ({
        user: user._id,
        problemId: problem._id,
        problemModel: 'DSAProblem',
        status: 0, // Today's target (blue)
        xpAwarded: 0, // Correct field name from schema
        // Note: assignedDate not in schema, using createdAt for tracking
      }));

      console.log(`Creating ${assignments.length} assignments...`);
      
      // Insert all assignments
      const insertedLogs = await UserProblemLog.insertMany(assignments);
      
      console.log(`📌 Successfully assigned ${insertedLogs.length} problems to user ${user._id}`);
      
      // Log the problem titles for verification
      assignments.forEach((assignment, index) => {
        const problem = unsolvedProblems[index];
        console.log(`  ${index + 1}. ${problem.title} (${problem.difficulty})`);
      });
    }

    console.log('\n✅ DSA target assignment complete');
    return { 
      success: true, 
      processedUsers: users.length,
      timestamp: new Date().toISOString()
    };
    
  } catch (err) {
    console.error('❌ Error in DSA target cron:', err);
    return { 
      success: false, 
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Auto-scheduled version for production
export const startDailyTargetCron = () => {
  console.log('🕐 Starting daily target cron job...');
  
  // Schedule for midnight every day
  cron.schedule('0 0 * * *', async () => {
    console.log(`\n🔄 Daily cron triggered at: ${new Date().toISOString()}`);
    const result = await assignDailyDSAProblems(); // No specificUserId for cron
    console.log('Cron result:', result);
  }, {
    timezone: "Asia/Kolkata" // Adjust timezone as needed
  });
  
  console.log('✅ Daily target cron job scheduled for 00:00 IST');
};

// Manual trigger function for testing
export const triggerDailyAssignmentNow = async (userId = null) => {
  console.log(`\n🧪 MANUAL TRIGGER - ${userId ? `for user ${userId}` : 'for all users'}`);
  const result = await assignDailyDSAProblems(userId);
  return result;
};

// Debug function to check assignments
export const debugUserAssignments = async (userId) => {
  console.log(`\n=== DEBUG ASSIGNMENTS FOR USER ${userId} ===`);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  console.log(`Date range: ${today.toISOString()} to ${todayEnd.toISOString()}`);
  
  // Check user's daily target
  const user = await User.findById(userId);
  console.log(`User daily target: ${user?.dailyTarget || 'NOT SET'}`);
  
  // Get today's assignments
  const todayAssignments = await UserProblemLog.find({
    user: userId,
    problemModel: 'DSAProblem',
    createdAt: { $gte: today, $lte: todayEnd }
  }).populate('problemId');
  
  console.log(`\nToday's assignments: ${todayAssignments.length}`);
  
  todayAssignments.forEach((log, index) => {
    const problem = log.problemId;
    console.log(`${index + 1}. ${problem?.title || 'MISSING PROBLEM'}`);
    console.log(`   Status: ${log.status} ${log.status === 0 ? '(ASSIGNED)' : log.status === 1 ? '(SOLVED)' : '(UNKNOWN)'}`);
    console.log(`   Created: ${log.createdAt}`);
    console.log(`   XP: ${log.xpAwarded}`);
    console.log('   ---');
  });
  
  // Check all assignments
  const allAssignments = await UserProblemLog.find({
    user: userId,
    problemModel: 'DSAProblem'
  });
  
  console.log(`\nTotal assignments ever: ${allAssignments.length}`);
  console.log(`Status 0 (assigned): ${allAssignments.filter(log => log.status === 0).length}`);
  console.log(`Status 1 (solved): ${allAssignments.filter(log => log.status === 1).length}`);
  
  return todayAssignments;
};

// Export everything
export default {
  assignDailyDSAProblems,
  startDailyTargetCron,
  triggerDailyAssignmentNow,
  debugUserAssignments
};