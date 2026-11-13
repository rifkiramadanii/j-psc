import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request, { params }) {
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