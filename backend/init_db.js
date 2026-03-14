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
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        banner_image_url VARCHAR(500),
        pdf_url VARCHAR(500),
        category ENUM('Announcement', 'Event', 'Industry') DEFAULT 'Announcement',
        status ENUM('draft', 'published') DEFAULT 'draft',
        publish_date DATE,
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        flyer_image_url VARCHAR(500),
        venue VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        timezone VARCHAR(50) DEFAULT 'GMT+5:30',
        rsvp_open BOOLEAN DEFAULT TRUE,
        short_description TEXT,
        details_url VARCHAR(500),
        facebook_url VARCHAR(500),
        twitter_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        status ENUM('draft', 'published') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS chapters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        head VARCHAR(255) NOT NULL,
        member_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS leadership_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        type ENUM('current', 'past') DEFAULT 'current',
        image_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        hierarchy_level INT DEFAULT 1,
        seat INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
      )`,
      `CREATE TABLE IF NOT EXISTS gallery_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        status ENUM('draft', 'published') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES gallery_posts(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        site_email VARCHAR(255),
        site_phone VARCHAR(255),
        site_location VARCHAR(255),
        hero_type ENUM('image', 'video') DEFAULT 'image',
        hero_url VARCHAR(500),
        favicon_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        banner_image_url VARCHAR(600) NOT NULL,
        read_more_url VARCHAR(600) NOT NULL,
        status ENUM('draft', 'published') DEFAULT 'published',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS chairman_message (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(255),
        designation VARCHAR(255),
        company VARCHAR(255),
        photo_url VARCHAR(500),
        message_title VARCHAR(255),
        message_body TEXT,
        status ENUM('draft', 'published') DEFAULT 'published',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS code_of_conduct_page (
        id INT PRIMARY KEY DEFAULT 1,
        page_title VARCHAR(255) DEFAULT 'CODE OF ETHICS AND PROFESSIONAL CONDUCT',
        last_updated DATE,
        status ENUM('Draft', 'Published') DEFAULT 'Draft',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS code_of_conduct_sections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        page_id INT,
        section_slug VARCHAR(255),
        section_title VARCHAR(255),
        section_html TEXT,
        sort_order INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES code_of_conduct_page(id) ON DELETE CASCADE
      )`
    ];

    for (const query of tables) {
      await connection.execute(query);
      console.log('Executed query:', query.substring(0, 50) + '...');
    }

    // Data Migration: Fix missing leading slashes in image URLs for programs
    try {
      await connection.execute(`
        UPDATE programs
        SET banner_image_url = CONCAT('/', banner_image_url)
        WHERE banner_image_url IS NOT NULL AND banner_image_url NOT LIKE '/%' AND banner_image_url NOT LIKE 'http%'
      `);
      console.log('Executed data migration: Fixed missing leading slashes in programs.banner_image_url');
    } catch (migErr) {
      console.error('Migration error (programs.banner_image_url):', migErr.message);
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

    // Seed default site settings
    const [settingsRows] = await connection.execute('SELECT * FROM site_settings WHERE id = 1');
    if (settingsRows.length === 0) {
      await connection.execute(
        'INSERT INTO site_settings (id, site_email, site_phone, site_location) VALUES (1, ?, ?, ?)',
        ['info@fitis.lk', '+94 11 2 000 000', 'Colombo, Sri Lanka']
      );
      console.log('Seeded default site settings.');
    } else {
      console.log('Site settings already exist.');
    }

    // Seed default chairman message
    const [chairmanRows] = await connection.execute('SELECT * FROM chairman_message WHERE id = 1');
    if (chairmanRows.length === 0) {
        await connection.execute(`
          INSERT INTO chairman_message (id, name, designation, message_title, message_body)
          VALUES (1, 'John Doe', 'Chairman', 'Welcome to FITIS', 'Our mission is to lead.')
        `);
        console.log('Seeded default chairman message.');
    } else {
        console.log('Chairman message already exists.');
    }

    // Seed default code of conduct page
    const [cocRows] = await connection.execute('SELECT COUNT(*) as count FROM code_of_conduct_page');
    if (cocRows[0].count === 0) {
      await connection.execute(`
        INSERT INTO code_of_conduct_page (id, page_title, last_updated, status)
        VALUES (1, 'CODE OF ETHICS AND PROFESSIONAL CONDUCT', CURRENT_DATE, 'Published')
      `);
      console.log('Seeded default code of conduct page.');
    } else {
      console.log('Code of conduct page already exists.');
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
