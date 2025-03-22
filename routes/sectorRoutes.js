import express from 'express';
import { addSectors, deleteSector, getAllSectors, getSectorById, updateSector,getSectorsByProperty } from "../controllers/sectorsController.js";

const router = express.Router();

router.post('/',addSectors);
router.get('/:id', getSectorById);
router.get('/property/:property_id',getSectorsByProperty)
router.get('/', getAllSectors);
router.put('/:id', updateSector);
router.delete('/:id', deleteSector);

export default router;