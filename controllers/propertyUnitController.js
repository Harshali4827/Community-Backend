import pool from '../config/db.js';

export const getUserPropertyUnits = async (req, res) => {
    try {
        const query = 'SELECT * FROM user_property_units';
        console.log("Executing Query:", query);
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};


export const getUserPropertyUnitByUserId = async (req, res) => {
    try {
        const { id } = req.params; 
        const [results] = await pool.query(
            'SELECT * FROM user_property_units WHERE user_id = ?', 
            [id]  
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'User property unit not found' });
        }
        res.json(results); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
