import express from 'express';
import { register, login, me } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Route to fetch the logged-in user's profile
router.get('/me', me); 

export default router;