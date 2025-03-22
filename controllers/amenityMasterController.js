import pool from '../config/db.js';

export const getAllAmenities = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM amenity_master WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAmenityById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM amenity_master WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'amenity master not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const addAmenity = async (req, res) => {
    try {
        const {amenity_name, amenity_details, icon_url, status} = req.body;

        const [result] = await pool.query(
            `INSERT INTO amenity_master (amenity_name, amenity_details, icon_url, status, is_delete) VALUES (?, ?, ?, ?, 0)`,
            [amenity_name, amenity_details, icon_url, status]
        );

        res.status(201).json({ message: 'amenity master added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
export const updateAmenity = async (req, res) => {
    try {
        const { id } = req.params;
        const { amenity_name, amenity_details, icon_url, status } = req.body;

        const [result] = await pool.query(
            `UPDATE amenity_master SET amenity_name = ?, amenity_details = ?, icon_url = ?, status = ? WHERE id = ? AND is_delete = 0`,
            [amenity_name, amenity_details, icon_url, status, id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'amenity master not found or already deleted' });
        }
        res.json({ message: 'amenity master updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteAmenity = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE amenity_master 
            SET is_delete = 1 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'amenity master not found' });
        }
        res.json({ message: 'amenity master deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};