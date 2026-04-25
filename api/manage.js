import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const { partner } = req.query;
      const data = await sql`SELECT * FROM seserahan WHERE partner_name = ${partner} ORDER BY created_at DESC`;
      return res.status(200).json(data);
    } 
    
    if (req.method === 'POST') {
      const { partner_name, category, item_name, price, img_url } = req.body;
      await sql`INSERT INTO seserahan (partner_name, category, item_name, price, img_url) 
                VALUES (${partner_name}, ${category}, ${item_name}, ${price}, ${img_url})`;
      return res.status(200).json({ msg: 'Success' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM seserahan WHERE id = ${id}`;
      return res.status(200).json({ msg: 'Deleted' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}