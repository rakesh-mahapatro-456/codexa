import {Router} from 'express';
import {signup,login,updateUser,getUserInfo,updatePassword} from '../controllers/user.controller.js';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import wrapAsync from '../middlewares/wrapAsync.middleware.js';

const router  = Router();

router.post('/signup',wrapAsync(signup));
router.post('/login',wrapAsync(login));

router.get("/user-info",authMiddleware,wrapAsync(getUserInfo));
router.put("/update-user",authMiddleware,wrapAsync(updateUser));
router.put("/update-password",authMiddleware,wrapAsync(updatePassword));

export default router;