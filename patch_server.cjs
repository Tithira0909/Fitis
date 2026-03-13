const fs = require('fs');

const serverFile = 'backend/server.js';
let content = fs.readFileSync(serverFile, 'utf8');

// 1. Add multer logic for gallery uploads
const oldStorage = `    } else if (req.path.includes('/upload/news-pdf')) {
      dest += 'news-pdf';
    }`;

const newStorage = `    } else if (req.path.includes('/upload/news-pdf')) {
      dest += 'news-pdf';
    } else if (req.path.includes('/upload/gallery')) {
      dest += 'gallery';
    }`;
content = content.replace(oldStorage, newStorage);

const oldUploadNewsPdf = `const uploadNewsPdf = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Invalid file type for PDF'));
  }
});`;

const newUploadGallery = `const uploadNewsPdf = multer({
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
});`;
content = content.replace(oldUploadNewsPdf, newUploadGallery);


// 2. Add API endpoints for Gallery
const galleryApi = `
// ================= GALLERY APIs =================

// Public Gallery APIs
app.get('/api/gallery', async (req, res) => {
  try {
    const status = req.query.status || 'published';

    // Fetch posts
    const [posts] = await pool.execute('SELECT * FROM gallery_posts WHERE status = ? ORDER BY event_date DESC, created_at DESC', [status]);

    // Fetch one cover image per post (first image based on sort_order)
    for (let post of posts) {
      const [images] = await pool.execute('SELECT image_url FROM gallery_images WHERE post_id = ? ORDER BY sort_order ASC LIMIT 1', [post.id]);
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
      \`INSERT INTO gallery_posts (title, description, event_date, status) VALUES (?, ?, ?, ?)\`,
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
      \`UPDATE gallery_posts SET title=?, description=?, event_date=?, status=? WHERE id=?\`,
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

    const protocol = req.protocol;
    const host = req.get('host');

    const uploadedImages = [];

    for (const file of files) {
      currentMax += 1;
      const fullUrl = \`\${protocol}://\${host}/uploads/gallery/\${file.filename}\`;

      const [result] = await pool.execute(
        'INSERT INTO gallery_images (post_id, image_url, sort_order) VALUES (?, ?, ?)',
        [id, fullUrl, currentMax]
      );

      uploadedImages.push({
        id: result.insertId,
        post_id: id,
        image_url: fullUrl,
        sort_order: currentMax
      });
    }

    res.status(201).json(uploadedImages);
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
`;

// Insert the gallery APIs before generic CRUD starts
content = content.replace('// Generic GET all items', galleryApi + '\n\n// Generic GET all items');

fs.writeFileSync(serverFile, content, 'utf8');
console.log('Patched server.js');
