import express from 'express';
import multer from 'multer';
import { checkEmail, deleteUser, getAllUsers, registerUser, verifyOtp } from '../controllers/userController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);
router.post('/register',upload.single('profile_photo'), registerUser);
router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);

export default router;
