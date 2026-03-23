const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function patch() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'fitis_db'
  });

  try {
    await pool.execute("ALTER TABLE partners MODIFY COLUMN category ENUM('government', 'industry', 'international', 'premium_corporate', 'corporate', 'supporting', 'government_partners', 'fitis_corporate_partners', 'industry_partners', 'international_bodies', 'premium_corporate_partners', 'corporate_partners') NOT NULL");

    // Migrate old data
    await pool.execute("UPDATE partners SET category = 'government_partners' WHERE category = 'government'");
    await pool.execute("UPDATE partners SET category = 'fitis_corporate_partners' WHERE category = 'corporate'");
    await pool.execute("UPDATE partners SET category = 'industry_partners' WHERE category = 'industry'");
    await pool.execute("UPDATE partners SET category = 'international_bodies' WHERE category = 'international'");
    await pool.execute("UPDATE partners SET category = 'premium_corporate_partners' WHERE category = 'premium_corporate'");
    await pool.execute("UPDATE partners SET category = 'corporate_partners' WHERE category = 'supporting'"); // Map 'supporting' just in case, or leave it.

    // Restrict ENUM
    await pool.execute("ALTER TABLE partners MODIFY COLUMN category ENUM('government_partners', 'fitis_corporate_partners', 'industry_partners', 'international_bodies', 'premium_corporate_partners', 'corporate_partners') NOT NULL");

    console.log('Patched partners enum');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
patch();
