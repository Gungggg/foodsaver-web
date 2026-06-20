const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'foodsaver'
    });

    console.log('Connected to DB');

    try {
        // 1. Create New Tables and Alter Existing
        console.log('Creating new tables...');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // Check if category_id exists in surprise_bags
        const [columns] = await connection.query(`SHOW COLUMNS FROM surprise_bags LIKE 'category_id'`);
        if (columns.length === 0) {
            await connection.query(`ALTER TABLE surprise_bags ADD COLUMN category_id VARCHAR(36) NULL`);
            await connection.query(`ALTER TABLE surprise_bags ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL`);
        }

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

        console.log('Cleaning up old data...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE wishlists');
        await connection.query('TRUNCATE TABLE reviews');
        await connection.query('TRUNCATE TABLE impact_logs');
        await connection.query('TRUNCATE TABLE payments');
        await connection.query('TRUNCATE TABLE invoices');
        await connection.query('TRUNCATE TABLE orders');
        await connection.query('TRUNCATE TABLE surprise_bags');
        await connection.query('TRUNCATE TABLE categories');
        await connection.query('TRUNCATE TABLE merchant_profiles');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Seeding Data...');
        const passwordHash = await bcrypt.hash('password123', 10);

        // --- 1. USERS (10 customers, 10 merchants) ---
        const customers = [];
        for (let i = 1; i <= 10; i++) {
            customers.push([uuidv4(), `Customer ${i}`, `customer${i}@mail.com`, passwordHash, 'customer']);
        }
        const merchants = [];
        for (let i = 1; i <= 10; i++) {
            merchants.push([uuidv4(), `Merchant ${i}`, `merchant${i}@mail.com`, passwordHash, 'merchant']);
        }
        const allUsers = [...customers, ...merchants];
        await connection.query(`INSERT INTO users (id, name, email, password_hash, role) VALUES ?`, [allUsers]);

        // --- 2. MERCHANT PROFILES (10 merchants) ---
        const merchantProfiles = [];
        for (let i = 0; i < 10; i++) {
            merchantProfiles.push([uuidv4(), merchants[i][0], `Toko ${i+1}`, `Jalan Raya No ${i+1}`, `18:00 - 20:00`, 1]);
        }
        await connection.query(`INSERT INTO merchant_profiles (id, user_id, store_name, location, pickup_window, is_verified) VALUES ?`, [merchantProfiles]);

        // --- 3. CATEGORIES (10 categories) ---
        const categories = [];
        const catNames = ['Roti & Kue', 'Sayur & Buah', 'Makanan Berat', 'Camilan', 'Minuman', 'Seafood', 'Daging', 'Vegan', 'Cepat Saji', 'Bahan Pokok'];
        for (let i = 0; i < 10; i++) {
            categories.push([uuidv4(), catNames[i], `Deskripsi untuk kategori ${catNames[i]}`]);
        }
        await connection.query(`INSERT INTO categories (id, name, description) VALUES ?`, [categories]);

        // --- 4. SURPRISE BAGS (15 bags) ---
        const bags = [];
        for (let i = 0; i < 15; i++) {
            const mId = merchantProfiles[i % 10][0];
            const cId = categories[i % 10][0];
            bags.push([uuidv4(), mId, cId, `Surprise Bag ${i+1}`, `Isi misterius enak ${i+1}`, 50000, 20000, 10, null, null]);
        }
        await connection.query(`INSERT INTO surprise_bags (id, merchant_id, category_id, name, description, original_price, discount_price, stock, available_until, image_url) VALUES ?`, [bags]);

        // --- 5. ORDERS (15 orders) ---
        const orders = [];
        for (let i = 0; i < 15; i++) {
            const cId = customers[i % 10][0];
            const bId = bags[i][0];
            orders.push([uuidv4(), cId, bId, 1, 20000, 'picked_up', `CODE${i+1}`]);
        }
        await connection.query(`INSERT INTO orders (id, user_id, bag_id, quantity, total_amount, status, pickup_code) VALUES ?`, [orders]);

        // --- 6. INVOICES (15 invoices) ---
        const invoices = [];
        for (let i = 0; i < 15; i++) {
            invoices.push([uuidv4(), orders[i][0], 20000, 'paid']);
        }
        await connection.query(`INSERT INTO invoices (id, order_id, amount, status) VALUES ?`, [invoices]);

        // --- 7. PAYMENTS (15 payments) ---
        const payments = [];
        for (let i = 0; i < 15; i++) {
            payments.push([uuidv4(), invoices[i][0], `TRX-${1000+i}`, 'GOPAY', 20000, 'paid']);
        }
        await connection.query(`INSERT INTO payments (id, invoice_id, transaction_id, method, amount, status) VALUES ?`, [payments]);

        // --- 8. IMPACT LOGS (15 logs) ---
        const impactLogs = [];
        for (let i = 0; i < 15; i++) {
            const oId = orders[i][0];
            const uId = customers[i % 10][0];
            impactLogs.push([uuidv4(), oId, uId, 2.5, 30000]); // 2.5kg CO2 saved, 30k money saved
        }
        await connection.query(`INSERT INTO impact_logs (id, order_id, user_id, co2_saved, money_saved) VALUES ?`, [impactLogs]);

        // --- 9. REVIEWS (15 reviews) ---
        const reviews = [];
        for (let i = 0; i < 15; i++) {
            const oId = orders[i][0];
            const uId = customers[i % 10][0];
            const bId = bags[i][0];
            // find merchant from bag
            const bagData = bags.find(b => b[0] === bId);
            const mId = bagData[1];
            
            reviews.push([uuidv4(), oId, uId, mId, 5, `Makanan sangat memuaskan!`]);
        }
        await connection.query(`INSERT INTO reviews (id, order_id, user_id, merchant_id, rating, comment) VALUES ?`, [reviews]);

        // --- 10. WISHLISTS (15 wishlists) ---
        const wishlists = [];
        for (let i = 0; i < 15; i++) {
            const uId = customers[i % 10][0];
            const bId = bags[(i+1) % 15][0];
            wishlists.push([uuidv4(), uId, bId]);
        }
        await connection.query(`INSERT INTO wishlists (id, user_id, bag_id) VALUES ?`, [wishlists]);

        console.log('Seeding completed successfully! All 10 tables now have at least 10 entries.');

    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await connection.end();
    }
}

seed();
