const fs = require('fs');

const dbFile = 'backend/init_db.js';
let content = fs.readFileSync(dbFile, 'utf8');

const newTables = `      \`CREATE TABLE IF NOT EXISTS gallery_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        status ENUM('draft', 'published') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )\`,
      \`CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES gallery_posts(id) ON DELETE CASCADE
      )\`,`;

// Insert the new tables after the newsletter_subscribers table
const targetStr = `      \`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )\`,`;

content = content.replace(targetStr, targetStr + '\n' + newTables);

fs.writeFileSync(dbFile, content, 'utf8');
console.log('Patched init_db.js');
