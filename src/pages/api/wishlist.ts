
import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body, query } = req;

  try {
    switch (method) {
      case 'GET':
        const getResult = await pool.query('SELECT * FROM wishlist ORDER BY created_at DESC');
        return res.status(200).json(getResult.rows);

      case 'POST':
        const { title, description, link, priority } = body;
        if (!title) {
          return res.status(400).json({ error: 'Title is required' });
        }
        const postResult = await pool.query(
          'INSERT INTO wishlist (title, description, link, priority) VALUES ($1, $2, $3, $4) RETURNING *',
          [title, description, link, priority]
        );
        return res.status(201).json(postResult.rows[0]);

      case 'PUT':
        const { id: putId } = query;
        const { title: putTitle, description: putDescription, link: putLink, priority: putPriority, completed: putCompleted } = body;
        const putResult = await pool.query(
          'UPDATE wishlist SET title = $1, description = $2, link = $3, priority = $4, completed = $5 WHERE id = $6 RETURNING *',
          [putTitle, putDescription, putLink, putPriority, putCompleted, putId]
        );
        return res.status(200).json(putResult.rows[0]);

      case 'DELETE':
        const { id: deleteId } = query;
        await pool.query('DELETE FROM wishlist WHERE id = $1', [deleteId]);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
