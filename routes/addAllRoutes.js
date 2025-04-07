import express from 'express';
import multer from 'multer';
import { addAllData } from "../controllers/addAllController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const parseJsonFields = (req, res, next) => {
  try {
    if (req.body.sectors) req.body.sectors = JSON.parse(req.body.sectors);
    if (req.body.blocks) req.body.blocks = JSON.parse(req.body.blocks);
    if (req.body.units) req.body.units = JSON.parse(req.body.units);
    if (req.body.gates) req.body.gates = JSON.parse(req.body.gates);
    if (req.body.assets) req.body.assets = JSON.parse(req.body.assets);
    if (req.body.banks) req.body.banks = JSON.parse(req.body.banks);
    if (req.body.amenities) req.body.amenities = JSON.parse(req.body.amenities);
    if (req.body.offices) req.body.offices = JSON.parse(req.body.offices);
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON data in form fields' });
  }
};

router.post('/', upload.single('logo'), parseJsonFields, addAllData);

export default router;