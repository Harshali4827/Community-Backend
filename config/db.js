import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const checkDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to Database');
        connection.release(); 
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};
checkDatabaseConnection();

export default pool;
