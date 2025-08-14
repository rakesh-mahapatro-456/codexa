import { getIO } from "../controllers/SocketManager.js";

export const emitUserStatsUpdate = (userId, userStats) => {
  try {
    const io = getIO();
    io.to(`user_${userId}`).emit("user_stats_updated", {
      xp: userStats.xp,
      levelId: userStats.levelId,
      problemsSolved: userStats.problemsSolved,
      streak: userStats.streak,
      timestamp: new Date().toISOString()
    }); 
    console.log(`📊 Stats updated for user ${userId}`);
  } catch (error) {
    console.error("Error emitting stats update:", error);
  }
};

export const emitProblemStatusUpdate = (userId, problemData) => {
  try {
    const io = getIO();
    io.to(`user_${userId}`).emit("problem_status_updated", {
      problemId: problemData.problemId,
      problemModel: problemData.problemModel,
      status: problemData.status,
      timestamp: new Date().toISOString()
    });
    console.log(`🎯 Problem status updated for user ${userId}`);
  } catch (error) {
    console.error("Error emitting problem update:", error);
  }
};

export const emitDailyProgressUpdate = (userId, progressData) => {
  try {
    const io = getIO();
    io.to(`user_${userId}`).emit("daily_progress_updated", {
      solvedToday: progressData.solvedToday,
      xpToday: progressData.xpToday,
      goal: progressData.goal,
      timestamp: new Date().toISOString()
    });
    console.log(`📈 Daily progress updated for user ${userId}`);
  } catch (error) {
    console.error("Error emitting progress update:", error);
  }
};