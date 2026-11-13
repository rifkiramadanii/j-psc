import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET: Cek apakah user sudah login (untuk frontend)
export async function GET() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin_session');
  
  if (authCookie && authCookie.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// POST: Proses Login
export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (password === process.env.ADMIN_PASSWORD) {
      // Set cookie super aman (HttpOnly) selama 1 hari
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 jam
      });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Password salah!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE: Proses Logout
export async function DELETE() {
  cookies().delete('admin_session');
  return NextResponse.json({ success: true });
}