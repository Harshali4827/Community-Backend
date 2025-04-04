import express from 'express';
import pool from '../config/db.js';
const router = express.Router();

export const addAllData = async (req, res) => {
  const {
    propertyDetails,
    sectors,
    blocks,
    units,
    gates,
    assets,
    banks,
    amenities,
    offices
  } = req.body;

  try {
    const [propertyResult] = await pool.query(
      'INSERT INTO property (property_name, logo, address, country_id, city_id, state_id, google_location, latitude, longitude, gst_number, total_sectors, total_blocks, total_units, total_offices, total_amenities, total_gates, total_parkings, total_guest_parking, min_sub_members_allow, min_cars_allow, min_bikes_allow, min_house_helps_allow, chairman_name, chairman_contact_no, chairman_email, emergency_name, emergency_contact_no, emergency_email, additional_parking_charges, is_payment_gateway_visible, status, ip_address, created_by, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
      [
        propertyDetails.property_name,
        propertyDetails.logo,
        propertyDetails.address,
        propertyDetails.country_id,
        propertyDetails.city_id,
        propertyDetails.state_id,
        propertyDetails.google_location,
        propertyDetails.latitude,
        propertyDetails.longitude,
        propertyDetails.gst_number,
        propertyDetails.total_sectors,
        propertyDetails.total_blocks,
        propertyDetails.total_units,
        propertyDetails.total_offices,
        propertyDetails.total_amenities,
        propertyDetails.total_gates,
        propertyDetails.total_parkings,
        propertyDetails.total_guest_parking,
        propertyDetails.min_sub_members_allow,
        propertyDetails.min_cars_allow,
        propertyDetails.min_bikes_allow,
        propertyDetails.min_house_helps_allow,
        propertyDetails.chairman_name,
        propertyDetails.chairman_contact_no,
        propertyDetails.chairman_email,
        propertyDetails.emergency_name,
        propertyDetails.emergency_contact_no,
        propertyDetails.emergency_email,
        propertyDetails.additional_parking_charges,
        propertyDetails.is_payment_gateway_visible,
        propertyDetails.status,
        propertyDetails.ip_address,
        propertyDetails.created_by
      ]
    );
    const propertyId = propertyResult.insertId;

    for (const sector of sectors) {
      const [sectorResult] = await pool.query(
        'INSERT INTO property_sectors (property_id, sector_name, sector_description, status, ip_address, created_by, is_delete) VALUES (?, ?, ?, ?, ?, ?, 0)',
        [
          propertyId,
          sector.sector_name,
          sector.sector_description,
          sector.status,
          propertyDetails.ip_address,
          propertyDetails.created_by
        ]
      );
      const sectorId = sectorResult.insertId;

      for (const block of blocks) {
        if (block.sector_name === sector.sector_name) {
          const [blockResult] = await pool.query(
            'INSERT INTO property_blocks (property_id, property_sector_id, block_name, total_units, unit_number_start_from, unit_number_end_to, status, ip_address, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              propertyId,
              sectorId,
              block.block_name,
              block.total_units,
              block.unit_number_start_from,
              block.unit_number_end_to,
              block.status,
              propertyDetails.ip_address,
              propertyDetails.created_by
            ]
          );
          const blockId = blockResult.insertId;

          for (const unit of units) {
            if (unit.block_name === block.block_name) {
              await pool.query(
                'INSERT INTO property_units (property_id, property_sector_id, property_block_id, floor_number, unit_number, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
                [
                  propertyId,
                  sectorId,
                  blockId,
                  unit.floor_number,
                  unit.unit_number,
                  propertyDetails.ip_address
                ]
              );
            }
          }
        }
      }
    }

    for (const gate of gates) {
      await pool.query(
        'INSERT INTO property_gates (property_id, gate_name, gate_description, is_main_gate, status, ip_address, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          propertyId,
          gate.gate_name,
          gate.gate_description,
          gate.is_main_gate,
          gate.status,
          propertyDetails.ip_address,
          propertyDetails.created_by
        ]
      );
    }

    for (const asset of assets) {
      await pool.query(
        'INSERT INTO property_assets (property_id, asset_name, asset_description, status, ip_address, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [
          propertyId,
          asset.asset_name,
          asset.asset_description,
          asset.status,
          propertyDetails.ip_address,
          propertyDetails.created_by
        ]
      );
    }

    for (const bank of banks) {
        await pool.query(
          'INSERT INTO property_bank (property_id, bank_name, bank_branch, bank_ifsc,bank_account_number,bank_account_type,bank_account_name, bank_account_holder,is_primary, is_payment_gateway,payment_gateway_name,merchant_name,payment_gateway_mode, live_key_id,live_secret_key,live_account_number,test_key_id,test_secret_key,test_account_number,currency,payment_gateway_status,ip_address, created_by) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            propertyId,
            bank.bank_name,
            bank.bank_branch,
            bank.bank_ifsc,
            bank.bank_account_number,
            bank.bank_account_type,
            bank.bank_account_name,
            bank.bank_account_holder,
            bank.is_primary,
            bank.is_payment_gateway,
            bank.payment_gateway_name,
            bank.merchant_name,
            bank.payment_gateway_mode,
            bank.live_key_id,
            bank.live_secret_key,
            bank.live_account_number,
            bank.test_key_id,
            bank.test_secret_key,
            bank.test_account_number,
            bank.currency,
            bank.payment_gateway_status,
            propertyDetails.ip_address,
            propertyDetails.created_by
          ]
        );
      }

      for (const amenity of amenities) {
        await pool.query(
          'INSERT INTO property_amenities(property_id, property_sector_id, property_block_id, property_unit_id, amenity_id, amenity_details,ip_address, created_by) VALUES (?, 0, 0, 0, ?, ?, ?, ?)',
          [
            propertyId,
            amenity.property_sector_id,
            amenity.property_block_id,
            amenity.property_unit_id,
            amenity.amenity_id,
            amenity.amenity_details,
            propertyDetails.ip_address,
            propertyDetails.created_by
          ]
        );
      }
      
      for (const office of offices) {
        await pool.query(
          'INSERT INTO property_offices(property_id, property_sector_id, property_block_id, property_unit_id, office_name, office_description,office_contact,ip_address, created_by) VALUES (?, 0, 0, 0, ?, ?, ?, ?, ?)',
          [
            propertyId,
            office.property_sector_id,
            office.property_block_id,
            office.property_unit_id,
            office.office_name,
            office.office_description,
            office.office_contact,
            propertyDetails.ip_address,
            propertyDetails.created_by
          ]
        );
      }
    res.status(201).json({ message: 'Property and related data added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the property.' });
  }

  };
