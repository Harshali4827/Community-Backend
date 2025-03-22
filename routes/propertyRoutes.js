import express from 'express';
import multer from 'multer';
import { addProperty, deleteProperty, getAllProperties, getPropertyById, updateProperty } from "../controllers/propertyController.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/',getAllProperties);
router.get('/:id',getPropertyById)
router.post('/',upload.single('logo'), addProperty);
router.put('/:id',updateProperty)
router.delete('/:id',deleteProperty);

export default router;

