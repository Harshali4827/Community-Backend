import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
