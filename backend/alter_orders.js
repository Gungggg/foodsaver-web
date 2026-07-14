require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'foodsaver'
    });

    try {
        console.log("Adding payment_method to orders table...");
        await connection.query("ALTER TABLE orders ADD COLUMN payment_method ENUM('cash', 'transfer') NOT NULL DEFAULT 'transfer'");
        console.log("Column added successfully!");
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("Column already exists.");
        } else {
            console.error("Error adding column:", e);
        }
    } finally {
        await connection.end();
    }
}

run();
