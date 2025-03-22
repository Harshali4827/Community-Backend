import pool from '../config/db.js';

export const getAllPropertyAmenities = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM property_amenities WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPropertyAmenityById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_amenities WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Property amenity not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addPropertyAmenity = async (req, res) => {
    try {
        const { property_id, property_sector_id, property_block_id, property_unit_id, amenity_id, amenity_details, status, ip_address, created_by } = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_amenities 
            (property_id, property_sector_id, property_block_id, property_unit_id, amenity_id, amenity_details, status, created_at, updated_at, ip_address, created_by, is_delete) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
            [property_id, property_sector_id, property_block_id, property_unit_id, amenity_id, amenity_details, status, ip_address, created_by]
        );

        res.status(201).json({ message: 'Property amenity added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePropertyAmenity = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, property_sector_id, property_block_id, property_unit_id, amenity_id, amenity_details, status} = req.body;

        const [result] = await pool.query(
            `UPDATE property_amenities 
            SET property_id = ?, property_sector_id = ?, property_block_id = ?, property_unit_id = ?, amenity_id = ?, amenity_details = ?, status = ?, updated_at = NOW()
            WHERE id = ? AND is_delete = 0`,
            [property_id, property_sector_id, property_block_id, property_unit_id, amenity_id, amenity_details, status,id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Property amenity not found or already deleted' });
        }
        res.json({ message: 'Property amenity updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deletePropertyAmenity = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_amenities 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Property amenity not found' });
        }
        res.json({ message: 'Property amenity deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};