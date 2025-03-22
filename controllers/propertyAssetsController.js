import pool from '../config/db.js';

export const getAllPropertyAssets = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM property_assets WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPropertyAssetsById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_assets WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Property Assets not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addPropertyAssets = async (req, res) => {
    try {
        const { property_id, asset_name, asset_description, status, ip_address, created_by, is_delete } = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_assets 
            (property_id, asset_name, asset_description,status,created_at, updated_at,ip_address, created_by, is_delete) 
            VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?,0)`,
            [property_id, asset_name, asset_description, status, ip_address, created_by, is_delete],
        );

        res.status(201).json({ message: ' Property Assets added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePropertyAssets = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, asset_name, asset_description, status , ip_address, created_by} = req.body;

        const [result] = await pool.query(
            `UPDATE property_assets 
            SET property_id = ?, asset_name = ?, asset_description = ?,status = ?, updated_at = NOW(),  ip_address = ?, created_by = ?
            WHERE id = ? and is_delete = 0`,
            [property_id, asset_name, asset_description, status, ip_address,created_by,id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assets not found or already deleted' });
        }
        res.json({ message: 'Assets updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deletePropertyAssets = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_assets 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'assets not found' });
        }
        res.json({ message: 'assets deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};