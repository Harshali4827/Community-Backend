import express from 'express';
import { addApplicationModule, deleteApplicationModule, getAllApplicationModule, getApplicationModuleById, updateApplicationModule } from "../controllers/applicationModuleController.js";

const router = express.Router();

router.get('/',getAllApplicationModule);
router.get('/:id', getApplicationModuleById);
router.post('/', addApplicationModule);
router.delete('/:id', deleteApplicationModule);
router.put('/:id', updateApplicationModule);

export default router;