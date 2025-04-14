import express from 'express';
import { addLedger, deleteLedger, getAllLedger, getLegderById, updateLedger } from "../controllers/ledgerController.js";

const router = express.Router();
router.get('/', getAllLedger);
router.get('/:id', getLegderById);
router.post('/', addLedger);
router.put('/:id', updateLedger);
router.delete('/:id', deleteLedger);

export default router;