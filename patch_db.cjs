const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function patch() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'fitis_db'
  });

  try {
    // Check and add header_logo_url
    const [headerCols] = await connection.execute("SHOW COLUMNS FROM site_settings LIKE 'header_logo_url'");
    if (headerCols.length === 0) {
      await connection.execute("ALTER TABLE site_settings ADD COLUMN header_logo_url VARCHAR(500)");
      console.log('Added header_logo_url');
    }

    // Check and add footer_logo_url
    const [footerCols] = await connection.execute("SHOW COLUMNS FROM site_settings LIKE 'footer_logo_url'");
    if (footerCols.length === 0) {
      await connection.execute("ALTER TABLE site_settings ADD COLUMN footer_logo_url VARCHAR(500)");
      console.log('Added footer_logo_url');
    }

    console.log('Database patched successfully.');
  } catch (err) {
    console.error('Error patching DB:', err);
  } finally {
    await connection.end();
  }
}

patch();
