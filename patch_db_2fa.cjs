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
    const [cols] = await connection.execute("SHOW COLUMNS FROM admin_users LIKE 'two_factor_secret'");
    if (cols.length === 0) {
      await connection.execute("ALTER TABLE admin_users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL");
      console.log('Added two_factor_secret to admin_users');
    } else {
      console.log('two_factor_secret already exists in admin_users');
    }
    console.log('Database patched successfully.');
  } catch (err) {
    console.error('Error patching DB:', err);
  } finally {
    await connection.end();
  }
}

patch();
