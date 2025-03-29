import pool from '../config/db.js';

export const getAllUserProperty = async (req, res) => {
    try {
        const query = `
            SELECT 
                up.id AS user_property_id,
                u.full_name AS user_name,
                p.property_name,
                ur.role_name,
                up.membership_no AS membership_number
            FROM 
                user_property AS up
            JOIN 
                users AS u ON up.user_id = u.id
            JOIN 
                property AS p ON up.property_id = p.id
            JOIN 
                user_role AS ur ON up.user_role_id = ur.id;
        `;
        console.log("Executing Query:", query);
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteUserProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `delete from user_property where id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'user property not found' });
        }
        res.json({ message: 'user property deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};