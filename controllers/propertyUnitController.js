import pool from '../config/db.js';

export const getUserPropertyUnits = async (req, res) => {
    try {
        const query = `
            SELECT 
                upu.*, 
                u.full_name AS user_name,
                p.property_name,
                ps.sector_name,
                pb.block_name,
                ur.role_name
            FROM 
                user_property_units upu
            JOIN users u ON upu.user_id = u.id
            JOIN property p ON upu.property_id = p.id
            JOIN property_sectors ps ON upu.property_sector_id = ps.id
            JOIN property_blocks pb ON upu.property_block_id = pb.id
            JOIN user_role ur ON upu.user_role_id = ur.id;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};
export const getUserPropertyUnitByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                upu.*, 
                u.full_name AS user_name,
                p.property_name,
                ps.sector_name,
                pb.block_name,
                ur.role_name
            FROM 
                user_property_units upu
            JOIN users u ON upu.user_id = u.id
            JOIN property p ON upu.property_id = p.id
            JOIN property_sectors ps ON upu.property_sector_id = ps.id
            JOIN property_blocks pb ON upu.property_block_id = pb.id
            JOIN user_role ur ON upu.user_role_id = ur.id
            WHERE upu.user_id = ?;
        `;
        const [results] = await pool.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User property unit not found' });
        }
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const addUserPropertyUnit = async (req, res) => {
    try {
        const { user_id, property_id, property_sector_id, property_block_id, property_unit_id, floor_number, unit_number, unit_status_id, unit_combination, membership_no, user_role_id, share_holding_no, share_certificate_nos, share_certificate_bank_name, kids_count, senior_citizen_count, male_count, female_count, total_people_count, alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per, club_due_date, four_sos_number } = req.body;
        await pool.query('START TRANSACTION');
        const [unitResult] = await pool.query(
            `INSERT INTO user_property_units 
            (user_id, property_id, property_sector_id, property_block_id, property_unit_id, floor_number, unit_number, unit_status_id, unit_combination, membership_no, user_role_id, share_holding_no, share_certificate_nos, share_certificate_bank_name, kids_count, senior_citizen_count, male_count, female_count, total_people_count, alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per, club_due_date, four_sos_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, property_id, property_sector_id, property_block_id, property_unit_id, floor_number, unit_number, unit_status_id, unit_combination, membership_no, user_role_id, share_holding_no, share_certificate_nos, share_certificate_bank_name, kids_count, senior_citizen_count, male_count, female_count, total_people_count, alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per, club_due_date, four_sos_number]
        );
        const [propertyResult] = await pool.query(
            `INSERT INTO user_property (user_id, property_id, membership_no, user_role_id) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE membership_no = ?, user_role_id = ?`,
            [user_id, property_id, membership_no, user_role_id, membership_no, user_role_id]
        );
        await pool.query('COMMIT');

        res.status(201).json({ message: 'User property unit added successfully', unitId: unitResult.insertId, propertyId: propertyResult.insertId });
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};

export const getPropertyUnitById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            'SELECT * FROM user_property_units WHERE id = ?',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Property unit not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updatePropertyUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, property_sector_id, property_block_id,property_unit_id, floor_number,unit_number,unit_status_id,unit_combination,membership_no,user_role_id,share_holding_no, share_certificate_nos,share_certificate_bank_name, kids_count,senior_citizen_count,male_count,female_count,total_people_count,alloted_four_wheel_parking_count,alloted_two_wheel_parking_count,nominee_names_and_per,club_due_date,four_sos_number} = req.body;

        const [result] = await pool.query(
            `UPDATE user_property_units 
            SET property_id = ?, property_sector_id = ?, property_block_id = ?, property_unit_id = ?, floor_number = ?,unit_number = ?,unit_status_id = ?,unit_combination = ?, membership_no = ?, user_role_id, = ?, share_holding_no = ?,share_certificate_nos = ?,share_certificate_bank_name = ?,kids_count = ?,senior_citizen_count = ?,male_count = ?,female_count = ?,total_people_count = ?,alloted_four_wheel_parking_count = ?,alloted_two_wheel_parking_count = ?,nominee_names_and_per = ?,club_due_date = ?,four_sos_number = ? WHERE id = ?`,
            [ property_id, property_sector_id, property_block_id,property_unit_id, floor_number,unit_number,unit_status_id,unit_combination,membership_no,user_role_id,share_holding_no, share_certificate_nos,share_certificate_bank_name, kids_count,senior_citizen_count,male_count,female_count,total_people_count,alloted_four_wheel_parking_count,alloted_two_wheel_parking_count,nominee_names_and_per,club_due_date,four_sos_number, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Property unit not found or already deleted' });
        }
        res.json({ message: 'Property unit updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUserPropertyUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `delete from user_property_units where id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'user property unit not found' });
        }
        res.json({ message: 'user property unit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};