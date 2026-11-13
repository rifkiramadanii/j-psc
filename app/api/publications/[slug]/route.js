import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    const [rows] = await pool.query('SELECT * FROM publications WHERE slug = ? LIMIT 1', [slug]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Buku tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}