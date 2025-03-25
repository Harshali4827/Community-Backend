import xlsx from 'xlsx';
import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export const importExcel = async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or invalid.' });
        }

        const values = data.map(row => [
            row.title || null,
            row.full_name || null,
            row.mobile_number || null,
            row.email || null,
            row.pan_number || null,
            row.aadhar_number || null,
            row.otp || null,
            row.otp_generated_date || null,
            row.otp_expiry || null,
            row.otp_verified || 'no',
            row.ip_address || null,
            row.is_delete || 0,
            row.profile_photo || null,
            row.user_category || 0,
            row.blood_group || null
        ]);

        const sql = `
            INSERT INTO users (
                title, full_name, mobile_number, email, pan_number, aadhar_number,
                otp, otp_generated_date, otp_expiry, otp_verified, ip_address,
                is_delete, profile_photo, user_category, blood_group
            ) VALUES ?
        `;

        const [result] = await pool.query(sql, [values]);

        res.json({ message: 'Data imported successfully!', insertedRows: result.affectedRows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error importing data.', details: error.message });
    }
};

export { upload };
