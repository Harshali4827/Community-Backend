import pool from '../config/db.js';

export const getAllUserProperty = async (req, res) => {
    try {
        const query = 'SELECT * FROM user_property';
        console.log("Executing Query:", query);
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};
