import pool from '../config/db.js';

export const getAllOffices = async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT po.id, po.office_name, po.office_description, po.office_contact, po.status, po.created_at, po.updated_at,
                   p.property_name, ps.sector_name, pb.block_name, pu.unit_number
            FROM property_offices AS po
            JOIN property AS p ON po.property_id = p.id
            JOIN property_sectors AS ps ON po.property_sector_id = ps.id
            JOIN property_blocks AS pb ON po.property_block_id = pb.id
            JOIN property_units AS pu ON po.property_unit_id = pu.id
            WHERE po.is_delete = 0
        `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOfficeById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_offices WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Office not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addOffice = async (req, res) => {
    try {
        const { property_id, property_sector_id, property_block_id,property_unit_id,office_name,office_description,office_contact, status, ip_address, created_by } = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_offices 
            (property_id, property_sector_id, property_block_id,property_unit_id,office_name,office_description,office_contact,status, created_at, updated_at, ip_address, created_by, is_delete) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
            [property_id, property_sector_id, property_block_id,property_unit_id,office_name,office_description,office_contact, status, ip_address, created_by]
        );

        res.status(201).json({ message: ' office added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOffice = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, property_sector_id, property_block_id,property_unit_id,office_name,office_description,office_contact, status } = req.body;

        const [result] = await pool.query(
            `UPDATE property_offices 
            SET property_id = ?, property_sector_id = ?, property_block_id = ?,property_unit_id = ?,office_name = ?,office_description = ?,office_contact = ?,status = ?, updated_at = NOW()
            WHERE id = ? and is_delete = 0`,
            [ property_id, property_sector_id, property_block_id,property_unit_id,office_name,office_description,office_contact, status,id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Office not found or already deleted' });
        }
        res.json({ message: 'Office updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteOffice = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_offices 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'office not found' });
        }
        res.json({ message: 'office deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};