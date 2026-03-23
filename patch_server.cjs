const fs = require('fs');
let content = fs.readFileSync('backend/server.js', 'utf8');
content = content.replace(
  /partners: \['name', 'category', 'logo_url', 'website_url', 'sort_order', 'status'\],/,
  "partners: ['name', 'category', 'logo_url', 'website_url', 'sort_order', 'status'],"
); // It's already the same, just checking if I need to update table columns. Wait, category is an ENUM so TABLE_COLUMNS doesn't care.

fs.writeFileSync('backend/server.js', content, 'utf8');
