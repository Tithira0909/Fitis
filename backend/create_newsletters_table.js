import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function setupNewslettersTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitis',
  });

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS newsletters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        pdf_url VARCHAR(500) NOT NULL,
        cover_image_url VARCHAR(500) NULL,
        published_date DATE,
        status ENUM('draft', 'published') DEFAULT 'draft',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createTableQuery);
    console.log('Successfully created newsletters table.');

  } catch (error) {
    console.error('Error creating newsletters table:', error);
  } finally {
    await connection.end();
  }
}

setupNewslettersTable();
