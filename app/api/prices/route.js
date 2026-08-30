import { NextResponse } from 'next/server';
import { COINGECKO_IDS } from '@/lib/seedData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = (searchParams.get('tickers') || '')
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  const result = {};
  const errors = {};

  // --- Cripto: CoinGecko (gratis, sin api key) ---
  const cryptoTickers = tickers.filter((t) => COINGECKO_IDS[t]);
  if (cryptoTickers.length) {
    const ids = [...new Set(cryptoTickers.map((t) => COINGECKO_IDS[t]))].join(',');
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`, {
        next: { revalidate: 0 },
      });
      const data = await res.json();
      cryptoTickers.forEach((t) => {
        const id = COINGECKO_IDS[t];
        if (data?.[id]?.eur !== undefined) result[t] = data[id].eur;
        else errors[t] = 'sin dato de CoinGecko';
      });
    } catch (e) {
      cryptoTickers.forEach((t) => (errors[t] = 'fallo al consultar CoinGecko'));
    }
  }

  // --- Acciones/ETFs: Twelve Data (requiere TWELVE_DATA_API_KEY) ---
  const equityTickers = tickers.filter((t) => !COINGECKO_IDS[t]);
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (equityTickers.length && !apiKey) {
    equityTickers.forEach((t) => (errors[t] = 'falta TWELVE_DATA_API_KEY'));
  } else if (equityTickers.length) {
    await Promise.all(
      equityTickers.map(async (t) => {
        try {
          const res = await fetch(
            `https://api.twelvedata.com/price?symbol=${encodeURIComponent(t)}&apikey=${apiKey}`,
            { next: { revalidate: 0 } }
          );
          const data = await res.json();
          const price = parseFloat(data?.price);
          if (!isNaN(price)) result[t] = price;
          else errors[t] = data?.message || 'símbolo no resuelto — revisa el ticker en twelvedata.com/symbolsearch';
        } catch (e) {
          errors[t] = 'fallo al consultar Twelve Data';
        }
      })
    );
  }

  return NextResponse.json({ prices: result, errors });
}
