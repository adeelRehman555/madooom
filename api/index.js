import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

// Create connection pool to Neon
const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Initialize database - create tables if they don't exist
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        public_id VARCHAR(255) UNIQUE,
        url TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initializeDatabase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Get all media
app.get('/api/media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching media:', err);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Upload media (image/video)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const type = req.body.type || 'image';
    const name = req.body.name || req.file.originalname;

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: type === 'video' ? 'video' : 'image',
        folder: 'nibi-birthday',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Upload failed' });
        }

        try {
          // Save to database
          const dbResult = await pool.query(
            'INSERT INTO media (public_id, url, type, name) VALUES ($1, $2, $3, $4) RETURNING *',
            [result.public_id, result.secure_url, type, name]
          );
          res.json(dbResult.rows[0]);
        } catch (dbErr) {
          console.error('Database error:', dbErr);
          res.status(500).json({ error: 'Failed to save to database' });
        }
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete media
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT public_id FROM media WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const { public_id } = result.rows[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id, { resource_type: 'auto' });

    // Delete from database
    await pool.query('DELETE FROM media WHERE id = $1', [id]);
    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// Get all wishlist items
app.get('/api/wishlist', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wishlist ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add wishlist item
app.post('/api/wishlist', async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO wishlist (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
      [title, description, priority]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding wishlist item:', err);
    res.status(500).json({ error: 'Failed to add wishlist item' });
  }
});

// Update wishlist item
app.put('/api/wishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;

    const result = await pool.query(
      'UPDATE wishlist SET title = $1, description = $2, priority = $3 WHERE id = $4 RETURNING *',
      [title, description, priority, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating wishlist:', err);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// Delete wishlist item
app.delete('/api/wishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM wishlist WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ message: 'Wishlist item deleted' });
  } catch (err) {
    console.error('Error deleting wishlist:', err);
    res.status(500).json({ error: 'Failed to delete wishlist' });
  }
});

export default app;
