const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Helper function to generate growing traffic dates over the last 365 days
// This uses a power function so more dates are closer to today.
function getRandomDate() {
    const now = new Date();
    // Math.random()^3 biases the distribution towards 0.
    // 1 - Math.random()^3 biases it towards 1 (which means closer to today).
    // Let's bias towards 0 offset, meaning closer to today.
    const daysAgo = Math.pow(Math.random(), 2.5) * 365; 
    const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    return date;
}

function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'foodsaver'
    });

    console.log('Connected to DB');

    try {
        console.log('Creating new tables (if not exists)...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

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

        // Check if users has created_at
        const [userCols] = await connection.query(`SHOW COLUMNS FROM users LIKE 'created_at'`);
        if (userCols.length === 0) {
            await connection.query(`ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        }

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

        console.log('Seeding 200 Data with realistic growth curve...');
        const passwordHash = await bcrypt.hash('password123', 10);

        // --- ADMIN ---
        const idAdmin = uuidv4();
        await connection.query(
            `INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`, 
            [idAdmin, 'Admin', 'admin@mail.com', passwordHash, 'admin', formatDate(new Date(Date.now() - 365*24*60*60*1000))]
        );

        // --- 1. USERS (200 customers, 200 merchants) ---
        const customers = [];
        for (let i = 1; i <= 200; i++) {
            customers.push([uuidv4(), faker.person.fullName(), faker.internet.email(), passwordHash, 'customer', formatDate(getRandomDate())]);
        }
        const merchants = [];
        for (let i = 1; i <= 200; i++) {
            merchants.push([uuidv4(), faker.person.fullName(), faker.internet.email(), passwordHash, 'merchant', formatDate(getRandomDate())]);
        }
        
        const allUsers = [...customers, ...merchants];
        for (let i = 0; i < allUsers.length; i += 50) {
            await connection.query(`INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES ?`, [allUsers.slice(i, i + 50)]);
        }

        // --- 2. MERCHANT PROFILES (200 merchants) ---
        const merchantProfiles = [];
        for (let i = 0; i < 200; i++) {
            const createdAt = merchants[i][5]; // Use the same created_at as user
            merchantProfiles.push([
                uuidv4(), 
                merchants[i][0], 
                faker.company.name(), 
                faker.location.streetAddress(), 
                '18:00 - 20:00', 
                faker.datatype.boolean() ? 1 : 0,
                createdAt
            ]);
        }
        for (let i = 0; i < merchantProfiles.length; i += 50) {
            await connection.query(`INSERT INTO merchant_profiles (id, user_id, store_name, location, pickup_window, is_verified, created_at) VALUES ?`, [merchantProfiles.slice(i, i + 50)]);
        }

        // --- 3. CATEGORIES (10 categories) ---
        const categories = [];
        const catNames = ['Roti & Kue', 'Sayur & Buah', 'Makanan Berat', 'Camilan', 'Minuman', 'Seafood', 'Daging', 'Vegan', 'Cepat Saji', 'Bahan Pokok'];
        for (let i = 0; i < 10; i++) {
            categories.push([uuidv4(), catNames[i], faker.lorem.sentence(), formatDate(new Date(Date.now() - 365*24*60*60*1000))]);
        }
        await connection.query(`INSERT INTO categories (id, name, description, created_at) VALUES ?`, [categories]);

        // --- 4. SURPRISE BAGS (200 bags) ---
        const bags = [];
        const foodImages = [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop', // food generic
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', // bread
            'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop', // burger
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop', // salad
            'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=600&auto=format&fit=crop', // dessert
            'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop', // salmon
            'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=600&auto=format&fit=crop', // sandwich
            'https://images.unsplash.com/photo-1484723091791-0fee59ca0b28?q=80&w=600&auto=format&fit=crop', // breakfast
            'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=600&auto=format&fit=crop', // pasta
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop' // bbq
        ];
        
        const rescueNames = [
            "Surprise Bag Sayur Segar", "Surprise Bag Roti Sisa Etalase", "Paket Hemat Nasi Kotak",
            "Sisa Produksi Kue Manis", "Paket Lauk Pauk Sisa Penjualan", "Surprise Bag Buah Sisa",
            "Paket Katering Hari Ini", "Surprise Bag Minuman Dingin", "Paket Pastry & Croissant",
            "Makan Malam Porsi Jumbo"
        ];
        
        const rescueDescs = [
            "Makanan surplus dari restoran kami hari ini. Masih sangat segar, bersih, dan layak konsumsi. Mari selamatkan dari pembuangan!",
            "Roti dan kue sisa display hari ini. Masih enak dinikmati dengan teh hangat.",
            "Berisi beberapa porsi lauk pauk segar yang tidak habis terjual di jam operasional. Cocok untuk porsi keluarga.",
            "Bahan makanan dan sayur yang bentuknya kurang sempurna untuk dijual dengan harga normal, namun nutrisinya tetap utuh.",
            "Sisa stok hari ini yang belum sempat terjual, 100% masih aman dikonsumsi. Bantu kurangi food waste dengan membeli paket ini!"
        ];

        for (let i = 0; i < 200; i++) {
            // Some merchants have more bags than others (power law)
            const mIndex = Math.floor(Math.pow(Math.random(), 2) * 200);
            const mId = merchantProfiles[mIndex][0];
            const mCreatedAt = new Date(merchantProfiles[mIndex][6]);
            
            let bagCreatedAt = getRandomDate();
            if (bagCreatedAt < mCreatedAt) bagCreatedAt = mCreatedAt; // Bag created after merchant

            const cId = categories[faker.number.int({ min: 0, max: 9 })][0];
            const originalPrice = faker.number.int({ min: 10, max: 150 }) * 1000;
            const discountPrice = Math.floor(originalPrice * faker.number.float({ min: 0.3, max: 0.7 }));
            
            bags.push([
                uuidv4(), mId, cId, 
                rescueNames[faker.number.int({ min: 0, max: rescueNames.length - 1 })], 
                rescueDescs[faker.number.int({ min: 0, max: rescueDescs.length - 1 })], 
                originalPrice, discountPrice, 
                faker.number.int({ min: 0, max: 20 }), 
                null, 
                foodImages[faker.number.int({ min: 0, max: foodImages.length - 1 })],
                formatDate(bagCreatedAt)
            ]);
        }
        for (let i = 0; i < bags.length; i += 50) {
            await connection.query(`INSERT INTO surprise_bags (id, merchant_id, category_id, name, description, original_price, discount_price, stock, available_until, image_url, created_at) VALUES ?`, [bags.slice(i, i + 50)]);
        }

        // --- 5. ORDERS (1000 orders to show good business data) ---
        // Let's make a lot of orders to show good variation and traffic
        const orders = [];
        for (let i = 0; i < 1000; i++) {
            // Power law for customers (some buy a lot, some rare)
            const cIndex = Math.floor(Math.pow(Math.random(), 1.5) * 200);
            const cId = customers[cIndex][0];
            const cCreatedAt = new Date(customers[cIndex][5]);

            // Power law for bags (some are popular)
            const bIndex = Math.floor(Math.pow(Math.random(), 2) * 200);
            const bag = bags[bIndex];
            const bId = bag[0];
            const bCreatedAt = new Date(bag[10]);

            let orderCreatedAt = getRandomDate();
            // Order must be after customer and bag creation
            const minDate = new Date(Math.max(cCreatedAt.getTime(), bCreatedAt.getTime()));
            if (orderCreatedAt < minDate) {
                // If invalid, just put it halfway between minDate and now
                orderCreatedAt = new Date(minDate.getTime() + Math.random() * (Date.now() - minDate.getTime()));
            }

            const totalAmount = bag[6]; // discountPrice
            // Skew status towards successful orders
            const rand = Math.random();
            let status = 'picked_up';
            if (rand > 0.9) status = 'cancelled';
            else if (rand > 0.8) status = 'pending_payment';
            else if (rand > 0.7) status = 'paid';

            orders.push([
                uuidv4(), cId, bId, 1, totalAmount, status, 
                `CODE${faker.string.numeric(5)}`, 
                formatDate(orderCreatedAt)
            ]);
        }
        // Sort orders by created_at ascending
        orders.sort((a, b) => new Date(a[7]) - new Date(b[7]));

        for (let i = 0; i < orders.length; i += 50) {
            await connection.query(`INSERT INTO orders (id, user_id, bag_id, quantity, total_amount, status, pickup_code, created_at) VALUES ?`, [orders.slice(i, i + 50)]);
        }

        // --- 6. INVOICES (1000 invoices) ---
        const invoices = [];
        for (let i = 0; i < orders.length; i++) {
            let invStatus = 'paid';
            if (orders[i][5] === 'pending_payment' || orders[i][5] === 'cancelled') {
                invStatus = 'pending';
            }
            invoices.push([uuidv4(), orders[i][0], orders[i][4], invStatus, orders[i][7]]);
        }
        for (let i = 0; i < invoices.length; i += 50) {
            await connection.query(`INSERT INTO invoices (id, order_id, amount, status, created_at) VALUES ?`, [invoices.slice(i, i + 50)]);
        }

        // --- 7. PAYMENTS (for paid invoices) ---
        const payments = [];
        for (let i = 0; i < invoices.length; i++) {
            if (invoices[i][3] === 'paid') {
                payments.push([
                    uuidv4(), invoices[i][0], 
                    `TRX-${faker.string.alphanumeric(8).toUpperCase()}`, 
                    'GOPAY', invoices[i][2], 'paid', 
                    invoices[i][4], // paid_at (same as created_at for simplicity)
                    invoices[i][4]  // created_at
                ]);
            }
        }
        for (let i = 0; i < payments.length; i += 50) {
            await connection.query(`INSERT INTO payments (id, invoice_id, transaction_id, method, amount, status, paid_at, created_at) VALUES ?`, [payments.slice(i, i + 50)]);
        }

        // --- 8. IMPACT LOGS (only for picked_up orders) ---
        const impactLogs = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i][5] === 'picked_up') {
                const oId = orders[i][0];
                const uId = orders[i][1];
                impactLogs.push([
                    uuidv4(), oId, uId, 
                    faker.number.float({ min: 1, max: 5, fractionDigits: 1 }), 
                    orders[i][4] * 1.5, // money saved
                    orders[i][7] // created_at
                ]);
            }
        }
        for (let i = 0; i < impactLogs.length; i += 50) {
            await connection.query(`INSERT INTO impact_logs (id, order_id, user_id, co2_saved, money_saved, created_at) VALUES ?`, [impactLogs.slice(i, i + 50)]);
        }

        // --- 9. REVIEWS (for a fraction of picked_up orders) ---
        const reviews = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i][5] === 'picked_up' && Math.random() > 0.4) { // 60% leave review
                const oId = orders[i][0];
                const uId = orders[i][1];
                const bId = orders[i][2];
                const bagData = bags.find(b => b[0] === bId);
                const mId = bagData[1];
                
                // Bias towards positive reviews
                const rating = faker.helpers.weightedArrayElement([
                    { weight: 1, value: 1 },
                    { weight: 1, value: 2 },
                    { weight: 3, value: 3 },
                    { weight: 10, value: 4 },
                    { weight: 20, value: 5 }
                ]);
                
                reviews.push([
                    uuidv4(), oId, uId, mId, 
                    rating, 
                    faker.lorem.sentence(),
                    orders[i][7] // created_at
                ]);
            }
        }
        for (let i = 0; i < reviews.length; i += 50) {
            await connection.query(`INSERT INTO reviews (id, order_id, user_id, merchant_id, rating, comment, created_at) VALUES ?`, [reviews.slice(i, i + 50)]);
        }

        // --- 10. WISHLISTS ---
        const wishlists = [];
        for (let i = 0; i < 200; i++) {
            const uId = customers[faker.number.int({ min: 0, max: 199 })][0];
            const bag = bags[faker.number.int({ min: 0, max: 199 })];
            const bId = bag[0];
            
            const exists = wishlists.find(w => w[1] === uId && w[2] === bId);
            if (!exists) {
                let wDate = getRandomDate();
                const minDate = new Date(bag[10]); // after bag creation
                if(wDate < minDate) wDate = minDate;
                
                wishlists.push([uuidv4(), uId, bId, formatDate(wDate)]);
            }
        }
        if (wishlists.length > 0) {
            for (let i = 0; i < wishlists.length; i += 50) {
                await connection.query(`INSERT INTO wishlists (id, user_id, bag_id, created_at) VALUES ?`, [wishlists.slice(i, i + 50)]);
            }
        }

        console.log('Seeding 200+ complex realistic data with faker.js completed successfully!');

    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await connection.end();
    }
}

seed();
