import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    // AMBIL DATA BERDASARKAN EMAIL USER
    if (req.method === 'GET') {
      const { email } = req.query;
      const data = await sql`SELECT * FROM seserahan WHERE user_email = ${email} ORDER BY created_at DESC`;
      return res.status(200).json(data);
    } 
    
    // SIMPAN DATA
    if (req.method === 'POST') {
      const { user_email, partner_name, category, item_name, price, img_url } = req.body;
      await sql`INSERT INTO seserahan (user_email, partner_name, category, item_name, price, img_url) 
                VALUES (${user_email}, ${partner_name}, ${category}, ${item_name}, ${price}, ${img_url})`;
      return res.status(200).json({ msg: 'Success' });
    }

    // HAPUS DATA
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM seserahan WHERE id = ${id}`;
      return res.status(200).json({ msg: 'Deleted' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
