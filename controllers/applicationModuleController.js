import pool from '../config/db.js';

export const getAllApplicationModule = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM application_modules WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getApplicationModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM application_modules WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addApplicationModule = async (req, res) => {
    try {
        const { module_name, module_description, parent_module_id, status,ip_address,user_id } = req.body;
        const [result] = await pool.query(

            `INSERT INTO application_modules (module_name, module_description,parent_module_id, status,created_at, updated_at,ip_address,user_id,is_delete) VALUES (?, ?, ?, ?,NOW(), NOW(), ?, ? , 0)`,
            [module_name, module_description, parent_module_id, status, ip_address, user_id]
        );

        res.status(201).json({ message: ' application module added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateApplicationModule = async (req, res) => {
    try {
        const { id } = req.params;
        const {module_name, module_description, parent_module_id, status, ip_address, user_id} = req.body;

        const [result] = await pool.query(
            `UPDATE application_modules 
            SET module_name = ?, module_description = ?, parent_module_id = ?,status = ?,updated_at = NOW(), ip_address = ?, user_id = ? WHERE id = ? AND is_delete = 0`,
            [module_name, module_description, parent_module_id, status, ip_address, user_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Module not found or already deleted' });
        }
        res.json({ message: 'Module updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteApplicationModule = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE application_modules 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'module not found' });
        }
        res.json({ message: 'module deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};