import express from 'express';
import { addChildGroup, deleteChildGroup, getAllChildGroup, getChildGroupById, updateChildGroup } from "../controllers/ledgerChildGroupController.js";

const router = express.Router();

router.get('/', getAllChildGroup);
router.get('/:id', getChildGroupById);
router.post('/', addChildGroup);
router.put('/:id',updateChildGroup);
router.delete('/:id', deleteChildGroup);

export default router;