import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { SEED_HOLDINGS } from '@/lib/seedData';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET() {
  try {
    const data = await redis.get('holdings');
    return NextResponse.json(data && data.length ? data : SEED_HOLDINGS);
  } catch (e) {
    // No hay Redis configurado todavia (o fallo de red) -> devolvemos los datos de partida
    return NextResponse.json(SEED_HOLDINGS);
  }
}

export async function PUT(request) {
  const body = await request.json();
  try {
    await redis.set('holdings', body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'No se pudo guardar en Redis. ¿Está conectada la integracion Upstash en Vercel?' }, { status: 500 });
  }
}
