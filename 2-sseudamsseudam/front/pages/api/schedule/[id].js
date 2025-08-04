import db from '../../../lib/db'; // DB 연결 유틸
import dayjs from 'dayjs';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM calendars WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(rows[0]);
  }

  if (req.method === 'PUT') {
    const { title, content, startDate, endDate } = req.body;
    await db.query(
      'UPDATE calendars SET title = ?, content = ?, startDate = ?, endDate = ?, updatedAt = NOW() WHERE id = ?',
      [title, content, startDate, endDate, id]
    );
    res.status(200).json({ message: 'Updated' });
  }
}
