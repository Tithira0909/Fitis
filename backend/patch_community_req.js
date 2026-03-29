import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function patchDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitis',
  });

  try {
    // Add columns if they don't exist
    await connection.query('ALTER TABLE member_community_requests ADD COLUMN primary_chapter VARCHAR(255) NULL AFTER company_name;');
    console.log('Added primary_chapter column.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log('primary_chapter already exists.');
    else console.error(err.message);
  }

  try {
    await connection.query('ALTER TABLE member_community_requests ADD COLUMN secondary_chapter VARCHAR(255) NULL AFTER primary_chapter;');
    console.log('Added secondary_chapter column.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log('secondary_chapter already exists.');
    else console.error(err.message);
  }

  try {
    await connection.query('ALTER TABLE member_community_requests ADD COLUMN fitis_membership_id VARCHAR(255) NULL AFTER secondary_chapter;');
    console.log('Added fitis_membership_id column.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log('fitis_membership_id already exists.');
    else console.error(err.message);
  }

  await connection.end();
}

patchDb();
