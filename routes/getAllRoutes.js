import express from 'express';
import { createCity, getAllCountry, getStatesByCountry } from '../controllers/getAllController.js';

const router = express.Router();
router.get('/country', getAllCountry);
router.get('/states/:countryId', getStatesByCountry);
router.post('/city', createCity);
export default router;