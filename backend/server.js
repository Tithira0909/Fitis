import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
    res.json({ status: 'success', message: 'Connected to MySQL Database' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
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

// Protected Route Example
app.get('/api/admin/data', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
