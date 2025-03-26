import xlsx from 'xlsx';
import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export const importExcel = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const { property_id } = req.body;
    if (!property_id) return res.status(400).json({ message: "Property ID is required" });
  
    const filePath = path.resolve(req.file.path);
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      const connection = await pool.getConnection();
  
      try {
        await connection.beginTransaction();
  
        for (const row of jsonData) {
          const {
            "FLAT NOS.": unit_number,
            "PROPERTY SECTORS / SEGMENTS (Drop Down from society profile)": sector_name,
            "PROPERTY WINGS / SUBDIVISION (Drop Down from society profile)": block_name,
            "MEMBERSHIP NO.": share_holding_no,
            "MEMBER TYPE - MEMBER / MC MEMBERS  / MC STAFF": member_type,
            "TICK MARK BOX FOR PART OF MAINTAINANCE BILL -  If yes then will be part of monthly bill generation": is_part_of_maintenance_bill,
            "TITLE -  DROPDOWN": title,
            "FULL NAME -": full_name,
            "MOBILE NUMBER -": mobile_number,
            "SHARE CERTIFICATE NOS. -": share_certificate_nos,
            "SHARE CERTIFICATE PLEDGE WITH BANK NAME -": share_certificate_bank_name,
            "EMAIL ID -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)": email,
            "PAN NO. -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)": pan_number,
            "ADHAAR NO. -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)": aadhar_number,
            "KIDS COUNT (INFO POPUP) - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)": kids_count,
            "SENIOR CITIZEN COUNT (INFO POPUP)  - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)": senior_citizen_count,
            "MALE COUNT (INFO POPUP)  - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)": male_count,
            "FEMALE COUNT (INFO POPUP)  - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)": female_count,
            "TOTAL PEOPLE COUNT (INFO POPUP)  -  THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)": total_people_count,
            "ALLOTED 4 WHEELER PARKING COUNT -": alloted_four_wheel_parking_count,
            "ALLOTED 2 WHEELER PARKING COUNT -": alloted_two_wheel_parking_count,
            "NOMINEE NAME & %": nominee_names_and_per
          } = row;
  
          // Insert user
          const [userResult] = await connection.execute(
            `INSERT INTO users (title, full_name, mobile_number, email, aadhar_number, pan_number) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, full_name, mobile_number, email, aadhar_number, pan_number]
          );
          const user_id = userResult.insertId;
          
  
          // Insert property sector
          const status = "active";
          const propertyId = property_id || 0;
          const [sectorResult] = await connection.execute(
           `INSERT INTO property_sectors (property_id, sector_name, status) 
              VALUES (?, ?, ?) 
              ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
              [propertyId, sector_name || "Unknown Sector", status]
          );
          const property_sector_id = sectorResult.insertId;
  
          // Insert property block
          const [blockResult] = await connection.execute(
            `INSERT INTO property_blocks (property_sector_id, block_name,status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
            [property_sector_id, block_name,status]
          );
          const property_block_id = blockResult.insertId;
  
          // Insert property unit
          const [unitResult] = await connection.execute(
            `INSERT INTO property_units (property_sector_id, property_block_id, unit_number) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
            [property_sector_id, property_block_id, unit_number]
          );
          const property_unit_id = unitResult.insertId;
  
          // Insert into user_property
          await connection.execute(
            `INSERT INTO user_property (user_id,property_id, membership_no, user_role_id) VALUES (?, ?, 1)`,
            [user_id,property_id,share_holding_no]
          );
  
          // Insert into user_property_units
          await connection.execute(
            `INSERT INTO user_property_units (
              user_id, property_sector_id, property_block_id, property_unit_id,
              unit_combination, share_holding_no, share_certificate_nos, share_certificate_bank_name,
              kids_count, senior_citizen_count, male_count, female_count, total_people_count,
              alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id, property_sector_id, property_block_id, property_unit_id,
              `${sector_name}-${block_name}-${unit_number}`, share_holding_no, share_certificate_nos, share_certificate_bank_name,
              kids_count, senior_citizen_count, male_count, female_count, total_people_count,
              alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per
            ]
          );
        }
  
        await connection.commit();
        res.json({ message: "Data inserted successfully" });
  
      } catch (error) {
        await connection.rollback();
        console.error("Transaction Failed:", error);
        res.status(500).json({ message: "Data insertion failed", error: error.message });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("File processing error:", error);
      res.status(500).json({ message: "File processing failed", error: error.message });
    } finally {
      fs.unlinkSync(filePath);
    }
  };
  
export { upload };
