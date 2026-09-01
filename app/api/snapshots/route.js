import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET() {
  try {
    const data = await redis.get('snapshots');
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  const snap = await request.json();
  try {
    const existing = (await redis.get('snapshots')) || [];
    existing.push(snap);
    await redis.set('snapshots', existing);
    return NextResponse.json({ ok: true, snapshots: existing });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'No se pudo guardar en Redis' }, { status: 500 });
  }
}
