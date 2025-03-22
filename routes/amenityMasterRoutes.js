import express from 'express';
import { addAmenity, deleteAmenity, getAllAmenities, getAmenityById, updateAmenity } from "../controllers/amenityMasterController.js";

const router = express.Router();

router.get('/', getAllAmenities);
router.get('/:id', getAmenityById);
router.put('/:id', updateAmenity);
router.post('/', addAmenity);
router.delete('/:id',deleteAmenity);

export default router;