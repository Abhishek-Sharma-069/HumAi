import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.delete('/:id', protect, deleteUser);

export default router;
