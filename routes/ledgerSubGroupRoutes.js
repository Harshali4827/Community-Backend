import express from 'express';
import { addLedgerSubGroup, deleteLedgerSubGroup, getAllLedgerSubGroup, getLegderSubGroupById, updateLedgerSubGroup } from "../controllers/ledgerSubGroupController.js";

const router = express.Router();

router.get('/', getAllLedgerSubGroup);
router.get('/:id', getLegderSubGroupById);
router.post('/', addLedgerSubGroup);
router.put('/:id', updateLedgerSubGroup);
router.delete('/:id', deleteLedgerSubGroup);
export default router;