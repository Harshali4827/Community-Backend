import express from 'express';
import { addPropertyGate, deletePropertyGate, getAllGates, getPropertyGateById, updatePropertyGate } from "../controllers/gatesController.js";

const router = express.Router();

router.get('/', getAllGates);
router.get('/:id',getPropertyGateById);
router.post('/', addPropertyGate);
router.put('/:id', updatePropertyGate);
router.delete('/:id', deletePropertyGate);

export default router;