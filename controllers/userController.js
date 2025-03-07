import db from '../config/db.js';
import sendMail from '../utils/sendMail.js';

export const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).send('User Not Found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendMail(email, otp);

        await db.execute('UPDATE users SET otp = ?, otp_expiry = NOW() + INTERVAL 5 MINUTE WHERE email = ?', [otp, email]);

        res.status(200).send('OTP Sent Successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const [rows] = await db.execute('SELECT otp, otp_expiry FROM users WHERE email = ?', [email]);

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

        res.status(200).send('OTP Verified');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
