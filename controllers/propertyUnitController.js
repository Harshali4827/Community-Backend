import pool from '../config/db.js';

export const getUserPropertyUnits = async (req, res) => {
    try {
        const query = `
            SELECT 
                upu.*, 
                u.full_name AS user_name,
                p.property_name,
                ps.sector_name,
                pb.block_name,
                ur.role_name
            FROM 
                user_property_units upu
            JOIN users u ON upu.user_id = u.id
            JOIN property p ON upu.property_id = p.id
            JOIN property_sectors ps ON upu.property_sector_id = ps.id
            JOIN property_blocks pb ON upu.property_block_id = pb.id
            JOIN user_role ur ON upu.user_role_id = ur.id;
        `;
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
        const query = `
            SELECT 
                upu.*, 
                u.full_name AS user_name,
                p.property_name,
                ps.sector_name,
                pb.block_name,
                ur.role_name
            FROM 
                user_property_units upu
            JOIN users u ON upu.user_id = u.id
            JOIN property p ON upu.property_id = p.id
            JOIN property_sectors ps ON upu.property_sector_id = ps.id
            JOIN property_blocks pb ON upu.property_block_id = pb.id
            JOIN user_role ur ON upu.user_role_id = ur.id
            WHERE upu.user_id = ?;
        `;
        console.log("Executing Query:", query);
        const [results] = await pool.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User property unit not found' });
        }
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteUserPropertyUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `delete from user_property_units where id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'user property unit not found' });
        }
        res.json({ message: 'user property unit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};