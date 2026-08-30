import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { SEED_HOLDINGS } from '@/lib/seedData';

export async function GET() {
  try {
    const data = await kv.get('holdings');
    return NextResponse.json(data && data.length ? data : SEED_HOLDINGS);
  } catch (e) {
    // No hay KV configurado todavia (o fallo de red) -> devolvemos los datos de partida
    return NextResponse.json(SEED_HOLDINGS);
  }
}

export async function PUT(request) {
  const body = await request.json();
  try {
    await kv.set('holdings', body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'No se pudo guardar en KV. ¿Está conectada la integracion Storage en Vercel?' }, { status: 500 });
  }
}
