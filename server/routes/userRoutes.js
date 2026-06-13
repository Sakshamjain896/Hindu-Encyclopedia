import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, toggleBookmark } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/bookmark/:entityId', protect, toggleBookmark);

export default router;