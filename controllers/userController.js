import sendMail from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/db.js';
import multer from 'multer';
import axios from 'axios';
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ valid: false, message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ valid: false, message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

export const getUserData = (req, res) => {
    res.json({ valid: true, user: req.user });
};

export const getAllUsers = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const registerUser = async (req, res) => {
    const {
        title,
        full_name,
        mobile_number,
        email,
        gender,
        dob,
        pan_number,
        aadhar_number,
        ip_address,
        user_category,
        blood_group,
        app_access,
        country,
        created_at_local,
        updated_at_local,
        user_role_id
    } = req.body;
    const  profile_photo = req.file ? req.file.filename : null; 

    try {
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE (email = ? OR mobile_number = ?) AND is_delete = 0',
            [email, mobile_number]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User with this email or mobile number already exists" });
        }

        const [result] = await pool.execute(
            `INSERT INTO users 
            (title, full_name, mobile_number, email, gender, dob, pan_number, aadhar_number, otp_verified, ip_address, profile_photo, user_category, blood_group, app_access, is_delete, country, timezone, created_at_local, updated_at_local, created_at, updated_at, user_role_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'no', ?, ?, ?, ?, ?, 0, ?,'Asia/Kolkata', ?, ?, NOW(), NOW(), ?)`,
            [title, full_name, mobile_number, email, gender, dob, pan_number, aadhar_number, ip_address, profile_photo, user_category, blood_group, app_access, country,created_at_local,updated_at_local, user_role_id]
        );

        res.status(201).json({ message: "User Registered Successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const checkEmail = async (req, res) => {
    const { email, captchaToken } = req.body;
    if(!captchaToken){
         return res.status(400).json({ message:'Captcha verification failed'})
    }

    //Verify the token with google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`

    try {

        const captchaResponse = await axios.post(verifyUrl)
        if(!captchaResponse.data.success){
            return res.status(400).json({ message: 'Captch verification failed'})
        }
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

        if (rows[0].otp !== otp.toString()) {
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

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM users WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, full_name, mobile_number, email, pan_number,aadhar_number,blood_group} = req.body;

        const [result] = await pool.query(
            `UPDATE users 
            SET title = ?, full_name = ?, mobile_number = ?, email = ?, pan_number = ?,aadhar_number = ?,blood_group = ?,updated_at = NOW()
            WHERE id = ? AND is_delete = 0 `,
            [title, full_name, mobile_number, email, pan_number,aadhar_number,blood_group, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE users 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'user not found' });
        }
        res.json({ message: 'user deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};