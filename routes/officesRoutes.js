import express from 'express';
import { addOffice, deleteOffice, getAllOffices, getOfficeById, updateOffice } from "../controllers/officesController.js";

const router = express.Router();

router.get('/', getAllOffices);
router.get('/:id', getOfficeById);
router.post('/', addOffice);
router.put('/:id', updateOffice);
router.delete('/:id', deleteOffice);

export default router;