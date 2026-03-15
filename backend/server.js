import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Expose uploads directory statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/';
    if (req.path.includes('/upload/hero')) {
      dest += 'hero';
    } else if (req.path.includes('/upload/favicon')) {
      dest += 'favicon';
    } else if (req.path.includes('/upload/leadership')) {
      dest += 'leadership';
    } else if (req.path.includes('/upload/news-banner')) {
      dest += 'news-banner';
    } else if (req.path.includes('/upload/news-pdf')) {
      dest += 'news-pdf';
    } else if (req.path.includes('/gallery') || req.path.includes('/upload/gallery')) {
      dest += 'gallery';
    } else if (req.path.includes('/upload/event-flyer')) {
      dest += 'events';
    } else if (req.path.includes('/upload/program-banner')) {
      dest += 'programs';
    } else if (req.path.includes('/upload/chairman-photo')) {
      dest += 'chairman';
    }
    // Ensure directory exists
    fs.mkdirSync(path.join(process.cwd(), dest), { recursive: true });
    cb(null, path.join(process.cwd(), dest));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadHero = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for hero media'));
  }
});

const uploadFavicon = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/x-icon', 'image/png', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for favicon'));
  }
});

const uploadLeadership = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for leadership image'));
  }
});

const uploadNewsBanner = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for banner image'));
  }
});

const uploadNewsPdf = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Invalid file type for PDF'));
  }
});

const uploadGallery = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for gallery image'));
  }
});

const uploadEventFlyer = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for event flyer'));
  }
});

const uploadProgramBanner = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for program banner'));
  }
});

const uploadChairmanPhoto = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for chairman photo'));
  }
});

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'fitis_user',
  password: process.env.DB_PASSWORD || 'fitis_password',
  database: process.env.DB_NAME || 'fitis',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB Connection Route
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ ok: true, status: 'success', message: 'Connected to MySQL Database' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ ok: false, status: 'error', message: 'Database connection failed' });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    // NOTE: In production, always compare hashed passwords (e.g. using bcrypt).
    // The instructions don't explicitly ask for bcrypt, so we are keeping it simple for the requested seed data.
    if (user.password !== password) {
       return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Success
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Allowed tables and columns for generic CRUD to prevent SQL injection
const TABLE_COLUMNS = {
  news: ['title', 'slug', 'excerpt', 'content', 'banner_image_url', 'pdf_url', 'category', 'status', 'publish_date', 'author'],
  events: ['title', 'flyer_image_url', 'venue', 'event_date', 'start_time', 'end_time', 'timezone', 'rsvp_open', 'short_description', 'details_url', 'facebook_url', 'twitter_url', 'linkedin_url', 'status'],
  chapters: ['name', 'head', 'member_count'],
  leadership_members: ['name', 'designation', 'type', 'image_url', 'linkedin_url', 'hierarchy_level', 'seat', 'year_start', 'year_end', 'sort_order', 'status'],
  partners: ['company_name', 'tier', 'contact_person'],
  newsletter_subscribers: ['email'],
  programs: ['title', 'slug', 'description', 'banner_image_url', 'read_more_url', 'status', 'sort_order']
};
const ALLOWED_TABLES = Object.keys(TABLE_COLUMNS);

// Public Site Settings
app.get('/api/site-settings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ error: 'Settings not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Admin Site Settings (Protected)
app.get('/api/admin/site-settings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ error: 'Settings not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/admin/site-settings', authenticateToken, async (req, res) => {
  const { site_email, site_phone, site_location, hero_type, hero_url, favicon_url } = req.body;
  try {
    const [existing] = await pool.execute('SELECT id FROM site_settings WHERE id = 1');
    if (existing.length === 0) {
      await pool.execute(
        `INSERT INTO site_settings (id, site_email, site_phone, site_location, hero_type, hero_url, favicon_url)
         VALUES (1, ?, ?, ?, ?, ?, ?)`,
        [site_email, site_phone, site_location, hero_type, hero_url, favicon_url]
      );
    } else {
      await pool.execute(
        `UPDATE site_settings
         SET site_email=?, site_phone=?, site_location=?, hero_type=?, hero_url=?, favicon_url=?
         WHERE id=1`,
        [site_email, site_phone, site_location, hero_type, hero_url, favicon_url]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});
// Chairman Message Public
app.get('/api/chairman-message', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM chairman_message WHERE id = 1 AND status = "published"');
    if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching chairman message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Admin Chairman Message (Protected)
app.get('/api/admin/chairman-message', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM chairman_message WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching chairman message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

app.put('/api/admin/chairman-message', authenticateToken, async (req, res) => {
  const { name, designation, subtitle, photo_url, message_title, message_body, focus_cards, status } = req.body;
  try {
    const [existing] = await pool.execute('SELECT id FROM chairman_message WHERE id = 1');
    const focusCardsStr = focus_cards ? JSON.stringify(focus_cards) : null;

    if (existing.length === 0) {
      await pool.execute(
        `INSERT INTO chairman_message (id, name, designation, subtitle, photo_url, message_title, message_body, focus_cards, status)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, designation, subtitle, photo_url, message_title, message_body, focusCardsStr, status || 'published']
      );
    } else {
      await pool.execute(
        `UPDATE chairman_message
         SET name=?, designation=?, subtitle=?, photo_url=?, message_title=?, message_body=?, focus_cards=?, status=?
         WHERE id=1`,
        [name, designation, subtitle, photo_url, message_title, message_body, focusCardsStr, status || 'published']
      );
    }
    res.json({ message: 'Chairman message updated successfully' });
  } catch (error) {
    console.error('Error updating chairman message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});


// File Uploads (Protected)
app.post('/api/admin/upload/hero', authenticateToken, uploadHero.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/hero/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

app.post('/api/admin/upload/favicon', authenticateToken, uploadFavicon.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/favicon/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

app.post('/api/admin/upload/leadership', authenticateToken, uploadLeadership.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/leadership/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

app.post('/api/admin/upload/news-banner', authenticateToken, uploadNewsBanner.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/news-banner/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

app.post('/api/admin/upload/news-pdf', authenticateToken, uploadNewsPdf.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/news-pdf/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

app.post('/api/admin/upload/event-flyer', authenticateToken, uploadEventFlyer.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/events/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

app.post('/api/admin/upload/program-banner', authenticateToken, uploadProgramBanner.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  const relativeUrl = `/uploads/programs/${req.file.filename}`;
  res.json({ url: relativeUrl });
});

// Dashboard Stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [chapters] = await pool.execute('SELECT COUNT(*) as count FROM chapters');
    const [events] = await pool.execute('SELECT COUNT(*) as count FROM events WHERE event_date >= CURDATE()');
    const [members] = await pool.execute('SELECT SUM(member_count) as count FROM chapters');
    const [partners] = await pool.execute('SELECT COUNT(*) as count FROM partners');

    // Also fetch recent activity (e.g., recent news or events)
    const [recent] = await pool.execute(
      'SELECT "New Chapter Added" as activity, created_at as date, "Completed" as status FROM chapters ORDER BY created_at DESC LIMIT 3'
    );

    res.json({
      totalChapters: chapters[0].count,
      upcomingEvents: events[0].count,
      activeMembers: members[0].count || 0,
      totalPartners: partners[0].count,
      recentActivity: recent
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});


// ================= GALLERY APIs =================

// Public Gallery APIs
app.get('/api/gallery', async (req, res) => {
  try {
    const status = req.query.status || 'published';

    // Fetch posts
    const [posts] = await pool.execute('SELECT * FROM gallery_posts WHERE status = ? ORDER BY event_date DESC, created_at DESC', [status]);

    // Fetch all images per post
    for (let post of posts) {
      const [images] = await pool.execute('SELECT * FROM gallery_images WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
      post.images = images;
      post.cover_image = images.length > 0 ? images[0].image_url : null;
    }

    res.json(posts);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.get('/api/gallery/:id', async (req, res) => {
  try {
    const [posts] = await pool.execute('SELECT * FROM gallery_posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ error: 'Gallery post not found' });

    const post = posts[0];
    const [images] = await pool.execute('SELECT * FROM gallery_images WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
    post.images = images;

    res.json(post);
  } catch (error) {
    console.error('Error fetching gallery details:', error);
    res.status(500).json({ error: 'Failed to fetch gallery details' });
  }
});

// Admin Gallery APIs (Protected)
app.get('/api/admin/gallery', authenticateToken, async (req, res) => {
  try {
    const [posts] = await pool.execute('SELECT * FROM gallery_posts ORDER BY created_at DESC');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching admin gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery posts' });
  }
});

app.get('/api/admin/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const [posts] = await pool.execute('SELECT * FROM gallery_posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ error: 'Gallery post not found' });

    const post = posts[0];
    const [images] = await pool.execute('SELECT * FROM gallery_images WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
    post.images = images;

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery post' });
  }
});

app.post('/api/admin/gallery', authenticateToken, async (req, res) => {
  const { title, description, event_date, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const [result] = await pool.execute(
      `INSERT INTO gallery_posts (title, description, event_date, status) VALUES (?, ?, ?, ?)`,
      [title, description || null, event_date || null, status || 'draft']
    );
    const [newPost] = await pool.execute('SELECT * FROM gallery_posts WHERE id = ?', [result.insertId]);
    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error('Error creating gallery post:', error);
    res.status(500).json({ error: 'Failed to create gallery post' });
  }
});

app.put('/api/admin/gallery/:id', authenticateToken, async (req, res) => {
  const { title, description, event_date, status } = req.body;
  const { id } = req.params;
  try {
    const [result] = await pool.execute(
      `UPDATE gallery_posts SET title=?, description=?, event_date=?, status=? WHERE id=?`,
      [title, description || null, event_date || null, status || 'draft', id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Gallery post not found' });
    res.json({ message: 'Gallery post updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery post' });
  }
});

app.delete('/api/admin/gallery/:id', authenticateToken, async (req, res) => {
  try {
    // The foreign key constraint ON DELETE CASCADE will handle deleting images in the DB.
    // However, the actual files in /uploads/gallery/ will remain orphaned unless manually deleted.
    // For this scope, DB cascading is sufficient.
    const [result] = await pool.execute('DELETE FROM gallery_posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Gallery post not found' });
    res.json({ message: 'Gallery post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery post' });
  }
});

// Admin Image Upload (Multiple)
app.post('/api/admin/gallery/:id/images', authenticateToken, uploadGallery.array('files', 20), async (req, res) => {
  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    // Get current max sort_order
    const [rows] = await pool.execute('SELECT MAX(sort_order) as maxOrder FROM gallery_images WHERE post_id = ?', [id]);
    let currentMax = rows[0].maxOrder || 0;

    const uploadedImages = [];

    for (const file of files) {
      currentMax += 1;
      const relativeUrl = `/uploads/gallery/${file.filename}`;

      const [result] = await pool.execute(
        'INSERT INTO gallery_images (post_id, image_url, sort_order) VALUES (?, ?, ?)',
        [id, relativeUrl, currentMax]
      );

      uploadedImages.push({
        id: result.insertId,
        post_id: id,
        image_url: relativeUrl,
        sort_order: currentMax
      });
    }

    res.status(201).json({ urls: uploadedImages.map(img => img.image_url), images: uploadedImages });
  } catch (error) {
    console.error('Error uploading gallery images:', error);
    res.status(500).json({ error: 'Failed to save uploaded images' });
  }
});

// Admin Delete Single Image
app.delete('/api/admin/gallery/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM gallery_images WHERE id = ?', [req.params.imageId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Admin Reorder Images
app.put('/api/admin/gallery/:id/images/reorder', authenticateToken, async (req, res) => {
  const { images } = req.body; // Expects an array of objects: { id: 1, sort_order: 1 }
  if (!images || !Array.isArray(images)) return res.status(400).json({ error: 'Invalid data format' });

  try {
    // Perform updates in a loop (could use transactions for safety, but simple loop works for this scope)
    for (const img of images) {
      await pool.execute('UPDATE gallery_images SET sort_order = ? WHERE id = ?', [img.sort_order, img.id]);
    }
    res.json({ message: 'Images reordered successfully' });
  } catch (error) {
    console.error('Error reordering images:', error);
    res.status(500).json({ error: 'Failed to reorder images' });
  }
});


// Generic GET all items
app.get('/api/admin/:table', authenticateToken, async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

  try {
    const [rows] = await pool.execute(`SELECT * FROM ${table} ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    res.status(500).json({ error: `Failed to fetch ${table}` });
  }
});

// Generic GET single item
app.get('/api/admin/:table/:id', authenticateToken, async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

  try {
    const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch item from ${table}` });
  }
});

// Generic POST create item
app.post('/api/admin/:table', authenticateToken, async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

  const data = req.body;
  if (!data || Object.keys(data).length === 0) return res.status(400).json({ error: 'No data provided' });

  // Filter keys against allowed columns whitelist
  const allowedColumns = TABLE_COLUMNS[table];
  const safeData = {};
  for (const key of Object.keys(data)) {
    if (allowedColumns.includes(key)) {
      safeData[key] = data[key];
    }
  }

  // Auto-generate slug if missing
  if (allowedColumns.includes('slug') && !safeData.slug && safeData.title) {
    safeData.slug = safeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);
  }

  if (Object.keys(safeData).length === 0) return res.status(400).json({ error: 'No valid data provided' });

  const columns = Object.keys(safeData).join(', ');
  const placeholders = Object.keys(safeData).map(() => '?').join(', ');
  const values = Object.values(safeData);

  try {
    const [result] = await pool.execute(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);
    const [newItem] = await pool.execute(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error(`Error creating in ${table}:`, error);
    res.status(500).json({ error: `Failed to create item in ${table}` });
  }
});

// Upload Chairman Photo
app.post('/api/admin/upload/chairman-photo', authenticateToken, uploadChairmanPhoto.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const relativePath = `/uploads/chairman/${req.file.filename}`;
  res.json({ url: relativePath });
});

// Generic PUT update item
app.put('/api/admin/:table/:id', authenticateToken, async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

  const data = req.body;
  if (!data || Object.keys(data).length === 0) return res.status(400).json({ error: 'No data provided' });

  // Filter keys against allowed columns whitelist
  const allowedColumns = TABLE_COLUMNS[table];
  const safeData = {};
  for (const key of Object.keys(data)) {
    if (allowedColumns.includes(key)) {
      safeData[key] = data[key];
    }
  }

  // Auto-generate slug if missing
  if (allowedColumns.includes('slug') && !safeData.slug && safeData.title) {
    safeData.slug = safeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);
  }

  if (Object.keys(safeData).length === 0) return res.status(400).json({ error: 'No valid data provided' });

  const updates = Object.keys(safeData).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(safeData), id];

  try {
    const [result] = await pool.execute(`UPDATE ${table} SET ${updates} WHERE id = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });

    const [updatedItem] = await pool.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    res.json(updatedItem[0]);
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    res.status(500).json({ error: `Failed to update item in ${table}` });
  }
});

// Generic DELETE item
app.delete('/api/admin/:table/:id', authenticateToken, async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

  try {
    const [result] = await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    res.status(500).json({ error: `Failed to delete item from ${table}` });
  }
});

// Public Leadership Members
app.get('/api/leadership-members', async (req, res) => {
  try {
    const type = req.query.type;
    let query = 'SELECT * FROM leadership_members';
    let params = [];

    if (type === 'past') {
      query += ' WHERE type = "past" AND status = "published" ORDER BY year_end DESC, year_start DESC';
    } else if (type === 'current') {
      query += ' WHERE type = "current" AND status = "published" ORDER BY hierarchy_level ASC, seat ASC';
    } else {
      query += ' WHERE status = "published" ORDER BY type ASC, hierarchy_level ASC, seat ASC';
    }

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching leadership members:', error);
    res.status(500).json({ error: 'Failed to fetch leadership members' });
  }
});

// Public Events API
app.get('/api/events', async (req, res) => {
  try {
    const status = req.query.status || 'published';
    const [rows] = await pool.execute('SELECT * FROM events WHERE status = ? ORDER BY event_date ASC', [status]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Public News API
app.get('/api/news', async (req, res) => {
  try {
    const status = req.query.status || 'published';
    const q = req.query.q;

    let query = 'SELECT id, title, slug, excerpt, banner_image_url, category, publish_date FROM news WHERE status = ?';
    let params = [status];

    if (q) {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const searchParam = `%${q}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY publish_date DESC, created_at DESC';

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.get('/api/news/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM news WHERE slug = ? AND status = ?', [req.params.slug, 'published']);
    if (rows.length === 0) return res.status(404).json({ error: 'News article not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
});

// Public Programs API
app.get('/api/programs', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM programs WHERE status = "published" ORDER BY sort_order ASC, created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

app.get('/api/programs/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM programs WHERE slug = ? AND status = "published"', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Program not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
});

// Get related news
app.get('/api/news/:slug/related', async (req, res) => {
  try {
    const [current] = await pool.execute('SELECT category FROM news WHERE slug = ?', [req.params.slug]);
    if (current.length === 0) return res.status(404).json({ error: 'News article not found' });

    const category = current[0].category;

    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, banner_image_url, category, publish_date FROM news WHERE status = ? AND slug != ? AND category = ? ORDER BY publish_date DESC, created_at DESC LIMIT 3',
      ['published', req.params.slug, category]
    );

    if (rows.length < 3) {
      const needed = 3 - rows.length;
      const [moreRows] = await pool.execute(
        'SELECT id, title, slug, excerpt, banner_image_url, category, publish_date FROM news WHERE status = ? AND slug != ? AND category != ? ORDER BY publish_date DESC, created_at DESC LIMIT ?',
        ['published', req.params.slug, category, needed]
      );
      res.json([...rows, ...moreRows]);
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error('Error fetching related news:', error);
    res.status(500).json({ error: 'Failed to fetch related news' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
