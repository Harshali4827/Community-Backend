import pool from '../config/db.js';

export const getAllBlocks = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM property_blocks WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBlockById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_blocks WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Sector not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addBlocks = async (req, res) => {
    try {
        const { property_id, property_sector_id, block_name,total_units,unit_number_start_from,unit_number_end_to,ip_address, created_by, status} = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_blocks 
            (property_id, property_sector_id, block_name,total_units,unit_number_start_from,unit_number_end_to, created_at, updated_at, ip_address, created_by, status, is_delete) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, 0)`,
            [property_id, property_sector_id, block_name, total_units,unit_number_start_from, unit_number_end_to,ip_address, created_by, status]
        );

        res.status(201).json({ message: 'blocks added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, property_sector_id, block_name, total_units, unit_number_start_from, unit_number_end_to, ip_address, created_by, status} = req.body;

        const [result] = await pool.query(
            `UPDATE property_blocks 
            SET property_id = ?, 
                property_sector_id = ?, 
                block_name = ?, 
                total_units = ?, 
                unit_number_start_from = ?, 
                unit_number_end_to = ?, 
                updated_at = NOW(), 
                ip_address = ?, 
                created_by = ?, 
                status = ?
                WHERE id = ? AND is_delete = 0 `,
            [property_id, property_sector_id, block_name, total_units, unit_number_start_from, unit_number_end_to, ip_address, created_by, status,id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Block not found' });
        }
        res.json({ message: 'Block updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBlocksBySector = async (req, res) => {
    try {
        const { sector_id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_blocks WHERE property_sector_id = ? AND is_delete = 0', [sector_id]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_blocks 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'block not found' });
        }
        res.json({ message: 'block deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};