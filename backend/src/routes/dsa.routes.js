import {Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import wrapAsync from '../middlewares/wrapAsync.middleware.js';
import {getDsaProblems,getTargetedDsaProblems,getDailyChallenge,markProblemAsSolved,markDailyChallengeProblemAsSolved,getStreak,getDailyProgress} from "../controllers/dsa.controller.js"

const router  = Router();

router.get("/dsa-problems",authMiddleware,wrapAsync(getDsaProblems));
router.get("/targeted-dsa-problems",authMiddleware,wrapAsync(getTargetedDsaProblems));
router.get("/daily-challenge",authMiddleware,wrapAsync(getDailyChallenge));
router.post("/mark-problem-as-solved/:problemId",authMiddleware,wrapAsync(markProblemAsSolved));
router.post("/mark-daily-challenge-problem-as-solved/:problemId",authMiddleware,wrapAsync(markDailyChallengeProblemAsSolved));
router.get("/streak",authMiddleware,wrapAsync(getStreak));
router.get(
    "/daily-progress",
    authMiddleware,
    wrapAsync(async (req, res) => {
      const progress = await getDailyProgress(req.user._id); // ✅ pass only ObjectId
      res.json({ success: true, data: progress });
    })
  );
export default router;