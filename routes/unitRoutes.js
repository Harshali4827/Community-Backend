import express from 'express';
import { addUnits, deleteUnit, getAllUnits, getUnitsById, updateUnit,getUnitByBlock} from "../controllers/unitController.js";

const router = express.Router();
 router.get('/', getAllUnits);
 router.get('/:id', getUnitsById);
 router.get('/blocks/:block_id',getUnitByBlock)
 router.post('/', addUnits);
 router.put('/:id', updateUnit);
 router.delete('/:id', deleteUnit);
export default router;