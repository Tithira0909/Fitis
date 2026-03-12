import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const initializeDB = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'fitis_user',
      password: process.env.DB_PASSWORD || 'fitis_password',
      database: process.env.DB_NAME || 'fitis',
    });

    console.log('Connected to MySQL database.');

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS chapters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        head VARCHAR(255) NOT NULL,
        member_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS board_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        tier ENUM('Platinum', 'Gold', 'Silver', 'Bronze') NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of tables) {
      await connection.execute(query);
      console.log('Executed query:', query.substring(0, 50) + '...');
    }

    // Seed admin user
    const [rows] = await connection.execute('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      // Note: In a real app, hash the password using bcrypt
      await connection.execute(
        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
        ['admin', 'admin']
      );
      console.log('Seeded admin user.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

initializeDB();
