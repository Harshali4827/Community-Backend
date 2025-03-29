import pool from '../config/db.js';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export const addProperty = async (req, res) => {
    try {
        const { property_name, address, country_id, city_id, state_id, google_location, latitude, longitude, gst_number, 
            total_sectors, total_blocks, total_units, total_offices, total_amenities, total_gates, total_parkings, 
            total_guest_parking, min_sub_members_allow, min_cars_allow, min_bikes_allow, min_house_helps_allow, 
            chairman_name, chairman_contact_no, chairman_email, emergency_name, emergency_contact_no, emergency_email, 
            additional_parking_charges, is_payment_gateway_visible, status, ip_address, created_by } = req.body;

        const logo = req.file ? req.file.filename : null; 

        const [result] = await pool.query(
            `INSERT INTO property 
            (property_name, logo, address, country_id, city_id, state_id, google_location, latitude, longitude, 
            gst_number, total_sectors, total_blocks, total_units, total_offices, total_amenities, total_gates, 
            total_parkings, total_guest_parking, min_sub_members_allow, min_cars_allow, min_bikes_allow, 
            min_house_helps_allow, chairman_name, chairman_contact_no, chairman_email, emergency_name, 
            emergency_contact_no, emergency_email, additional_parking_charges, is_payment_gateway_visible, 
            status, created_at, updated_at, ip_address, created_by, is_delete) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
            [property_name, logo, address, country_id, city_id, state_id, google_location, latitude, longitude, gst_number, 
                total_sectors, total_blocks, total_units, total_offices, total_amenities, total_gates, total_parkings, 
                total_guest_parking, min_sub_members_allow, min_cars_allow, min_bikes_allow, min_house_helps_allow, 
                chairman_name, chairman_contact_no, chairman_email, emergency_name, emergency_contact_no, emergency_email, 
                additional_parking_charges, is_payment_gateway_visible, status, ip_address, created_by]
        );

        res.status(201).json({ message: 'Property added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const [property] = await pool.query('SELECT * FROM property WHERE id = ? AND is_delete = 0', [id]);

        if (property.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property[0]);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            property_name, address, country_id, city_id, state_id, google_location, latitude, longitude, gst_number, 
            total_sectors, total_blocks, total_units, total_offices, total_amenities, total_gates, total_parkings, 
            total_guest_parking, min_sub_members_allow, min_cars_allow, min_bikes_allow, min_house_helps_allow, 
            chairman_name, chairman_contact_no, chairman_email, emergency_name, emergency_contact_no, emergency_email, 
            additional_parking_charges, is_payment_gateway_visible, status
        } = req.body;

        const [result] = await pool.query(
            `UPDATE property 
             SET property_name = ?, address = ?, country_id = ?, city_id = ?, state_id = ?, 
                 google_location = ?, latitude = ?, longitude = ?, gst_number = ?, 
                 total_sectors = ?, total_blocks = ?, total_units = ?, total_offices = ?, 
                 total_amenities = ?, total_gates = ?, total_parkings = ?, total_guest_parking = ?, min_sub_members_allow = ?, 
                 min_cars_allow = ?, min_bikes_allow = ?, min_house_helps_allow = ?, chairman_name = ?,chairman_contact_no = ?,
                 chairman_email = ?,
                 emergency_name = ?,
                 emergency_contact_no = ?,
                 emergency_email = ?, 
                 additional_parking_charges = ?,         is_payment_gateway_visible = ?,
                 status = ?, 
                 updated_at = NOW() WHERE id = ? and is_delete = 0`,
            [
                property_name, address, country_id, city_id, state_id, google_location, latitude, longitude, gst_number, 
                total_sectors, total_blocks, total_units, total_offices, total_amenities, total_gates, total_parkings, 
                total_guest_parking, min_sub_members_allow, min_cars_allow, min_bikes_allow, min_house_helps_allow, 
                chairman_name, chairman_contact_no, chairman_email, emergency_name, emergency_contact_no, emergency_email, 
                additional_parking_charges, is_payment_gateway_visible, status, id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Property details not found or already deleted' });
        }
        res.json({ message: 'Property details updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
};

export const getAllProperties = async (req, res) => {
    try {
        const [properties] = await pool.query('SELECT * FROM property WHERE is_delete = 0');
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `UPDATE property 
            SET is_delete = 1, updated_at = NOW() 
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'property not found' });
        }
        res.json({ message: 'property deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};