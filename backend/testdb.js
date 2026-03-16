import mysql from 'mysql2/promise';

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'fitis_db',
      port: 3306
    });

    console.log('Database connected successfully');
    await conn.end();
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
}

test();