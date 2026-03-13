const fs = require('fs');
const file = 'backend/server.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `    // Fetch one cover image per post (first image based on sort_order)
    for (let post of posts) {
      const [images] = await pool.execute('SELECT image_url FROM gallery_images WHERE post_id = ? ORDER BY sort_order ASC LIMIT 1', [post.id]);
      post.cover_image = images.length > 0 ? images[0].image_url : null;
    }`,
  `    // Fetch all images per post
    for (let post of posts) {
      const [images] = await pool.execute('SELECT * FROM gallery_images WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
      post.images = images;
      post.cover_image = images.length > 0 ? images[0].image_url : null;
    }`
);

fs.writeFileSync(file, content);
console.log("Updated backend/server.js");
