import re

with open('backend/server.js', 'r') as f:
    content = f.read()

# Add uploadChairmanPhoto configuration
upload_config = """const uploadProgramBanner = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for program banner'));
  }
});"""
new_upload_config = upload_config + """

const uploadChairmanPhoto = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type for chairman photo'));
  }
});"""

content = content.replace(upload_config, new_upload_config)

with open('backend/server.js', 'w') as f:
    f.write(content)
