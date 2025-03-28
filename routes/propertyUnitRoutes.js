import express from 'express';
import { getUserPropertyUnitByUserId, getUserPropertyUnits} from "../controllers/propertyUnitController.js";

const router = express.Router();
router.get('/', getUserPropertyUnits);
router.get('/:id',getUserPropertyUnitByUserId);

export default router;