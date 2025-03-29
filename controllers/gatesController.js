import pool from '../config/db.js';

export const getAllGates = async (req, res) => {
    try {
        const query = `
            SELECT 
                pg.id,
                pg.gate_name,
                pg.gate_description,
                pg.is_main_gate,
                pg.status,
                pg.created_at,
                pg.updated_at,
                pg.ip_address,
                pg.created_by,
                p.property_name
            FROM 
                property_gates pg
            JOIN 
                property p ON pg.property_id = p.id
            WHERE 
                pg.is_delete = 0;
        `;
        console.log("Executing Query:", query);
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getPropertyGateById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_gates WHERE id = ? AND is_delete = 0',
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

export const addPropertyGate = async (req, res) => {
    try {
        const { property_id, gate_name, gate_description, is_main_gate, status, ip_address, created_by } = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_gates 
            (property_id, gate_name, gate_description, is_main_gate,status, created_at, updated_at, ip_address, created_by, is_delete) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
            [ property_id, gate_name, gate_description, is_main_gate, status, ip_address, created_by ]
        );

        res.status(201).json({ message: 'Gate added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePropertyGate = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, gate_name, gate_description, is_main_gate, status} = req.body;

        const [result] = await pool.query(
            `UPDATE property_gates 
            SET property_id = ?, gate_name = ?, gate_description = ?, is_main_gate = ?, status = ?, updated_at = NOW() WHERE id = ? AND is_delete = 0`,
            [property_id, gate_name, gate_description, is_main_gate, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gate not found or already deleted' });
        }
        res.json({ message: 'Gate updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deletePropertyGate = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_gates 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'gate not found' });
        }
        res.json({ message: 'gate deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};