import pool from '../config/db.js';

export const getAllLedger = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM account_ledger WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

export const getLegderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM account_ledger WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'account ledger not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addLedger = async (req, res) => {
    try {
        const { ledger_name,account_ledger_child_group_id,account_ledger_sub_group_id,account_ledger_group_id,status,ip_address, created_by } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO account_ledger 
            (ledger_name,account_ledger_child_group_id,account_ledger_sub_group_id,account_ledger_group_id,status, created_at, updated_at,ip_address,created_by, is_delete) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
            [ledger_name,account_ledger_child_group_id,account_ledger_sub_group_id,account_ledger_group_id,status,ip_address,created_by]
        );

        res.status(201).json({ message:'account ledger added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLedger = async (req, res) => {
    try {
        const { id } = req.params;
        const { ledger_name,account_ledger_child_group_id,account_ledger_sub_group_id,account_ledger_group_id,status} = req.body;

        const [result] = await pool.query(
            `UPDATE account_ledgers 
            SET ledger_name = ?,account_ledger_child_group_id = ?,account_ledger_sub_group_id = ?,account_ledger_group_id = ?, status = ?,updated_at = NOW()
            WHERE id = ? AND is_delete = 0 `,
            [ledger_name,account_ledger_child_group_id,account_ledger_sub_group_id,account_ledger_group_id,status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'account ledger not found or already deleted' });
        }
        res.json({ message: 'ledger updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteLedger = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE account_ledgers 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'account ledger not found' });
        }
        res.json({ message: 'account ledger deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};