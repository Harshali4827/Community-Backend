import express from 'express';
import { checkEmail, verifyOtp } from '../controllers/userController.js';

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);

export default router;
