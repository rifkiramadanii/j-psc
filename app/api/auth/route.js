import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET: Cek status login
export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('admin_session');
    
    if (authCookie && authCookie.value === 'authenticated') {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// POST: Proses Login
export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'ADMIN_PASSWORD belum diatur di environment server!' 
      }, { status: 500 });
    }

    if (password === adminPassword) {
      // PERBAIKAN DI SINI: Gunakan argumen terpisah untuk cookies().set()
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 jam
      });

      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Password salah!' }, { status: 401 });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan server: ' + error.message }, { status: 500 });
  }
}

// DELETE: Proses Logout
export async function DELETE() {
  try {
    cookies().delete('admin_session');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}