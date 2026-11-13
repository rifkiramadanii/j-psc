import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

function checkAuth() {
  const authCookie = cookies().get('admin_session');
  return authCookie && authCookie.value === 'authenticated';
}

// Helper untuk proses upload file gambar yang aman
async function saveCoverImage(coverFile) {
  if (!coverFile || coverFile.size === 0 || coverFile.name === 'undefined') {
    return null;
  }

  try {
    const buffer = Buffer.from(await coverFile.arrayBuffer());
    const cleanFileName = coverFile.name.replace(/[^a-zA-Z0-9.]/g, '');
    const fileName = `${Date.now()}-${cleanFileName}`;
    
    // Tentukan path absolut ke folder public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Buat folder secara rekursif jika belum ada
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    return `/uploads/${fileName}`;
  } catch (err) {
    console.error('Gagal menyimpan file gambar:', err);
    throw new Error('Gagal mengupload file gambar ke server: ' + err.message);
  }
}

// POST: Tambah Buku
export async function POST(request) {
  try {
    if (!checkAuth()) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

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
    const descriptionEn = formData.get('descriptionEn');
    
    const coverFile = formData.get('cover');
    const coverUrl = await saveCoverImage(coverFile);

    const query = `
      INSERT INTO books 
      (slug, title_id, title_en, author, publish_year, isbn, category, cover_color, desc_id, desc_en, cover_image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      slug, titleId, titleEn, author, Number(year), isbn, category, coverColor, descriptionId, descriptionEn, coverUrl
    ];

    await pool.query(query, values);
    return NextResponse.json({ success: true, message: 'Buku berhasil ditambahkan!' });

  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Edit Buku
export async function PUT(request) {
  try {
    if (!checkAuth()) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

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
    const descriptionEn = formData.get('descriptionEn');
    
    const coverFile = formData.get('cover');
    const coverUrl = await saveCoverImage(coverFile);

    let query = '';
    let values = [];

    if (coverUrl) {
      // Jika user mengupload gambar cover baru, update juga cover_image_url
      query = `
        UPDATE books 
        SET title_id = ?, title_en = ?, author = ?, publish_year = ?, isbn = ?, category = ?, cover_color = ?, desc_id = ?, desc_en = ?, cover_image_url = ?
        WHERE slug = ?
      `;
      values = [titleId, titleEn, author, Number(year), isbn, category, coverColor, descriptionId, descriptionEn, coverUrl, slug];
    } else {
      // Jika tidak mengupload gambar baru, biarkan cover_image_url yang lama
      query = `
        UPDATE books 
        SET title_id = ?, title_en = ?, author = ?, publish_year = ?, isbn = ?, category = ?, cover_color = ?, desc_id = ?, desc_en = ?
        WHERE slug = ?
      `;
      values = [titleId, titleEn, author, Number(year), isbn, category, coverColor, descriptionId, descriptionEn, slug];
    }

    await pool.query(query, values);
    return NextResponse.json({ success: true, message: 'Buku berhasil diperbarui!' });

  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}