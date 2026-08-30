import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const data = await kv.get('snapshots');
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  const snap = await request.json();
  try {
    const existing = (await kv.get('snapshots')) || [];
    existing.push(snap);
    await kv.set('snapshots', existing);
    return NextResponse.json({ ok: true, snapshots: existing });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'No se pudo guardar en KV' }, { status: 500 });
  }
}
