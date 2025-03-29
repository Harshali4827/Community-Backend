import express from 'express';
import { deleteUserProperty, getAllUserProperty } from "../controllers/userPropertyController.js";

const router = express.Router();

router.get('/', getAllUserProperty);
router.delete('/:id',deleteUserProperty);
export default router;