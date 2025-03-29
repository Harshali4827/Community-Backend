import express from 'express';
import { deleteUserPropertyUnit, getUserPropertyUnitByUserId, getUserPropertyUnits} from "../controllers/propertyUnitController.js";

const router = express.Router();
router.get('/', getUserPropertyUnits);
router.get('/:id',getUserPropertyUnitByUserId);
router.delete('/:id',deleteUserPropertyUnit)

export default router;