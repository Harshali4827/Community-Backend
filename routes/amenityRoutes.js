import express from 'express';
import { addPropertyAmenity, deletePropertyAmenity, getAllPropertyAmenities, getPropertyAmenityById, updatePropertyAmenity } from '../controllers/amenityController.js';

const router = express.Router();
router.get('/',getAllPropertyAmenities);
router.get('/:id',getPropertyAmenityById)
router.post('/', addPropertyAmenity);
router.put('/:id',updatePropertyAmenity)
router.delete('/:id',deletePropertyAmenity);

export default router;
