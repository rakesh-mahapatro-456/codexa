// party.routes.js - UPDATED ROUTES
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import wrapAsync from '../middlewares/wrapAsync.middleware.js';
import { 
  setStatus, 
  askHelp, 
  endSession, 
  getSessionStats 
} from "../controllers/party.controller.js";

const router = Router();

// ✅ Set user status (available/unavailable)
router.post("/set-status", authMiddleware, wrapAsync(setStatus));

// ✅ Request help (simplified - no XP required)
router.post("/ask-help", authMiddleware, wrapAsync(askHelp));

// ✅ End session (simplified - no XP transfers)
router.post("/end-session", authMiddleware, wrapAsync(endSession));

// ✅ Get user session statistics
router.get("/session-stats", authMiddleware, wrapAsync(getSessionStats));

// ✅ Get available helpers count (optional)
router.get("/available-helpers", authMiddleware, wrapAsync(async (req, res) => {
  try {
    const { InstantSolveSession } = await import("../models/InstantSolveSession.js");
    
    const availableCount = await InstantSolveSession.countDocuments({
      status: "available",
      userId: { $ne: req.user.id }
    });

    res.status(200).json({
      success: true,
      availableHelpers: availableCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get available helpers count"
    });
  }
}));

export default router;