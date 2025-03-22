import express from 'express';
import { checkEmail, getAllUsers, verifyOtp } from '../controllers/userController.js';

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);
router.get('/users', getAllUsers);

export default router;
