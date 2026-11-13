import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { cookies } from 'next/headers';

// Fungsi bantuan untuk mengecek hak akses
function checkAuth() {
  const authCookie = cookies().get('admin_session');
  return authCookie && authCookie.value === 'authenticated';
}

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
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

// PUT: Perbarui data buku berdasarkan slug
export async function PUT(request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const formData = await request.formData();
    
    const slug = formData.get('slug');
    const titleId = formData.get('titleId');
    const titleEn = formData.get('titleEn');
    const author = formData.get('author');
    const year = formData.get('year');
    const isbn = formData.get('isbn');
    const category = formData.get('category');
    const coverColor = formData.get('coverColor');
    const descriptionId = formData.get('descriptionId');
    const descriptionEn = formData.get('desc_en') || formData.get('descriptionEn');
    
    const coverFile = formData.get('cover');
    let coverUrlUpdateClause = '';
    let values = [];

    // Cek apakah admin mengupload gambar cover baru saat mengedit
    if (coverFile && coverFile.size > 0) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const cleanFileName = coverFile.name.replace(/[^a-zA-Z0-9.]/g, '');
      const fileName = `${Date.now()}-${cleanFileName}`;
      
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      const coverUrl = `/uploads/${fileName}`;

      // Update termasuk cover_image_url
      coverUrlUpdateClause = ', cover_image_url = ?';
      values = [
        titleId, titleEn, author, Number(year), isbn, category, coverColor, descriptionId, descriptionEn, coverUrl, slug
      ];
    } else {
      // Update tanpa mengubah cover_image_url yang lama
      values = [
        titleId, titleEn, author, Number(year), isbn, category, coverColor, descriptionId, descriptionEn, slug
      ];
    }

    const query = `
      UPDATE books 
      SET title_id = ?, title_en = ?, author = ?, publish_year = ?, isbn = ?, category = ?, cover_color = ?, desc_id = ?, desc_en = ? ${coverUrlUpdateClause}
      WHERE slug = ?
    `;

    await pool.query(query, values);
    return NextResponse.json({ success: true, message: 'Buku berhasil diperbarui!' });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
