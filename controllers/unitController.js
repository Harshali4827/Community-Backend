import pool from '../config/db.js';

export const getAllUnits = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM property_units WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUnitsById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_units WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addUnits = async (req, res) => {
    try {
        const { property_id, property_sector_id, property_block_id,floor_number,unit_number,ip_address} = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_units 
            (property_id, property_sector_id, property_block_id,floor_number,unit_number, created_at, updated_at, ip_address,is_delete) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, 0)`,
            [property_id, property_sector_id, property_block_id, floor_number,unit_number,ip_address]
        );

        res.status(201).json({ message: 'unit added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
export const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, property_sector_id, property_block_id, floor_number, unit_number, ip_address} = req.body;

        const [result] = await pool.query(
            `UPDATE property_units 
            SET property_id = ?, 
                property_sector_id = ?, 
                property_block_id = ?, 
                floor_number = ?, 
                unit_number = ?, 
                ip_address = ?, 
                updated_at = NOW() 
            WHERE id = ? AND is_delete = 0`,
            [property_id, property_sector_id, property_block_id, floor_number, unit_number, ip_address, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Unit not found or already deleted' });
        }
        res.json({ message: 'Unit updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUnitByBlock = async (req, res) => {
    try {
        const { block_id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_units WHERE property_block_id = ? AND is_delete = 0', [block_id]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_units 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'unit not found' });
        }
        res.json({ message: 'unit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};