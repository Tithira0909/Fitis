const fs = require('fs');

const file = 'backend/server.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3005']",
  "origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:3005']"
);

fs.writeFileSync(file, content);
