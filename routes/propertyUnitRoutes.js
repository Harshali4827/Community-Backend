import express from 'express';
import { addUserPropertyUnit, deleteUserPropertyUnit, getPropertyUnitById, getUserPropertyUnitByUserId, getUserPropertyUnits, updatePropertyUnit} from "../controllers/propertyUnitController.js";

const router = express.Router();
router.get('/', getUserPropertyUnits);
router.post('/', addUserPropertyUnit);
router.get('/:id',getUserPropertyUnitByUserId);
router.delete('/:id',deleteUserPropertyUnit);
router.get('/unit/:id', getPropertyUnitById);
router.put('/:id', updatePropertyUnit);

export default router;