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
  
  const property_id = parseInt(req.body.property_id, 10);
  if (isNaN(property_id)) return res.status(400).json({ message: "Invalid property ID" });
  if (!property_id) return res.status(400).json({ message: "Property ID is required" });

  const filePath = path.resolve(req.file.path);
  
  try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      jsonData.forEach(row => {
          Object.keys(row).forEach(key => {
              const trimmedKey = key.trim();
              if (trimmedKey !== key) {
                  row[trimmedKey] = row[key];
                  delete row[key];
              }
              if (typeof row[trimmedKey] === 'string') {
                  row[trimmedKey] = row[trimmedKey].trim();
              }
          });
      });

      const connection = await pool.getConnection();

      try {
        
          const [propertyCheck] = await connection.execute(
              `SELECT id FROM property WHERE id = ? AND is_delete = 0`,
              [property_id]
          );
          
          if (propertyCheck.length === 0) {
              throw new Error(`Property with ID ${property_id} does not exist`);
          }

          await connection.beginTransaction();

          for (const row of jsonData) {
              const unit_number = row["FLAT NOS."] !== undefined ? String(row["FLAT NOS."]).trim() : null;
              const sector_name = row["PROPERTY SECTORS / SEGMENTS (Drop Down from society profile)"] ? String(row["PROPERTY SECTORS / SEGMENTS (Drop Down from society profile)"]).trim() : null;
              const block_name = row["PROPERTY WINGS / SUBDIVISION (Drop Down from society profile)"] ? String(row["PROPERTY WINGS / SUBDIVISION (Drop Down from society profile)"]).trim() : null;
              const membership_no = row["MEMBERSHIP NO."] ? String(row["MEMBERSHIP NO."]).trim() : null;
              const member_type = row["MEMBER TYPE - MEMBER / MC MEMBERS  / MC STAFF"] ? String(row["MEMBER TYPE - MEMBER / MC MEMBERS  / MC STAFF"]).trim() : null;
              const is_part_of_maintenance_bill = row["TICK MARK BOX FOR PART OF MAINTAINANCE BILL -  If yes then will be part of monthly bill generation"] || null;
              const title = row["TITLE -  DROPDOWN"] ? String(row["TITLE -  DROPDOWN"]).trim() : null;
              const full_name = row["FULL NAME -"] ? String(row["FULL NAME -"]).trim() : null;
              const mobile_number = row["MOBILE NUMBER -"] ? String(row["MOBILE NUMBER -"]).trim() : null;
              const share_holding_no = row["SHARE HOLDING NO. -"] ? String(row["SHARE HOLDING NO. -"]).trim() : null;
              const share_certificate_nos = row["SHARE CERTIFICATE NOS. -"] ? String(row["SHARE CERTIFICATE NOS. -"]).trim() : null;
              const share_certificate_bank_name = row["SHARE CERTIFICATE PLEDGE WITH BANK NAME -"] ? String(row["SHARE CERTIFICATE PLEDGE WITH BANK NAME -"]).trim() : null;
              const email = row["EMAIL ID -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)"] ? String(row["EMAIL ID -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)"]).trim() : null;
              const pan_number = row["PAN NO. -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)"] ? String(row["PAN NO. -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)"]).trim() : null;
              const aadhar_number = row["ADHAAR NO. -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)"] ? String(row["ADHAAR NO. -  THIS CAN BE UPDATED LATER IN PROFILE ONLY EDIT OPTION NO DELETE  (INPUT VALIDATION)"]).trim() : null;
              const kids_count = parseInt(row["KIDS COUNT (INFO POPUP) - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)"]) || 0;
              const senior_citizen_count = parseInt(row["SENIOR CITIZEN COUNT (INFO POPUP)  - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)"]) || 0;
              const male_count = parseInt(row["MALE COUNT (INFO POPUP)  - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)"]) || 0;
              const female_count = parseInt(row["FEMALE COUNT (INFO POPUP)  - THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)"]) || 0;
              const total_people_count = parseInt(row["TOTAL PEOPLE COUNT (INFO POPUP)  -  THIS CAN BE UPDATED LATER IN PROFILE (INPUT VALIDATION)"]) || 0;
              const alloted_four_wheel_parking_count = parseInt(row["ALLOTED 4 WHEELER PARKING COUNT -"]) || 0;
              const alloted_two_wheel_parking_count = parseInt(row["ALLOTED 2 WHEELER PARKING COUNT -"]) || 0;
              const nominee_names_and_per = row["NOMINEE NAME & %"] ? String(row["NOMINEE NAME & %"]).trim() : null;

              let user_id;
              const [existingUser] = await connection.execute(
                  `SELECT id FROM users WHERE mobile_number = ? OR email = ? LIMIT 1`,
                  [mobile_number, email]
              );

              if (existingUser.length > 0) {
                  user_id = existingUser[0].id;
                  await connection.execute(
                      `UPDATE users SET 
                          title = ?, 
                          full_name = ?, 
                          mobile_number = ?, 
                          email = ?, 
                          aadhar_number = ?, 
                          pan_number = ?,
                          updated_at = CURRENT_TIMESTAMP
                       WHERE id = ?`,
                      [title, full_name, mobile_number, email, aadhar_number, pan_number, user_id]
                  );
              } else {
                  const [userResult] = await connection.execute(
                      `INSERT INTO users (title, full_name, mobile_number, email, aadhar_number, pan_number) 
                       VALUES (?, ?, ?, ?, ?, ?)`,
                      [title, full_name, mobile_number, email, aadhar_number, pan_number]
                  );
                  user_id = userResult.insertId;
              }

              let property_sector_id;
              if (sector_name) {
                  const [existingSector] = await connection.execute(
                      `SELECT id FROM property_sectors 
                       WHERE property_id = ? AND sector_name = ?`,
                      [property_id, sector_name]
                  );

                  if (existingSector.length > 0) {
                      property_sector_id = existingSector[0].id;
                  } else {
                      const [sectorResult] = await connection.execute(
                          `INSERT INTO property_sectors (property_id, sector_name, status) 
                           VALUES (?, ?, 'active')`,
                          [property_id, sector_name]
                      );
                      property_sector_id = sectorResult.insertId;
                  }
              }

              let property_block_id;
              if (block_name) {
                  const [existingBlock] = await connection.execute(
                      `SELECT id FROM property_blocks 
                       WHERE property_id = ? 
                       AND property_sector_id = ? 
                       AND block_name = ?`,
                      [property_id, property_sector_id, block_name]
                  );

                  if (existingBlock.length > 0) {
                      property_block_id = existingBlock[0].id;
                  } else {
                      const [blockResult] = await connection.execute(
                          `INSERT INTO property_blocks (property_id, property_sector_id, block_name, status) 
                           VALUES (?, ?, ?, 'active')`,
                          [property_id, property_sector_id, block_name]
                      );
                      property_block_id = blockResult.insertId;
                  }
              }

              let property_unit_id;
              if (unit_number) {
                  const [existingUnit] = await connection.execute(
                      `SELECT id FROM property_units 
                       WHERE property_id = ? 
                       AND property_sector_id = ? 
                       AND property_block_id = ? 
                       AND unit_number = ?`,
                      [property_id, property_sector_id, property_block_id, unit_number]
                  );

                  if (existingUnit.length > 0) {
                      property_unit_id = existingUnit[0].id;
                  } else {
                      const [unitResult] = await connection.execute(
                          `INSERT INTO property_units (property_id, property_sector_id, property_block_id, unit_number) 
                           VALUES (?, ?, ?, ?)`,
                          [property_id, property_sector_id, property_block_id, unit_number]
                      );
                      property_unit_id = unitResult.insertId;
                  }
              }

              let user_role_id = null;
              if (member_type) {
                  const [roleResult] = await connection.execute(
                      `SELECT id FROM user_role WHERE LOWER(role_name) = LOWER(?)`,
                      [member_type]
                  );

                  if (roleResult.length > 0) {
                      user_role_id = roleResult[0].id;
                  } else {
                      const [roleInsert] = await connection.execute(
                          `INSERT INTO user_role (role_name, application_module_access, status) 
                           VALUES (?, '', 'active')`,
                          [member_type]
                      );
                      user_role_id = roleInsert.insertId;
                  }
              }

              if (user_id && property_id) {
                  const [existingUserProperty] = await connection.execute(
                      `SELECT id FROM user_property 
                       WHERE user_id = ? AND property_id = ?`,
                      [user_id, property_id]
                  );

                  if (existingUserProperty.length > 0) {
                      await connection.execute(
                          `UPDATE user_property SET 
                              membership_no = ?, 
                              user_role_id = ?
                           WHERE id = ?`,
                          [share_holding_no, user_role_id, existingUserProperty[0].id]
                      );
                  } else {
                      await connection.execute(
                          `INSERT INTO user_property (user_id, property_id, membership_no, user_role_id) 
                           VALUES (?, ?, ?, ?)`,
                          [user_id, property_id, share_holding_no, user_role_id]
                      );
                  }
              }

              if (user_id && property_id && property_unit_id) {
                  const [existingUserPropertyUnit] = await connection.execute(
                      `SELECT id FROM user_property_units 
                       WHERE user_id = ? AND property_id = ? AND property_unit_id = ?`,
                      [user_id, property_id, property_unit_id]
                  );

                  const unit_combination = `${sector_name || ''}-${block_name || ''}-${unit_number || ''}`;
                  const floor_number = 0;
                  const unit_status_id = null;

                  if (existingUserPropertyUnit.length > 0) {
                      await connection.execute(
                          `UPDATE user_property_units SET
                              property_sector_id = ?,
                              property_block_id = ?,
                              floor_number = ?,
                              unit_number = ?,
                              unit_status_id = ?,
                              unit_combination = ?,
                              membership_no = ?,
                              user_role_id = ?,
                              share_holding_no = ?,
                              share_certificate_nos = ?,
                              share_certificate_bank_name = ?,
                              kids_count = ?,
                              senior_citizen_count = ?,
                              male_count = ?,
                              female_count = ?,
                              total_people_count = ?,
                              alloted_four_wheel_parking_count = ?,
                              alloted_two_wheel_parking_count = ?,
                              nominee_names_and_per = ?,
                              updated_at = CURRENT_TIMESTAMP
                           WHERE id = ?`,
                          [
                              property_sector_id, property_block_id, floor_number, unit_number, unit_status_id,
                              unit_combination, membership_no, user_role_id, share_holding_no, share_certificate_nos,
                              share_certificate_bank_name, kids_count, senior_citizen_count, male_count, female_count,
                              total_people_count, alloted_four_wheel_parking_count, alloted_two_wheel_parking_count,
                              nominee_names_and_per, existingUserPropertyUnit[0].id
                          ]
                      );
                  } else {
                      await connection.execute(
                          `INSERT INTO user_property_units (
                              user_id, property_id, property_sector_id, property_block_id, property_unit_id,
                              floor_number, unit_number, unit_status_id, unit_combination, membership_no,
                              user_role_id, share_holding_no, share_certificate_nos, share_certificate_bank_name,
                              kids_count, senior_citizen_count, male_count, female_count, total_people_count,
                              alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per
                          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                          [
                              user_id, property_id, property_sector_id, property_block_id, property_unit_id,
                              floor_number, unit_number, unit_status_id, unit_combination, membership_no,
                              user_role_id, share_holding_no, share_certificate_nos, share_certificate_bank_name,
                              kids_count, senior_citizen_count, male_count, female_count, total_people_count,
                              alloted_four_wheel_parking_count, alloted_two_wheel_parking_count, nominee_names_and_per
                          ]
                      );
                  }
              }
          }

          await connection.commit();
          res.json({ message: "Data processed successfully (inserted or updated as needed)" });

      } catch (error) {
          await connection.rollback();
          console.error("Transaction Failed:", error);
          res.status(500).json({ 
              message: "Data processing failed", 
              error: error.message,
              details: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
      } finally {
          connection.release();
      }
  } catch (error) {
      console.error("File processing error:", error);
      res.status(500).json({ 
          message: "File processing failed", 
          error: error.message 
      });
  } finally {
      try {
          fs.unlinkSync(filePath);
      } catch (unlinkError) {
          console.error("Failed to delete temporary file:", unlinkError);
      }
  }
};
  
export { upload };
