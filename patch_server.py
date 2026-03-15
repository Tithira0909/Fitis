import re

with open('backend/server.js', 'r') as f:
    content = f.read()

# Add to Multer Configuration
multer_search = """    } else if (req.path.includes('/upload/program-banner')) {
      dest += 'programs';
    }"""
multer_replace = """    } else if (req.path.includes('/upload/program-banner')) {
      dest += 'programs';
    } else if (req.path.includes('/upload/chairman-photo')) {
      dest += 'chairman';
    }"""
content = content.replace(multer_search, multer_replace)

# Add Chairman Message API Routes right after Site Settings
site_settings_search = """    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});"""
chairman_routes = """
// Chairman Message Public
app.get('/api/chairman-message', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM chairman_message WHERE id = 1 AND status = "published"');
    if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching chairman message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Admin Chairman Message (Protected)
app.get('/api/admin/chairman-message', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM chairman_message WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching chairman message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

app.put('/api/admin/chairman-message', authenticateToken, async (req, res) => {
  const { name, designation, subtitle, photo_url, message_title, message_body, focus_cards, status } = req.body;
  try {
    const [existing] = await pool.execute('SELECT id FROM chairman_message WHERE id = 1');
    const focusCardsStr = focus_cards ? JSON.stringify(focus_cards) : null;

    if (existing.length === 0) {
      await pool.execute(
        `INSERT INTO chairman_message (id, name, designation, subtitle, photo_url, message_title, message_body, focus_cards, status)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, designation, subtitle, photo_url, message_title, message_body, focusCardsStr, status || 'published']
      );
    } else {
      await pool.execute(
        `UPDATE chairman_message
         SET name=?, designation=?, subtitle=?, photo_url=?, message_title=?, message_body=?, focus_cards=?, status=?
         WHERE id=1`,
        [name, designation, subtitle, photo_url, message_title, message_body, focusCardsStr, status || 'published']
      );
    }
    res.json({ message: 'Chairman message updated successfully' });
  } catch (error) {
    console.error('Error updating chairman message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});
"""

content = content.replace(site_settings_search, site_settings_search + chairman_routes)

with open('backend/server.js', 'w') as f:
    f.write(content)
