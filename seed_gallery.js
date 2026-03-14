import mysql from 'mysql2/promise';

const seed = async () => {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'fitis_user',
    password: 'fitis_password',
    database: 'fitis',
  });

  const [res] = await connection.execute(
    `INSERT INTO gallery_posts (title, description, event_date, status) VALUES ('Test Gallery', 'This is a test gallery', '2023-10-01', 'published')`
  );

  const postId = res.insertId;

  await connection.execute(
    `INSERT INTO gallery_images (post_id, image_url, sort_order) VALUES (?, '/uploads/gallery/test1.jpg', 1)`, [postId]
  );
  await connection.execute(
    `INSERT INTO gallery_images (post_id, image_url, sort_order) VALUES (?, '/uploads/gallery/test2.jpg', 2)`, [postId]
  );

  await connection.end();
  console.log("Seeded gallery post and images");
};

seed();
