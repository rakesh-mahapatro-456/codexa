import User from "../models/user.models.js";
import DSAProblem from "../models/dsaPrblm.models.js";
import UserProblemLog from "../models/userProblemLog.model.js";
import RandomProblem from "../models/randomPrblm.models.js";
import DailyChallenge from "../models/dailyChallenge.model.js";
import Level from "../models/level.model.js";
import { emitUserStatsUpdate, emitProblemStatusUpdate, emitDailyProgressUpdate } from "../controllers/SocketEmitter.js";

// Helper functions (keep existing ones)
const updateLevel = async(user, xp) => {
  const level = await Level.findOne({xpRequired: {$gte: xp}});
  if(level && level._id.toString() !== user.levelId?.toString()) {
    user.levelId = level._id;
    await user.save();
    return level;
  }
  return user.levelId;
};

const updateStats = async(user, problem) => {
  const oldXP = user.xp;
  const oldLevel = user.levelId;
  
  user.problemsSolved += 1;
  user.xp += problem.xpReward;
  
  const newLevel = await updateLevel(user, user.xp);
  await user.save();
  
  // Populate level info for socket emission
  await user.populate("levelId", "name");
  
  return {
    xpGained: problem.xpReward,
    levelChanged: oldLevel?.toString() !== newLevel?.toString()
  };
};

const updateStreak = async (user) => {
  const todayStr = new Date().toISOString().split("T")[0];
  
  if (user.lastStreakDate === todayStr) return false;

  const prblmsSolvedInMain = await UserProblemLog.countDocuments({ 
    user: user._id, 
    problemModel: 'DSAProblem', 
    solvedAt: { $gte: new Date(todayStr) } 
  });

  const prblmsSolvedInDailyChallenge = await UserProblemLog.countDocuments({ 
    user: user._id, 
    problemModel: 'RandomProblem', 
    solvedAt: { $gte: new Date(todayStr) } 
  });

  const totalSolved = prblmsSolvedInMain + prblmsSolvedInDailyChallenge;

  if (totalSolved >= user.dailyTarget) {
    const oldStreak = user.streak;
    user.streak += 1;
    user.lastStreakDate = todayStr;
    await user.save();
    return user.streak > oldStreak;
  }
  return false;
};

export const getDailyProgress = async (userId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const dsaSolved = await UserProblemLog.countDocuments({
    user: userId,
    problemModel: 'DSAProblem',
    status: 1,
    solvedAt: { $gte: todayStart, $lte: todayEnd }
  });

  const dailySolved = await UserProblemLog.countDocuments({
    user: userId,
    problemModel: 'RandomProblem',
    status: 1,
    solvedAt: { $gte: todayStart, $lte: todayEnd }
  });

  const xpTodayAgg = await UserProblemLog.aggregate([
    {
      $match: {
        user: userId,
        status: 1,
        solvedAt: { $gte: todayStart, $lte: todayEnd }
      }
    },
    { $group: { _id: null, totalXP: { $sum: "$xpAwarded" } } }
  ]);

  const user = await User.findById(userId);
  
  return {
    solvedToday: dsaSolved + dailySolved,
    xpToday: xpTodayAgg[0]?.totalXP || 0,
    goal: user.dailyTarget || 5
  };
};

// Updated mark problem as solved
export const markProblemAsSolved = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const problem = await DSAProblem.findById(req.params.problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    let existingLog = await UserProblemLog.findOne({
      user: user._id,
      problemId: problem._id,
      problemModel: 'DSAProblem'
    });

    if (existingLog && existingLog.status === 1) {
      return res.status(200).json({ message: "Problem already solved" });
    }

    // Update or create log
    if (existingLog) {
      existingLog.status = 1;
      existingLog.xpAwarded = problem.xpReward;
      existingLog.solvedAt = new Date();
      await existingLog.save();
    } else {
      existingLog = await UserProblemLog.create({
        user: user._id,
        problemId: problem._id,
        problemModel: 'DSAProblem',
        status: 1,
        xpAwarded: problem.xpReward,
        solvedAt: new Date(),
      });
    }

    // Update user stats
    const statsUpdate = await updateStats(user, problem);
    const streakUpdated = await updateStreak(user);

    // Get updated daily progress
    const dailyProgress = await getDailyProgress(user._id);

    // Emit real-time updates
    emitUserStatsUpdate(user._id, {
      xp: user.xp,
      levelId: user.levelId,
      problemsSolved: user.problemsSolved,
      streak: user.streak
    });

    emitProblemStatusUpdate(user._id, {
      problemId: problem._id,
      problemModel: "DSAProblem",
      status: 1
    });

    emitDailyProgressUpdate(user._id, dailyProgress);

    return res.status(200).json({ 
      message: "Problem marked as solved", 
      data: existingLog,
      statsUpdate,
      streakUpdated,
      dailyProgress
    });

  } catch (error) {
    console.error("Error marking problem as solved:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markDailyChallengeProblemAsSolved = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const problem = await RandomProblem.findById(req.params.problemId);
    if (!problem) return res.status(404).json({ message: "Daily challenge problem not found" });

    let existingLog = await UserProblemLog.findOne({
      user: user._id,
      problemId: problem._id,
      problemModel: "RandomProblem"
    });

    if (existingLog && existingLog.status === 1) {
      return res.status(200).json({ message: "Daily challenge problem already solved" });
    }

    // Update or create log
    if (existingLog) {
      existingLog.status = 1;
      existingLog.xpAwarded = problem.xpReward;
      existingLog.solvedAt = new Date();
      await existingLog.save();
    } else {
      existingLog = await UserProblemLog.create({
        user: user._id,
        problemId: problem._id,
        problemModel: "RandomProblem",
        status: 1,
        xpAwarded: problem.xpReward,
        solvedAt: new Date(),
      });
    }

    // Update user stats
    const statsUpdate = await updateStats(user, problem);
    const streakUpdated = await updateStreak(user);

    // Get updated daily progress
    const dailyProgress = await getDailyProgress(user._id);

    // Emit real-time updates
    emitUserStatsUpdate(user._id, {
      xp: user.xp,
      levelId: user.levelId,
      problemsSolved: user.problemsSolved,
      streak: user.streak
    });

    emitProblemStatusUpdate(user._id, {
      problemId: problem._id,
      problemModel: "RandomProblem",
      status: 1
    });

    emitDailyProgressUpdate(user._id, dailyProgress);

    return res.status(200).json({
      message: "Daily challenge problem marked as solved",
      data: existingLog,
      statsUpdate,
      streakUpdated,
      dailyProgress
    });

  } catch (error) {
    console.error("Error marking daily challenge problem as solved:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getDailyChallenge = async (req, res) => {
  // 1. Get the user
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2. Get today at 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 3. Get today's daily challenge and populate problems
  const todayChallenge = await DailyChallenge.findOne({ date: today }).populate('randomProblemIds');
  if (!todayChallenge) {
    return res.status(404).json({ message: 'No daily challenge found for today' });
  }

  const allProblemIds = todayChallenge.randomProblemIds.map(p => p._id);

  // 4. Fetch solved logs for these problems
  const logs = await UserProblemLog.find({
    user: user._id,
    problemModel: 'RandomProblem',
    problemId: { $in: allProblemIds },
    status: 1
  });

  const solvedIds = new Set(logs.map(log => log.problemId.toString()));

  // 5. Attach status (default 0, set to 1 if solved)
  const problemsWithStatus = todayChallenge.randomProblemIds.map(problem => ({
    ...problem.toObject(),
    status: solvedIds.has(problem._id.toString()) ? 1 : 0
  }));

  // 6. Send response
  res.status(200).json({
    message: 'Daily challenge retrieved',
    data: problemsWithStatus
  });
};


export const getTargetedDsaProblems = async (req, res) => {
      const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    // 🔧 FIXED: Use assignedDate instead of createdAt
    const todayLogs = await UserProblemLog.find({
      user: user._id,
      problemModel: 'DSAProblem',
      assignedDate: { $gte: todayStart, $lte: todayEnd } // ✅ Changed from createdAt
    }).populate('problemId');
    
    const solvedToday = [];
    const unsolvedToday = [];
    
    for (const log of todayLogs) {
      // Add null check for safety
      if (!log.problemId) {
        console.log('Warning: Log without problem found:', log._id);
        continue;
      }
      
      const problem = log.problemId;
      const formattedProblem = {
        _id: problem._id,
        title: problem.title,
        link: problem.link,
        topic: problem.topic,
        difficulty: problem.difficulty,
        xpReward: problem.xpReward,
        sheetName: problem.sheetName,
        orderInSheet: problem.orderInSheet,
        status: log.status
      };
    
      if (log.status === 1) {
        solvedToday.push(formattedProblem);
      } else {
        unsolvedToday.push(formattedProblem);
      }
    }

    // 🔧 FIXED: Use assignedDate for backlog too
    const backlogLogs = await UserProblemLog.find({
      user: user._id,
      problemModel: 'DSAProblem',
      status: 0,
      assignedDate: { $lt: todayStart } // ✅ Changed from createdAt
    }).populate('problemId');
    
    const backlog = backlogLogs
      .filter(log => log.problemId) // Filter out logs with missing problems
      .map(log => {
        const problem = log.problemId;
        return {
          _id: problem._id,
          title: problem.title,
          link: problem.link,
          topic: problem.topic,
          difficulty: problem.difficulty,
          xpReward: problem.xpReward,
          sheetName: problem.sheetName,
          orderInSheet: problem.orderInSheet,
          status: log.status
        };
      });
    
    return res.status(200).json({
      message: "Targeted DSA problems retrieved successfully",
      data: {
        solvedToday,
        unsolvedToday,
        backlog
      }
    });
    
  
};


export const getDsaProblems = async(req,res)=>{
  const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const problems = await DSAProblem.find({});
    const logs = await UserProblemLog.find({ user: user._id, problemModel: 'DSAProblem' });

    // Map logs for quick lookup
    const logMap = new Map();
    logs.forEach(log => {
      logMap.set(log.problemId.toString(), log.status);
    });

    // Attach status and filter fields
    const problemsWithStatus = problems.map(problem => {
      const status = logMap.has(problem._id.toString()) ? logMap.get(problem._id.toString()) : 2;

      return {
        _id: problem._id,
        title: problem.title,
        link: problem.link,
        topic: problem.topic,
        difficulty: problem.difficulty,
        xpReward: problem.xpReward,
        status: status
      };
    });

    // Group by topic and sort by orderInSheet
    const groupedByTopic = {};
    problems.forEach(problem => {
      if (!groupedByTopic[problem.topic]) {
        groupedByTopic[problem.topic] = [];
      }

      const status = logMap.has(problem._id.toString()) ? logMap.get(problem._id.toString()) : 2;

      groupedByTopic[problem.topic].push({
        _id: problem._id,
        title: problem.title,
        link: problem.link,
        topic: problem.topic,
        difficulty: problem.difficulty,
        xpReward: problem.xpReward,
        status: status,
        orderInSheet: problem.orderInSheet // used only for sorting, removed later
      });
    });

    // Sort by orderInSheet and remove it
    for (const topic in groupedByTopic) {
      groupedByTopic[topic].sort((a, b) => a.orderInSheet - b.orderInSheet);
      groupedByTopic[topic] = groupedByTopic[topic].map(({ orderInSheet, ...rest }) => rest);
    }

    return res.status(200).json({
      message: "DSA problems retrieved successfully",
      data: groupedByTopic
    });

};

export const getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const dailyTarget = user.dailyTarget || 1; // fallback to 1

    const streakAgg = await UserProblemLog.aggregate([
      { $match: { user: user._id, status: 1 } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$solvedAt" }
          },
          solvedCount: { $sum: 1 }
        }
      },
      { $match: { solvedCount: { $gte: dailyTarget } } },
      { $sort: { "_id": 1 } }
    ]);

    const streakDates = streakAgg.map(item => item._id);

    return res.status(200).json(streakDates);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch streak dates" });
  }
};