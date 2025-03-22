import pool from '../config/db.js';

export const getAllSectors = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM property_sectors WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSectorById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_sectors WHERE id = ? AND is_delete = 0',
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

export const addSectors = async (req, res) => {
    try {
        const { property_id, sector_name, sector_description, status, ip_address, created_by } = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_sectors 
            (property_id, sector_name, sector_description, created_at, updated_at, status, ip_address, created_by, is_delete) 
            VALUES (?, ?, ?,NOW(), NOW(), ?, ?, ?, 0)`,
            [property_id, sector_name, sector_description, status, ip_address, created_by]
        );

        res.status(201).json({ message: ' sector added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSector = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, sector_name, sector_description, status, ip_address, created_by} = req.body;

        const [result] = await pool.query(
            `UPDATE property_sectors 
            SET property_id = ?, sector_name = ?, sector_description = ?, updated_at = NOW(), status = ?, ip_address = ?, created_by = ?
            WHERE id = ? AND is_delete = 0 `,
            [property_id, sector_name, sector_description, status, ip_address, created_by, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sector not found or already deleted' });
        }
        res.json({ message: 'Sector updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSectorsByProperty = async (req, res) => {
    try {
        const { property_id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_sectors WHERE property_id = ? AND is_delete = 0', [property_id]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteSector = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_sectors 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'sector not found' });
        }
        res.json({ message: 'sector deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};