import express from 'express';
import { getAllUsersRole } from "../controllers/userRoleController.js";
const router = express.Router();
router.get('/', getAllUsersRole);
export default router;