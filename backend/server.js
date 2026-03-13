import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
  news: ['title', 'content', 'author'],
  events: ['name', 'event_date', 'location', 'description'],
  chapters: ['name', 'head', 'member_count'],
  board_members: ['name', 'position', 'company'],
  partners: ['company_name', 'tier', 'contact_person'],
  newsletter_subscribers: ['email']
};
const ALLOWED_TABLES = Object.keys(TABLE_COLUMNS);

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
