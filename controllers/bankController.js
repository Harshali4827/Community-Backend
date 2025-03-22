import pool from '../config/db.js';

export const getAllBank = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM property_bank WHERE is_delete = 0');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBankById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM property_bank WHERE id = ? AND is_delete = 0',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Bank Details not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addBankDetails = async (req, res) => {
    try {
        const { property_id, bank_name, bank_branch, bank_ifsc,bank_account_number,bank_account_type,bank_account_name,bank_account_holder,is_primary, is_payment_gateway,payment_gateway_name,merchant_name,payment_gateway_mode,live_key_id,live_secret_key,live_account_number, test_key_id,test_secret_key,test_account_number,currency,payment_gateway_status,status, ip_address, created_by } = req.body;

        const [result] = await pool.query(
            `INSERT INTO property_bank 
            (property_id, bank_name, bank_branch, bank_ifsc,bank_account_number,bank_account_type,bank_account_name, bank_account_holder,is_primary, is_payment_gateway,payment_gateway_name,merchant_name,payment_gateway_mode, live_key_id,live_secret_key,live_account_number,test_key_id,test_secret_key,test_account_number,currency,payment_gateway_status,status, created_at, updated_at,  ip_address, created_by, is_delete) 
            VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?, 0)`,
            [property_id, bank_name, bank_branch, bank_ifsc,bank_account_number,bank_account_type,bank_account_name,bank_account_holder,is_primary, is_payment_gateway,payment_gateway_name,merchant_name,payment_gateway_mode,live_key_id,live_secret_key,live_account_number, test_key_id,test_secret_key,test_account_number,currency,payment_gateway_status,status, ip_address, created_by ]
        );

        res.status(201).json({ message: ' bank details added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
          property_id, bank_name, bank_branch, bank_ifsc, bank_account_number, bank_account_type, 
          bank_account_name, bank_account_holder, is_primary, is_payment_gateway, payment_gateway_name, 
          merchant_name, payment_gateway_mode, live_key_id, live_secret_key, live_account_number, 
          test_key_id, test_secret_key, test_account_number, currency, payment_gateway_status, status 
        } = req.body;

        const [result] = await pool.query(
            `UPDATE property_bank 
             SET property_id = ?, bank_name = ?, bank_branch = ?, bank_ifsc = ?, bank_account_number = ?, 
                 bank_account_type = ?, bank_account_name = ?, bank_account_holder = ?, is_primary = ?, 
                 is_payment_gateway = ?, payment_gateway_name = ?, merchant_name = ?, payment_gateway_mode = ?, 
                 live_key_id = ?, live_secret_key = ?, live_account_number = ?, test_key_id = ?, test_secret_key = ?, 
                 test_account_number = ?, currency = ?, payment_gateway_status = ?, status = ?, 
                 updated_at = NOW() WHERE id = ? and is_delete = 0`,
            [
              property_id, bank_name, bank_branch, bank_ifsc, bank_account_number, bank_account_type, 
              bank_account_name, bank_account_holder, is_primary, is_payment_gateway, payment_gateway_name, 
              merchant_name, payment_gateway_mode, live_key_id, live_secret_key, live_account_number, 
              test_key_id, test_secret_key, test_account_number, currency, payment_gateway_status, status, id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bank details not found or already deleted' });
        }
        res.json({ message: 'Bank details updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
};


export const deleteBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property_bank 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'bank details not found' });
        }
        res.json({ message: 'bank details deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};