import pool from '../config/db.js';

export const getAllLedgerGroup = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM account_ledger_group WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

export const getLegderGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM account_ledger_group WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'account ledger group not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addLedgerGroup = async (req, res) => {
    try {
        const { group_name,status, ip_address, created_by } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO account_ledger_group 
            (group_name, status, created_at, updated_at,ip_address,created_by, is_delete) 
            VALUES (?, ?, NOW(), NOW(), ?, ?, 0)`,
            [group_name,status, ip_address, created_by]
        );

        res.status(201).json({ message: ' account ledger group added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLedgerGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { group_name,status} = req.body;

        const [result] = await pool.query(
            `UPDATE account_ledger_group 
            SET group_name = ?, status = ?,updated_at = NOW()
            WHERE id = ? AND is_delete = 0 `,
            [group_name, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ledger group not found or already deleted' });
        }
        res.json({ message: 'ledger group updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteLedgerGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE account_ledger_group 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ledger group not found' });
        }
        res.json({ message: 'ledger group deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};