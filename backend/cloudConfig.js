import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Avoid dynamic params that require signing
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'codexa_uploads', // ✅ This is okay
  },
});

export { cloudinary, storage };
