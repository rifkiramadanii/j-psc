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
      // Membuat response sukses
      const response = NextResponse.json({ success: true });

      // Mengatur cookie menggunakan header Set-Cookie standar HTTP (100% kompatibel di semua versi Next.js)
      const isProduction = process.env.NODE_ENV === 'production';
      const maxAge = 60 * 60 * 24; // 24 jam

      response.cookies.set({
        name: 'admin_session',
        value: 'authenticated',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: maxAge,
      });

      return response;
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
    const response = NextResponse.json({ success: true });
    
    // Menghapus cookie dengan mengeset maxAge ke 0
    response.cookies.set({
      name: 'admin_session',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}