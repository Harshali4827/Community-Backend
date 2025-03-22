import express from 'express';

import { addPropertyAssets, deletePropertyAssets, getAllPropertyAssets, getPropertyAssetsById, updatePropertyAssets } from "../controllers/propertyAssetsController.js";

const router = express.Router();

router.get('/', getAllPropertyAssets);
router.get('/:id', getPropertyAssetsById);
router.post('/',addPropertyAssets);
router.put('/:id', updatePropertyAssets);
router.delete('/:id', deletePropertyAssets);

export default router;

