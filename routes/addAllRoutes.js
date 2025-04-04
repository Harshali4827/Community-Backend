import express from 'express';
import { addAllData } from "../controllers/addAllController.js";

const router = express.Router();

router.post('/', addAllData);

export default router;