import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM publications ORDER BY id DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error GET:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Ambil data teks
    const slug = formData.get('slug');
    const titleEn = formData.get('titleEn');
    const titleId = formData.get('titleId');
    const author = formData.get('author');
    const year = formData.get('year');
    const isbn = formData.get('isbn');
    const category = formData.get('category');
    const coverColor = formData.get('coverColor');
    const descriptionId = formData.get('descriptionId'); 
    const descriptionEn = formData.get('descriptionEn');
    
    let coverUrl = null;
    const coverFile = formData.get('coverImage');

    // Proses upload gambar jika ada
    if (coverFile && coverFile.name) {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${slug}-${Date.now()}-${coverFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      // Buat folder public/uploads jika belum ada
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Simpan path URL untuk dipanggil di frontend
      coverUrl = `/uploads/${fileName}`;
    }

    // Insert ke MySQL
    const query = `
      INSERT INTO publications 
      (slug, title_en, title_id, author, publish_year, isbn, category, cover_color, desc_en, desc_id, cover_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        slug, 
        titleId, 
        titleEn, 
        author, 
        Number(year), 
        isbn, 
        category, 
        coverColor, 
        descriptionId, // <--- Ini akan masuk ke desc_id
        descriptionEn, // <--- Ini akan masuk ke desc_en
        coverUrl
        ];

    await pool.query(query, values);

    return NextResponse.json({ success: true, message: 'Buku berhasil disimpan' });
  } catch (error) {
    console.error('Error POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
