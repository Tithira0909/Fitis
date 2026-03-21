const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'fitis_db'
  });

  try {
    await pool.execute("TRUNCATE TABLE partners");
    await pool.execute(`
      INSERT INTO partners (name, category, logo_url, website_url, sort_order, status) VALUES
      ('Gov Partner 1', 'government', '', 'https://gov.lk', 1, 'published'),
      ('Gov Partner 2', 'government', '', 'https://gov.lk', 2, 'published'),
      ('FITIS Corp 1', 'corporate', '', 'https://corp.lk', 1, 'published'),
      ('FITIS Corp 2', 'corporate', '', 'https://corp.lk', 2, 'published'),
      ('FITIS Corp 3', 'corporate', '', 'https://corp.lk', 3, 'published'),
      ('Industry 1', 'industry', '', 'https://ind.lk', 1, 'published'),
      ('Intl 1', 'international', '', 'https://intl.lk', 1, 'published'),
      ('Intl 2', 'international', '', 'https://intl.lk', 2, 'published'),
      ('Premium 1', 'premium_corporate', '', 'https://prem.lk', 1, 'published')
    `);
    console.log('Seeded partners');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
