import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL belum dipasang di Vercel!" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // AMBIL DATA (GET)
    if (req.method === 'GET') {
      const { email } = req.query;
      if (!email) return res.status(200).json([]);
      const data = await sql`SELECT * FROM seserahan WHERE user_email = ${email} ORDER BY id DESC`;
      return res.status(200).json(data);
    } 
    
    // SIMPAN DATA (POST)
    if (req.method === 'POST') {
      const { user_email, partner_name, category, item_name, price, img_url } = req.body;
      
      // Validasi: Minimal email dan nama barang harus ada
      if (!user_email || !item_name) {
        return res.status(400).json({ error: "Email atau Nama Barang kosong!" });
      }

      await sql`
        INSERT INTO seserahan (user_email, partner_name, category, item_name, price, img_url) 
        VALUES (
          ${user_email}, 
          ${partner_name || 'Partner'}, 
          ${category || 'Lainnya'}, 
          ${item_name}, 
          ${Number(price) || 0}, 
          ${img_url || ''}
        )
      `;
      return res.status(200).json({ msg: 'Success' });
    }

    // HAPUS DATA (DELETE)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM seserahan WHERE id = ${id}`;
      return res.status(200).json({ msg: 'Deleted' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
