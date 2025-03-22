import express from 'express';
import { addBlocks, deleteBlock, getAllBlocks, getBlockById, updateBlock, getBlocksBySector } from "../controllers/blocksController.js";

const router = express.Router();

router.get('/',getAllBlocks);
router.get('/:id', getBlockById);
router.get('/sectors/:sector_id',getBlocksBySector);
router.post('/', addBlocks);
router.put('/:id', updateBlock);
router.delete('/:id', deleteBlock);

export default router;