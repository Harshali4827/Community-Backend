import express from 'express';
import multer from 'multer';
import { checkEmail, deleteUser, getAllUsers, getUserById, getUserData, registerUser, updateUser, verifyOtp, verifyToken } from '../controllers/userController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);
router.post('/register',upload.single('profile_photo'), registerUser);
router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.get('/',verifyToken,getUserData);
router.put('/user/:id', updateUser);
router.get('/user/:id',getUserById);

export default router;
