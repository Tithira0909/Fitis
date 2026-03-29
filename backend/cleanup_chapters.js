import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const allowedChapters = [
  { slug: 'ict-infrastructure', name: 'ICT Infrastructure Chapter', icon_name: 'Globe', sort_order: 1 },
  { slug: 'software', name: 'Software Chapter', icon_name: 'Monitor', sort_order: 2 },
  { slug: 'digital-services', name: 'Digital Services Chapter', icon_name: 'Settings', sort_order: 3 },
  { slug: 'education-training', name: 'Education & Training Chapter', icon_name: 'GraduationCap', sort_order: 4 },
  { slug: 'communication', name: 'Communication Chapter', icon_name: 'Phone', sort_order: 5 },
  { slug: 'digital-trust', name: 'Digital Trust Chapter', icon_name: 'Archive', sort_order: 6 },
];

async function cleanupChapters() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitis',
  });

  try {
    const allowedSlugs = allowedChapters.map(c => c.slug);

    // Get all chapters
    const [existing] = await connection.execute('SELECT id, slug FROM chapters');

    for (const chapter of existing) {
      if (!allowedSlugs.includes(chapter.slug)) {
        await connection.execute('DELETE FROM chapters WHERE id = ?', [chapter.id]);
        console.log(`Deleted legacy chapter: ${chapter.slug}`);
      }
    }

    // Insert or update allowed chapters
    for (const chapter of allowedChapters) {
      const [existingChapter] = await connection.execute('SELECT id FROM chapters WHERE slug = ?', [chapter.slug]);
      if (existingChapter.length > 0) {
        await connection.execute(
          'UPDATE chapters SET name = ?, icon_name = ?, sort_order = ? WHERE slug = ?',
          [chapter.name, chapter.icon_name, chapter.sort_order, chapter.slug]
        );
        console.log(`Updated chapter: ${chapter.slug}`);
      } else {
        await connection.execute(
          'INSERT INTO chapters (name, slug, icon_name, sort_order, status) VALUES (?, ?, ?, ?, ?)',
          [chapter.name, chapter.slug, chapter.icon_name, chapter.sort_order, 'active']
        );
        console.log(`Inserted chapter: ${chapter.slug}`);
      }
    }

    console.log('Successfully cleaned up chapters.');
  } catch (error) {
    console.error('Error cleaning up chapters:', error);
  } finally {
    await connection.end();
  }
}

cleanupChapters();
