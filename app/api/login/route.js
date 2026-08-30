import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body;

  if (!process.env.DASHBOARD_PASSWORD || !process.env.SESSION_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Faltan variables de entorno DASHBOARD_PASSWORD / SESSION_SECRET en Vercel' },
      { status: 500 }
    );
  }

  if (password === process.env.DASHBOARD_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('session', process.env.SESSION_SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
