with open('backend/server.js', 'r') as f:
    content = f.read()

upload_route = """// Generic PUT update item"""

new_upload_route = """// Upload Chairman Photo
app.post('/api/admin/upload/chairman-photo', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const relativePath = `/uploads/chairman/${req.file.filename}`;
  res.json({ url: relativePath });
});

// Generic PUT update item"""

content = content.replace(upload_route, new_upload_route)

with open('backend/server.js', 'w') as f:
    f.write(content)
