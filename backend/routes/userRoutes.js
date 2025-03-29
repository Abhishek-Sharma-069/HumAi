import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { db } from '../config/firebase.js'; // Import Firestore instance

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.delete('/:id', protect, deleteUser);

// Example route using Firestore
router.get('/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router; // Ensure the router is exported correctly
