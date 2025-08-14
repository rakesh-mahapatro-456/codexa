// routes/upload.route.js
import express from 'express';
import multer from 'multer';
import { storage } from '../../cloudConfig.js';
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage });

router.post('/upload',authMiddleware,upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
      url: req.file.path,              // Cloudinary URL
      type: req.file.mimetype,        // File MIME type (e.g., image/jpeg)
      originalName: req.file.originalname, // Original file name
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
