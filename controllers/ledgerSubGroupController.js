import pool from '../config/db.js';


export const getAllLedgerSubGroup = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM account_ledger_sub_group WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

export const getLegderSubGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM account_ledger_sub_group WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'account ledger sub group not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addLedgerSubGroup = async (req, res) => {
    try {
        const { sub_group_name, status, ip_address, created_by } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO account_ledger_sub_group 
            (sub_group_name,status, created_at, updated_at,ip_address,created_by, is_delete) 
            VALUES (?, ?, NOW(), NOW(), ?, ?, 0)`,
            [sub_group_name, status, ip_address, created_by]
        );
        res.status(201).json({ message: ' account ledger sub group added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLedgerSubGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub_group_name,status} = req.body;

        const [result] = await pool.query(
            `UPDATE account_ledger_sub_group 
            SET sub_group_name = ?, status = ?,updated_at = NOW()
            WHERE id = ? AND is_delete = 0 `,
            [sub_group_name, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ledger sub group not found or already deleted' });
        }
        res.json({ message: 'ledger sub group updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteLedgerSubGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE account_ledger_group 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ledger sub group not found' });
        }
        res.json({ message: 'ledger sub group deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};