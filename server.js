import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 5000;

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

// Create connection pool to Neon
const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
  ssl: true,
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
        link TEXT,
        priority VARCHAR(10) NOT NULL DEFAULT 'medium',
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Media table initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// Fetch resources from Cloudinary
const fetchCloudinaryMedia = async (resourceType) => {
  try {
    const auth = Buffer.from(
      `${process.env.VITE_CLOUDINARY_API_KEY}:${process.env.VITE_CLOUDINARY_API_SECRET}`
    ).toString('base64');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify({
          resource_type: resourceType,
          type: 'upload',
          max_results: 500,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.resources || [];
  } catch (error) {
    console.error(`❌ Error fetching ${resourceType} from Cloudinary:`, error);
    return [];
  }
};

// Filter images and videos
const filterByFormat = (resources, formats) => {
  return resources.filter((resource) =>
    formats.includes(resource.format?.toLowerCase())
  );
};

// Map Cloudinary resources to MediaItem format
const mapToMediaItem = (resource, type) => ({
  public_id: resource.public_id,
  url: resource.secure_url,
  type,
  name: resource.public_id.split('/').pop(),
  created_at: resource.created_at,
});

// API endpoint: Fetch and save media from Cloudinary to database
app.post('/api/sync-media', async (req, res) => {
  try {
    // Fetch images and videos from Cloudinary
    const [allImages, allVideos] = await Promise.all([
      fetchCloudinaryMedia('image'),
      fetchCloudinaryMedia('video'),
    ]);

    // Filter by format
    const images = filterByFormat(allImages, ['jpg', 'jpeg', 'png', 'webp', 'gif']);
    const videos = filterByFormat(allVideos, ['mp4', 'webm', 'mov', 'avi']);

    // Map to MediaItem format
    const imageItems = images.map((img) => mapToMediaItem(img, 'image'));
    const videoItems = videos.map((vid) => mapToMediaItem(vid, 'video'));

    const allMedia = [...imageItems, ...videoItems];

    // Save to database
    let insertedCount = 0;
    for (const media of allMedia) {
      try {
        await pool.query(
          `INSERT INTO media (public_id, url, type, name, created_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (public_id) DO NOTHING;`,
          [media.public_id, media.url, media.type, media.name, media.created_at]
        );
        insertedCount++;
      } catch (err) {
        // Ignore duplicates
      }
    }

    res.json({
      success: true,
      message: `✅ Synced ${insertedCount} media items`,
      summary: {
        images: images.length,
        videos: videos.length,
        total: allMedia.length,
      },
    });
  } catch (error) {
    console.error('❌ Error syncing media:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Get media by type
app.get('/api/media/:type', async (req, res) => {
  try {
    const { type } = req.params;

    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const result = await pool.query(
      'SELECT id, public_id, url, type, name, created_at FROM media WHERE type = $1 ORDER BY created_at DESC;',
      [type]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Get wishlist
app.get('/api/wishlist', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, link, priority, completed, created_at FROM wishlist ORDER BY created_at DESC;'
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Add wishlist item
app.post('/api/wishlist', async (req, res) => {
  try {
    const { title, description, link, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const result = await pool.query(
      `INSERT INTO wishlist (title, description, link, priority)
       VALUES ($1, $2, $3, $4) RETURNING id, title, description, link, priority, completed, created_at;`,
      [title, description || null, link || null, priority || 'medium']
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error adding wishlist item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Update wishlist item
app.put('/api/wishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, priority, completed } = req.body;
    const result = await pool.query(
      `UPDATE wishlist SET title=$1, description=$2, link=$3, priority=$4, completed=$5 WHERE id=$6 RETURNING id, title, description, link, priority, completed, created_at;`,
      [title, description || null, link || null, priority || 'medium', completed || false, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error updating wishlist item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Delete wishlist item
app.delete('/api/wishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM wishlist WHERE id=$1 RETURNING id;', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('❌ Error deleting wishlist item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/wishlist/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const result = await pool.query(
      `UPDATE wishlist SET completed = $1 WHERE id = $2 RETURNING id, title, description, link, priority, completed, created_at;`,
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error toggling wishlist item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Get all media
app.get('/api/media', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, public_id, url, type, name, created_at FROM media ORDER BY created_at DESC;'
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper: Upload file to Cloudinary
const uploadToCloudinary = async (fileBuffer, fileName, resourceType, mimeType) => {
  try {
    const auth = Buffer.from(
      `${process.env.VITE_CLOUDINARY_API_KEY}:${process.env.VITE_CLOUDINARY_API_SECRET}`
    ).toString('base64');

    const base64File = fileBuffer.toString('base64');
    const uploadPayload = {
      file: `data:${mimeType};base64,${base64File}`,
      resource_type: resourceType,
      filename: fileName,
    };

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify(uploadPayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.statusText} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Helper: Delete file from Cloudinary using SDK
const deleteFromCloudinary = async (publicId, resourceType) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (err, result) => {
        if (err) {
          console.error('❌ Cloudinary SDK delete error:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary (SDK):', error);
    throw error;
  }
};

// API endpoint: Upload file to Cloudinary and save to database
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.body.type) {
      return res.status(400).json({ error: 'Invalid request: file and type are required' });
    }

    const { type } = req.body;
    const file = req.file;

    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (type === 'image' && !allowedImageTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    if (type === 'video' && !allowedVideoTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid video format' });
    }

    const cloudinaryResponse = await uploadToCloudinary(file.buffer, file.originalname, type, file.mimetype);

    await pool.query(
      `INSERT INTO media (public_id, url, type, name, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (public_id) DO NOTHING;`,
      [cloudinaryResponse.public_id, cloudinaryResponse.secure_url, type, file.originalname, new Date()]
    );

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
        type,
        name: file.originalname,
      },
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint: Delete media from database and Cloudinary
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get media from database
    const result = await pool.query(
      'SELECT id, public_id, type FROM media WHERE id = $1;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const media = result.rows[0];

    // Delete from Cloudinary
    await deleteFromCloudinary(media.public_id, media.type);

    // Delete from database
    await pool.query('DELETE FROM media WHERE id = $1;', [id]);

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting media:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Multer error handling
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Max upload size is 100MB.' });
  }
  next(err);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(port, async () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  await initializeDatabase();
});
