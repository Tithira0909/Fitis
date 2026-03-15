import re

with open('backend/init_db.js', 'r') as f:
    content = f.read()

new_table = """      `CREATE TABLE IF NOT EXISTS chairman_message (
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
      )`"""

content = content.replace("`CREATE TABLE IF NOT EXISTS programs", new_table + ",\n      `CREATE TABLE IF NOT EXISTS programs")

seed_query = """    // Seed default chairman message
    const [chairmanRows] = await connection.execute('SELECT * FROM chairman_message WHERE id = 1');
    if (chairmanRows.length === 0) {
      await connection.execute(
        'INSERT INTO chairman_message (id, name, designation, message_title, message_body) VALUES (1, ?, ?, ?, ?)',
        ['Mr Indika De Zoysa', 'Chairman, FITIS', '"FITIS: Pioneering Sri Lanka\\'s Digital Transformation and Economic Growth"', 'Federation of Information Technology Industry Sri Lanka (FITIS) play a major role in the ICT Industry Sector...']
      );
      console.log('Seeded default chairman message.');
    } else {
      console.log('Chairman message already exists.');
    }"""

content = content.replace("console.log('Database initialization complete.');", seed_query + "\n\n    console.log('Database initialization complete.');")

with open('backend/init_db.js', 'w') as f:
    f.write(content)
