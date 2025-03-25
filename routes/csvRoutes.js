import express from 'express';
import { importExcel, upload } from '../controllers/csvController.js';

const router = express.Router();

router.post('/', upload.single('file'), importExcel);

export default router;
