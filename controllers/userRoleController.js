import pool from "../config/db.js";

export const getAllUsersRole = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM user_role WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};