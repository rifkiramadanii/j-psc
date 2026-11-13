import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request, { params }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  
  try {
    const { slug } = params;
    await pool.query('DELETE FROM publications WHERE slug = ?', [slug]);
    
    // Catatan: Jika ingin menghapus file fisik gambarnya, Anda bisa menggunakan fs.unlink() di sini
    
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error DELETE:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Ambil hanya 1 buku berdasarkan slug
    const [rows] = await pool.query('SELECT * FROM books WHERE slug = ? LIMIT 1', [slug]);

    // Jika buku tidak ditemukan di database
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Buku tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}