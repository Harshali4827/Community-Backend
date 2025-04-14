import express from 'express';
import { addLedgerGroup, deleteLedgerGroup, getAllLedgerGroup, getLegderGroupById, updateLedgerGroup } from "../controllers/ledgerGroupController.js";

const router = express.Router();

router.get('/', getAllLedgerGroup);
router.get('/:id', getLegderGroupById);
router.post('/', addLedgerGroup);
router.put('/:id',updateLedgerGroup);
router.delete('/:id', deleteLedgerGroup);

export default router;