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
      `CREATE TABLE IF NOT EXISTS member_benefits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL,
        benefit_title VARCHAR(255) NOT NULL,
        category VARCHAR(150) NOT NULL,
        offer_text VARCHAR(150) NOT NULL,
        description TEXT,
        terms LONGTEXT,
        link_url VARCHAR(600),
        logo_url VARCHAR(600) NOT NULL,
        sort_order INT DEFAULT 0,
        status ENUM('draft','published') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS member_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    primary_chapter VARCHAR(150),
    chapters_applied JSON,
    company_name VARCHAR(255),
    membership_category VARCHAR(150),
    ceo_name VARCHAR(255),
    company_address TEXT,
    phone VARCHAR(50),
    fax VARCHAR(50),
    website VARCHAR(255),
    email VARCHAR(150),
    br_number VARCHAR(150),
    year_incorporation VARCHAR(50),
    boi_no VARCHAR(150),
    ownership_local VARCHAR(50),
    ownership_foreign VARCHAR(50),
    business_activities TEXT,
    industry_focus JSON,
    revenue_local VARCHAR(50),
    revenue_foreign VARCHAR(50),
    employees_count VARCHAR(50),
    primary_nominee JSON,
    secondary_nominee JSON,
    business_registration VARCHAR(600),
    audited_accounts VARCHAR(600),
    company_profile VARCHAR(600),
    other_documents VARCHAR(600),
    declaration_applicant_name VARCHAR(255),
    declaration_applicant_designation VARCHAR(255),
    declaration_date DATE,
    agree_checkbox BOOLEAN,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

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
        slug VARCHAR(255) UNIQUE NOT NULL,
        icon_name VARCHAR(150),
        icon_url VARCHAR(600),
        summary TEXT,
        objectives_json JSON,
        description_html LONGTEXT,
        chair_name VARCHAR(255),
        chair_title VARCHAR(255),
        contact_email VARCHAR(150),
        contact_phone VARCHAR(50),
        sort_order INT DEFAULT 0,
        status ENUM('active','inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        banner_image_url VARCHAR(600),
        about_chapter LONGTEXT,
        chair_message LONGTEXT,
        chair_image_url VARCHAR(600),
        has_committee BOOLEAN DEFAULT FALSE
)`,

      `CREATE TABLE IF NOT EXISTS chapter_committee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chapter_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        company VARCHAR(255),
        role_label VARCHAR(150),
        image_url VARCHAR(600),
        linkedin_url VARCHAR(600),
        display_order INT DEFAULT 0,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
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
        year_start INT,
        year_end INT,
        sort_order INT DEFAULT 0,
        status ENUM('draft', 'published') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category ENUM('government', 'industry', 'international', 'premium_corporate', 'corporate', 'supporting', 'government_partners', 'fitis_corporate_partners', 'industry_partners', 'international_bodies', 'premium_corporate_partners', 'corporate_partners') NOT NULL,
        logo_url VARCHAR(600) NOT NULL,
        website_url VARCHAR(600) NULL,
        sort_order INT DEFAULT 0,
        status ENUM('draft', 'published') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
        header_logo_url VARCHAR(500),
        footer_logo_url VARCHAR(500),
        facebook_url VARCHAR(500),
        instagram_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        twitter_url VARCHAR(500),
        youtube_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE IF NOT EXISTS chairman_message (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(150),
        designation VARCHAR(150),
        subtitle VARCHAR(255),
        photo_url VARCHAR(600),
        message_title VARCHAR(255),
        message_body LONGTEXT,
        focus_cards JSON NULL,
        status ENUM('draft', 'published') DEFAULT 'published',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS secretariat_team (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        role VARCHAR(150) NOT NULL,
        photo_url VARCHAR(600) NULL,
        linkedin_url VARCHAR(600) NULL,
        facebook_url VARCHAR(600) NULL,
        sort_order INT DEFAULT 0,
        status ENUM('draft','published') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS privacy_policy_page (
        id INT PRIMARY KEY DEFAULT 1,
        page_title VARCHAR(255) DEFAULT 'PRIVACY POLICY',
        effective_date DATE,
        status ENUM('draft','published') DEFAULT 'published',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS privacy_policy_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT DEFAULT 1,
        section_slug VARCHAR(255) NOT NULL,
        section_title VARCHAR(255) NOT NULL,
        section_html LONGTEXT NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES privacy_policy_page(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS disclaimer_page (
        id INT PRIMARY KEY DEFAULT 1,
        page_title VARCHAR(255) DEFAULT 'DISCLAIMER',
        effective_date DATE,
        status ENUM('draft','published') DEFAULT 'published',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS disclaimer_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT DEFAULT 1,
        section_slug VARCHAR(255) NOT NULL,
        section_title VARCHAR(255) NOT NULL,
        section_html LONGTEXT NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES disclaimer_page(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        banner_image_url VARCHAR(600) NOT NULL,
        read_more_url VARCHAR(600) NULL,
        status ENUM('draft', 'published') DEFAULT 'published',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    ];

    for (const query of tables) {
      await connection.execute(query);
      console.log('Executed query:', query.substring(0, 50) + '...');
    }


    // Update programs table: make read_more_url optional
    try {
      const [cols] = await connection.query("SHOW COLUMNS FROM programs LIKE 'read_more_url'");
      if (cols.length > 0) {
        if (cols[0].Null === 'NO') {
          console.log("Altering 'read_more_url' to be NULLable in 'programs' table...");
          await connection.query("ALTER TABLE programs MODIFY COLUMN read_more_url VARCHAR(600) NULL");
          console.log("Successfully altered 'programs.read_more_url'.");
        }
      }
    } catch (e) {
      console.log('Error modifying programs table:', e.message);
    }

    // Update leadership_members table if it already exists
    try {
      await connection.execute("ALTER TABLE leadership_members ADD COLUMN year_start INT");
      await connection.execute("ALTER TABLE leadership_members ADD COLUMN year_end INT");
      await connection.execute("ALTER TABLE leadership_members ADD COLUMN sort_order INT DEFAULT 0");
      await connection.execute("ALTER TABLE leadership_members ADD COLUMN status ENUM('draft', 'published') DEFAULT 'published'");
      console.log('Executed data migration: Added year_start, year_end, sort_order, status to leadership_members');
    } catch (migErr) {
      if (migErr.code === 'ER_DUP_FIELDNAME') {
        console.log('Migration skipped: columns already exist in leadership_members');
      } else {
        console.error('Migration error (leadership_members columns):', migErr.message);
      }
    }


    // Data Migration: Add new columns to chapters table
    try {
      const colsToAdd = [
        "ADD COLUMN banner_image_url VARCHAR(600)",
        "ADD COLUMN about_chapter LONGTEXT",
        "ADD COLUMN chair_message LONGTEXT",
        "ADD COLUMN chair_image_url VARCHAR(600)",
        "ADD COLUMN has_committee BOOLEAN DEFAULT FALSE"
      ];
      for (const col of colsToAdd) {
        try {
          await connection.execute(`ALTER TABLE chapters ${col}`);
        } catch (migErr) {
          if (migErr.code !== 'ER_DUP_FIELDNAME') {
            console.error(`Migration error adding column ${col}:`, migErr.message);
          }
        }
      }
      console.log('Migration for chapters columns completed.');
    } catch (migErr) {
      console.error('Migration error (chapters columns):', migErr.message);
    }

// Data Migration: Update partners table schema if it's the old one
    try {
      // Check if old column exists
      const [cols] = await connection.execute("SHOW COLUMNS FROM partners LIKE 'company_name'");
      if (cols.length > 0) {
        await connection.execute("DROP TABLE partners");
        await connection.execute(`
          CREATE TABLE partners (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            category ENUM('government', 'industry', 'international', 'premium_corporate', 'corporate', 'supporting', 'government_partners', 'fitis_corporate_partners', 'industry_partners', 'international_bodies', 'premium_corporate_partners', 'corporate_partners') NOT NULL,
            logo_url VARCHAR(600) NOT NULL,
            website_url VARCHAR(600) NULL,
            sort_order INT DEFAULT 0,
            status ENUM('draft', 'published') DEFAULT 'published',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('Executed data migration: Recreated partners table with new schema');
      }
    } catch (migErr) {
      console.error('Migration error (partners table):', migErr.message);
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

    // Data Migration: Add logo columns to site_settings if they don't exist
    try {
        const [headerLogoCols] = await connection.execute("SHOW COLUMNS FROM site_settings LIKE 'header_logo_url'");
        if (headerLogoCols.length === 0) {
            await connection.execute("ALTER TABLE site_settings ADD COLUMN header_logo_url VARCHAR(500)");
        }
        const [footerLogoCols] = await connection.execute("SHOW COLUMNS FROM site_settings LIKE 'footer_logo_url'");
        if (footerLogoCols.length === 0) {
            await connection.execute("ALTER TABLE site_settings ADD COLUMN footer_logo_url VARCHAR(500)");
        }
    } catch (error) {
        console.error("Site Settings Logo Migration failed:", error);
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

    // Data Migration: Migrating chapters
    try {
        await connection.execute(`ALTER TABLE chapters MODIFY status ENUM('active','inactive', 'draft', 'published') DEFAULT 'active'`);
        await connection.execute(`UPDATE chapters SET status = 'active' WHERE status = 'published'`);
        await connection.execute(`UPDATE chapters SET status = 'inactive' WHERE status = 'draft'`);
        await connection.execute(`ALTER TABLE chapters MODIFY status ENUM('active','inactive') DEFAULT 'active'`);
    } catch (error) {
        console.error("Chapter status Migration failed:", error);
    }

    // Seed default chairman message
    const [chairmanRows] = await connection.execute('SELECT * FROM chairman_message WHERE id = 1');
    if (chairmanRows.length === 0) {
      await connection.execute(
        'INSERT INTO chairman_message (id, name, designation, message_title, message_body) VALUES (1, ?, ?, ?, ?)',
        ['Mr Indika De Zoysa', 'Chairman, FITIS', '"FITIS: Pioneering Sri Lanka\'s Digital Transformation and Economic Growth"', 'Federation of Information Technology Industry Sri Lanka (FITIS) play a major role in the ICT Industry Sector...']
      );
      console.log('Seeded default chairman message.');
    } else {
      console.log('Chairman message already exists.');
    }

    // Seed default privacy policy
    const [privacyRows] = await connection.execute('SELECT * FROM privacy_policy_page WHERE id = 1');
    if (privacyRows.length === 0) {
      await connection.execute(
        'INSERT INTO privacy_policy_page (id, page_title, effective_date) VALUES (1, ?, ?)',
        ['PRIVACY POLICY', '2021-03-01']
      );
      console.log('Seeded default privacy policy page.');
    } else {
      console.log('Privacy policy page already exists.');
    }

    // Seed default disclaimer page
    const [disclaimerRows] = await connection.execute('SELECT * FROM disclaimer_page WHERE id = 1');
    if (disclaimerRows.length === 0) {
      await connection.execute(
        'INSERT INTO disclaimer_page (id, page_title, effective_date) VALUES (1, ?, ?)',
        ['DISCLAIMER', '2021-03-01']
      );

      const sections = [{"title": "External Links Disclaimer", "html": "<p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p><p><strong>WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.</strong></p>"}, {"title": "Testimonials Disclaimer", "html": "<p><strong>YOUR INDIVIDUAL RESULTS MAY VARY.</strong></p><p>The testimonials on the Site are submitted in various forms such as text, audio and/or video, and are reviewed by us before being posted. They appear on the Site verbatim as given by the users, except for the correction of grammar or typing errors. Some testimonials may have been shortened for the sake of brevity, where the full testimonial contained extraneous information not relevant to the general public.</p><p>The views and opinions contained in the testimonials belong solely to the individual user and do not reflect our views and opinions.</p>"}, {"title": "Errors and Omissions Disclaimer", "html": "<p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, FITIS Guarantee Limited is not responsible for any errors or omissions or for the results obtained from the use of this information. All information in this site is provided \u201cas is\u201d, with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.</p><p>In no event will FITIS Guarantee Limited, its related partnerships or corporations, or the partners, agents or employees thereof be liable to you or anyone else for any decision made or action taken in reliance on the information in this Site or for any consequential, special or similar damages, even if advised of the possibility of such damages.</p>"}, {"title": "Logos and Trademarks Disclaimer", "html": "<p>All logos and trademarks of third parties referenced on www.fitis.lk are the trademarks and logos of their respective owners. Any inclusion of such trademarks or logos does not imply or constitute any approval, endorsement or sponsorship of FITIS Guarantee Limited by such owners.</p>"}, {"title": "Website Disclaimer", "html": "<p>The information provided by FITIS Guarantee Limited (\u201cCompany\u201d, \u201cwe\u201d, \u201cour\u201d, \u201cus\u201d) on www.fitis.lk (the \u201cSite\u201d) is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p><p><strong>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.</strong></p>"}, {"title": "Affiliates Disclaimer", "html": "<p>The Site may contain links to affiliate websites, and we may receive an affiliate commission for any purchases or actions made by you on the affiliate websites using such links.</p>"}, {"title": "Contact Us", "html": "<p>Should you have any feedback, comments, requests for technical support or other inquiries, please contact us by email: info@fitis.lk.</p>"}];

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const slug = sec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await connection.execute(
          'INSERT INTO disclaimer_sections (page_id, section_slug, section_title, section_html, sort_order) VALUES (1, ?, ?, ?, ?)',
          [slug, sec.title, sec.html, i]
        );
      }

      console.log('Seeded default disclaimer page and sections.');
    } else {
      console.log('Disclaimer page already exists.');
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
