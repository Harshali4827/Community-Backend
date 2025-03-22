import db from '../config/db.js';
import sendMail from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET; 

export const getAllUsers = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.execute('SELECT mobile_number FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).send('User Not Found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendMail(email, otp);

        await pool.execute(
            'UPDATE users SET otp = ?, otp_generated_date = NOW(), otp_expiry = NOW() + INTERVAL 5 MINUTE, otp_verified = ? WHERE email = ?',
            [otp, 'no', email]
        );

        res.status(200).json({ message: 'OTP Sent Successfully', mobile_number: rows[0].mobile_number });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const [rows] = await pool.execute('SELECT id, otp, otp_expiry FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).send('User Not Found');
        }

        if (rows[0].otp !== otp) {
            return res.status(400).send('Invalid OTP');
        }

        const expiry = new Date(rows[0].otp_expiry);
        if (expiry < new Date()) {
            return res.status(400).send('OTP Expired');
        }
        const token = jwt.sign({ userId: rows[0].id, email }, SECRET_KEY, { expiresIn: '1h' });

        await pool.execute(
            'UPDATE users SET otp_verified = ?, updated_at = NOW() WHERE email = ?',
            ['yes', email]
        );

        res.status(200).json({ message: 'OTP Verified', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
