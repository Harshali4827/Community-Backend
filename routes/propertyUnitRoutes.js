import express from 'express';
import { getUserPropertyUnits} from "../controllers/propertyUnitController.js";

const router = express.Router();
router.get('/', getUserPropertyUnits);

export default router;