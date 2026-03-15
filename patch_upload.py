import re

with open('backend/server.js', 'r') as f:
    content = f.read()

# Add uploadChairmanPhoto configuration
upload_config = """const uploadProgramBanner = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});"""
new_upload_config = upload_config + """

const uploadChairmanPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});"""

content = content.replace(upload_config, new_upload_config)

# Update the route handler to use the correct upload variable
route_search = """// Upload Chairman Photo
app.post('/api/admin/upload/chairman-photo', authenticateToken, upload.single('file'), (req, res) => {"""
route_replace = """// Upload Chairman Photo
app.post('/api/admin/upload/chairman-photo', authenticateToken, uploadChairmanPhoto.single('file'), (req, res) => {"""

content = content.replace(route_search, route_replace)

with open('backend/server.js', 'w') as f:
    f.write(content)
