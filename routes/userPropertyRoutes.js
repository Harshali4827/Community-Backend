import express from 'express';
import { getAllUserProperty } from "../controllers/userPropertyController.js";

const router = express.Router();

router.get('/', getAllUserProperty);
export default router;