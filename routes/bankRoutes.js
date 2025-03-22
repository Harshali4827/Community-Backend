import express from 'express';
import { addBankDetails, deleteBankDetails, getAllBank, getBankById, updateBankDetails } from '../controllers/bankController.js';
const router = express.Router();

router.get('/', getAllBank);
router.get('/:id', getBankById);
router.post('/', addBankDetails);
router.put('/:id', updateBankDetails);
router.delete('/:id', deleteBankDetails);

export default router;