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
      ('Gov Partner 1', 'government_partners', '', 'https://gov.lk', 1, 'published'),
      ('Gov Partner 2', 'government_partners', '', 'https://gov.lk', 2, 'published'),
      ('FITIS Corp 1', 'fitis_corporate_partners', '', 'https://corp.lk', 1, 'published'),
      ('FITIS Corp 2', 'fitis_corporate_partners', '', 'https://corp.lk', 2, 'published'),
      ('FITIS Corp 3', 'fitis_corporate_partners', '', 'https://corp.lk', 3, 'published'),
      ('Industry 1', 'industry_partners', '', 'https://ind.lk', 1, 'published'),
      ('Intl 1', 'international_bodies', '', 'https://intl.lk', 1, 'published'),
      ('Intl 2', 'international_bodies', '', 'https://intl.lk', 2, 'published'),
      ('Premium 1', 'premium_corporate_partners', '', 'https://prem.lk', 1, 'published'),
      ('Corporate 1', 'corporate_partners', '', 'https://prem.lk', 1, 'published')
    `);
    console.log('Seeded partners new');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
