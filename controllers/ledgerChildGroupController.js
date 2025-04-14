import pool from '../config/db.js';

export const getAllChildGroup = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM account_ledger_child_group WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 
export const getChildGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM account_ledger_child_group WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'account ledger child group not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addChildGroup = async (req, res) => {
    try {
        const { child_group_name,status, ip_address, created_by } = req.body;
        const [result] = await pool.query(
            `INSERT INTO account_ledger_child_group 
            (child_group_name,status, created_at, updated_at,ip_address,created_by, is_delete) 
            VALUES (?, ?, NOW(), NOW(), ?, ?, 0)`,
            [child_group_name,status, ip_address, created_by]
        );

        res.status(201).json({ message: ' ledger child group added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateChildGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { child_group_name,status} = req.body;
        const [result] = await pool.query(
            `UPDATE account_ledger_child_group 
            SET child_group_name = ?, status = ?,updated_at = NOW()
            WHERE id = ? AND is_delete = 0 `,
            [child_group_name, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ledger child group not found or already deleted' });
        }
        res.json({ message: 'ledger child group updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteChildGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE account_ledger_child_group 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ledger child group not found' });
        }
        res.json({ message: 'ledger child group deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};