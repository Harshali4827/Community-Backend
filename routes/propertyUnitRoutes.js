import express from 'express';
import { addUserPropertyUnit, deleteUserPropertyUnit, getUserPropertyUnitByUserId, getUserPropertyUnits} from "../controllers/propertyUnitController.js";

const router = express.Router();
router.get('/', getUserPropertyUnits);
router.post('/', addUserPropertyUnit);
router.get('/:id',getUserPropertyUnitByUserId);
router.delete('/:id',deleteUserPropertyUnit)

export default router;