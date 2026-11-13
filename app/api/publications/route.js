import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin_session');
    return authCookie && authCookie.value === 'authenticated';
  } catch (error) {
    return false;
  }
}

async function saveCoverImage(coverFile) {
  if (!coverFile || coverFile.size === 0 || coverFile.name === 'undefined') {
    return null;
  }

  try {
    const buffer = Buffer.from(await coverFile.arrayBuffer());
    const cleanFileName = coverFile.name.replace(/[^a-zA-Z0-9.]/g, '');
    const fileName = `${Date.now()}-${cleanFileName}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
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

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM publications ORDER BY id DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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
      INSERT INTO publications 
      (slug, title_id, title_en, author, publish_year, isbn, category, cover_color, desc_id, desc_en, cover_url) 
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

export async function PUT(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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
      query = `
        UPDATE publications 
        SET title_id = ?, title_en = ?, author = ?, publish_year = ?, isbn = ?, category = ?, cover_color = ?, desc_id = ?, desc_en = ?, cover_url = ?
        WHERE slug = ?
      `;
      values = [titleId, titleEn, author, Number(year), isbn, category, coverColor, descriptionId, descriptionEn, coverUrl, slug];
    } else {
      query = `
        UPDATE publications 
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

export async function DELETE(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ success: false, error: 'Slug tidak ditemukan' }, { status: 400 });

    await pool.query('DELETE FROM publications WHERE slug = ?', [slug]);
    return NextResponse.json({ success: true, message: 'Buku dihapus!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}