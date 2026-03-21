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
    await pool.execute("TRUNCATE TABLE leadership_members");
    await pool.execute(`
      INSERT INTO leadership_members (name, designation, type, image_url, linkedin_url, hierarchy_level, seat, status) VALUES
      ('Indika De Zoysa', 'Chairman', 'current', null, 'https://linkedin.com', 1, 1, 'published'),
      ('Channa De Silva', 'Vice Chairman', 'current', null, 'https://linkedin.com', 1, 2, 'published'),
      ('Dr. Prasad', 'President', 'current', null, null, 2, 1, 'published'),
      ('Sanjeewa', 'Treasurer', 'current', null, null, 2, 2, 'published')
    `);
    console.log('Seeded leaders');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
