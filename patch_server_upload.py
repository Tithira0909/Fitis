import re

with open('backend/server.js', 'r') as f:
    content = f.read()

upload_route = """app.post('/api/admin/upload/program-banner', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const relativePath = `/uploads/programs/${req.file.filename}`;
  res.json({ url: relativePath });
});"""

new_upload_route = upload_route + """

// Upload Chairman Photo
app.post('/api/admin/upload/chairman-photo', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const relativePath = `/uploads/chairman/${req.file.filename}`;
  res.json({ url: relativePath });
});"""

content = content.replace(upload_route, new_upload_route)

with open('backend/server.js', 'w') as f:
    f.write(content)
