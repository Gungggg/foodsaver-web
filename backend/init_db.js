const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'foodsaver'
    });

    console.log('Connected to DB for initialization');

    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'merchant', 'customer') DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table users created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS merchant_profiles (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                store_name VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                pickup_window VARCHAR(50),
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table merchant_profiles created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table categories created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS surprise_bags (
                id VARCHAR(36) PRIMARY KEY,
                merchant_id VARCHAR(36) NOT NULL,
                category_id VARCHAR(36),
                name VARCHAR(100) NOT NULL,
                description TEXT,
                original_price DECIMAL(10,2) NOT NULL,
                discount_price DECIMAL(10,2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                available_until DATETIME,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (merchant_id) REFERENCES merchant_profiles(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table surprise_bags created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                bag_id VARCHAR(36) NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending_payment', 'paid', 'picked_up', 'cancelled') DEFAULT 'pending_payment',
                pickup_code VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (bag_id) REFERENCES surprise_bags(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table orders created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id VARCHAR(36) PRIMARY KEY,
                order_id VARCHAR(36) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table invoices created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id VARCHAR(36) PRIMARY KEY,
                invoice_id VARCHAR(36) NOT NULL,
                transaction_id VARCHAR(100),
                method VARCHAR(50),
                amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
                paid_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table payments created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS impact_logs (
                id VARCHAR(36) PRIMARY KEY,
                order_id VARCHAR(36) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                co2_saved DECIMAL(8,2),
                money_saved DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table impact_logs created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS reviews (
              id VARCHAR(36) PRIMARY KEY,
              order_id VARCHAR(36) NOT NULL,
              user_id VARCHAR(36) NOT NULL,
              merchant_id VARCHAR(36) NOT NULL,
              rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
              comment TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (merchant_id) REFERENCES merchant_profiles(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table reviews created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS wishlists (
              id VARCHAR(36) PRIMARY KEY,
              user_id VARCHAR(36) NOT NULL,
              bag_id VARCHAR(36) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (bag_id) REFERENCES surprise_bags(id) ON DELETE CASCADE,
              UNIQUE KEY unique_wishlist (user_id, bag_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log('Table wishlists created');

    } catch (err) {
        console.error('Initialization error:', err);
    } finally {
        await connection.end();
        console.log('Initialization complete.');
    }
}

init();
