'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { useRouter } from 'next/navigation';
import {
  CLASS_LABELS,
  CLASS_COLORS,
  PLATFORM_COLORS,
  SEED_HOLDINGS,
  value,
  pnl,
  computeTotals,
  fmt,
} from '@/lib/seedData';

function pnlText(h) {
  const p = pnl(h);
  if (p === null) return '—';
  const sign = p >= 0 ? '+' : '';
  return sign + fmt(p);
}
function pnlColor(h) {
  const p = pnl(h);
  if (p === null) return 'var(--muted)';
  return p >= 0 ? 'var(--emerald)' : 'var(--clay)';
}

export default function Dashboard() {
  const [holdings, setHoldings] = useState(SEED_HOLDINGS);
  const [snapshots, setSnapshots] = useState([]);
  const [tab, setTab] = useState('resumen');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const router = useRouter();

  const donutClassCanvas = useRef(null);
  const donutPlatformCanvas = useRef(null);
  const historyCanvas = useRef(null);
  const chartsRef = useRef({});

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [hRes, sRes] = await Promise.all([fetch('/api/holdings'), fetch('/api/snapshots')]);
        const h = await hRes.json();
        const s = await sRes.json();
        setHoldings(h && h.length ? h : SEED_HOLDINGS);
        setSnapshots(s || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistHoldings = useCallback(async (next) => {
    setHoldings(next);
    try {
      await fetch('/api/holdings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
    } catch (e) {
      showToast('No se pudo guardar (revisa la conexión)');
    }
  }, [showToast]);

  function updateField(id, field, rawValue) {
    const isNumeric = field === 'quantity' || field === 'price' || field === 'cost';
    const next = holdings.map((h) =>
      h.id === id
        ? { ...h, [field]: isNumeric ? parseFloat(String(rawValue).replace(',', '.')) || 0 : rawValue }
        : h
    );
    persistHoldings(next);
  }

  function addRow(cls) {
    const next = [...holdings, { id: 'h' + Date.now(), platform: '', assetClass: cls, name: 'Nueva posición', ticker: '', quantity: 0, price: 0 }];
    persistHoldings(next);
  }

  function deleteRow(id) {
    persistHoldings(holdings.filter((h) => h.id !== id));
  }

  async function refreshPrices() {
    const tickers = [...new Set(holdings.map((h) => h.ticker).filter(Boolean))];
    if (!tickers.length) return;
    showToast('Buscando precios actuales…');
    try {
      const res = await fetch('/api/prices?tickers=' + tickers.join(','));
      const { prices, errors } = await res.json();
      const next = holdings.map((h) => (prices[h.ticker] !== undefined ? { ...h, price: prices[h.ticker] } : h));
      await persistHoldings(next);
      const updated = Object.keys(prices).length;
      const failed = Object.keys(errors || {}).length;
      showToast(`${updated} precios actualizados${failed ? `, ${failed} sin resolver` : ''}`);
    } catch (e) {
      showToast('No se pudieron obtener los precios');
    }
  }

  async function saveSnapshot() {
    const t = computeTotals(holdings);
    const snap = { date: new Date().toISOString(), total: t.liquidTotal };
    try {
      const res = await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snap),
      });
      const data = await res.json();
      setSnapshots(data.snapshots || [...snapshots, snap]);
      showToast('Instantánea guardada');
    } catch (e) {
      showToast('No se pudo guardar la instantánea');
    }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  }

  // ---- Charts ----
  useEffect(() => {
    if (loading) return;
    const t = computeTotals(holdings);

    const destroy = (key) => {
      if (chartsRef.current[key]) chartsRef.current[key].destroy();
    };

    if (donutClassCanvas.current) {
      destroy('class');
      const labels = Object.keys(t.byClass);
      chartsRef.current.class = new Chart(donutClassCanvas.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: labels.map((k) => CLASS_LABELS[k] || k),
          datasets: [{ data: labels.map((k) => t.byClass[k]), backgroundColor: labels.map((k) => CLASS_COLORS[k] || '#999'), borderColor: '#FFFFFF', borderWidth: 2 }],
        },
        options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 }, color: '#5B6B66', boxWidth: 9, padding: 12 } } } },
      });
    }

    if (donutPlatformCanvas.current) {
      destroy('platform');
      const labels = Object.keys(t.byPlatform);
      chartsRef.current.platform = new Chart(donutPlatformCanvas.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data: labels.map((k) => t.byPlatform[k]), backgroundColor: labels.map((_, i) => PLATFORM_COLORS[i % PLATFORM_COLORS.length]), borderColor: '#FFFFFF', borderWidth: 2 }],
        },
        options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 }, color: '#5B6B66', boxWidth: 9, padding: 12 } } } },
      });
    }

    if (historyCanvas.current) {
      destroy('history');
      const labels = snapshots.map((s) => new Date(s.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }));
      const data = snapshots.map((s) => s.total);
      chartsRef.current.history = new Chart(historyCanvas.current.getContext('2d'), {
        type: 'line',
        data: { labels, datasets: [{ data, borderColor: '#1F6F5C', backgroundColor: 'rgba(31,111,92,0.08)', fill: true, tension: 0.25, pointRadius: 3, pointBackgroundColor: '#1F6F5C' }] },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { callback: (v) => fmt(v), font: { family: 'IBM Plex Mono', size: 10 }, color: '#5B6B66' }, grid: { color: '#D8DDDA' } },
            x: { ticks: { font: { family: 'IBM Plex Mono', size: 10 }, color: '#5B6B66' }, grid: { display: false } },
          },
        },
      });
    }
  }, [holdings, snapshots, loading]);

  if (loading) {
    return <div className="app"><p className="note">Cargando…</p></div>;
  }

  const t = computeTotals(holdings);
  const lastSnap = snapshots.length ? snapshots[snapshots.length - 1].total : null;
  const delta = lastSnap !== null ? t.liquidTotal - lastSnap : null;
  const deltaPct = lastSnap ? (delta / lastSnap) * 100 : 0;

  return (
    <div className="app">
      <div className="ticker">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="ticker-eyebrow">Patrimonio total · líquido + invertido</p>
          <button className="logout-link" onClick={logout}>cerrar sesión</button>
        </div>
        <div className="ticker-row">
          <div className="ticker-total">{fmt(t.liquidTotal)}</div>
          <div className={`ticker-delta ${delta === null ? 'flat' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'}`}>
            {delta === null ? 'sin histórico aún' : `${delta >= 0 ? '+' : ''}${fmt(delta)} (${delta >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%) desde última instantánea`}
          </div>
        </div>
        <div className="ticker-sub">
          <span>Efectivo: <b>{fmt(t.cash)}</b></span>
          <span>Invertido: <b>{fmt(t.invested)}</b></span>
          <span>Equity privado (Ledgy, no líquido): <b>{fmt(t.privateEq)}</b></span>
          <span>Actualizado: <b>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</b></span>
        </div>
      </div>

      <div className="tabs">
        {['resumen', 'posiciones', 'historial'].map((k) => (
          <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
            {k}
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <div className="panel">
          <div className="grid2">
            <div className="card">
              <h3>Por clase de activo</h3>
              <p className="cap">% del patrimonio líquido</p>
              <div className="chart-wrap"><canvas ref={donutClassCanvas} /></div>
            </div>
            <div className="card">
              <h3>Por plataforma</h3>
              <p className="cap">dónde vive cada euro</p>
              <div className="chart-wrap"><canvas ref={donutPlatformCanvas} /></div>
            </div>
          </div>
          <div className="card" style={{ marginTop: 18 }}>
            <h3>Desglose</h3>
            <p className="cap">valor por categoría</p>
            <ul className="summary-list">
              {Object.keys(CLASS_LABELS).map((k) => {
                const v = t.byClass[k] || 0;
                if (!v) return null;
                return (
                  <li key={k}>
                    <span><span className="swatch" style={{ background: CLASS_COLORS[k] }} />{CLASS_LABELS[k]}</span>
                    <span className="amt">{fmt(v)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card" style={{ marginTop: 18 }}>
            <h3>Notas fiscales</h3>
            <p className="cap">detectadas en tu histórico de transacciones</p>
            <ul className="summary-list">
              <li><span>Venta NQSE (6 mar 2024) — ganancia patrimonial realizada</span><span className="amt" style={{ color: 'var(--emerald)' }}>+1.474 €</span></li>
              <li><span>Dividendos IUSA cobrados (2023–2026)</span><span className="amt">335 €</span></li>
              <li><span>Vesting Ledgy: 55 acciones no vested (~102.600€ a precio actual)</span><span className="amt">tributa como salario</span></li>
            </ul>
            <p className="note">
              La venta de NQSE de marzo 2024 generó una ganancia patrimonial sujeta a IRPF que debía figurar en la Renta de 2024 — conviene confirmar que quedó incluida.
              Los dividendos de IUSA se declaran cada año como rendimiento de capital mobiliario. Las acciones de Revolut (Ledgy) tributan como rendimiento del trabajo
              por su valor de mercado en cada fecha de vesting, no como ganancia patrimonial.
            </p>
          </div>
        </div>
      )}

      {tab === 'posiciones' && (
        <div className="panel">
          {Object.keys(CLASS_LABELS).map((cls) => {
            const rows = holdings.filter((h) => h.assetClass === cls);
            if (!rows.length) return null;
            const total = rows.reduce((s, h) => s + value(h), 0);
            return (
              <div className="cat-block" key={cls}>
                <div className="cat-head"><span>{CLASS_LABELS[cls]}</span><span className="cat-total">{fmt(total)}</span></div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Plataforma</th><th>Activo</th><th>Ticker</th>
                        <th className="num">Cantidad</th><th className="num">Coste €</th><th className="num">Precio €</th><th className="num">Valor</th><th className="num">P&amp;L</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((h) => (
                        <tr key={h.id}>
                          <td><input className="cell" defaultValue={h.platform} onBlur={(e) => updateField(h.id, 'platform', e.target.value)} /></td>
                          <td><input className="cell" defaultValue={h.name} onBlur={(e) => updateField(h.id, 'name', e.target.value)} /></td>
                          <td><input className="cell" defaultValue={h.ticker} onBlur={(e) => updateField(h.id, 'ticker', e.target.value)} /></td>
                          <td className="num"><input className="cell" defaultValue={h.quantity} onBlur={(e) => updateField(h.id, 'quantity', e.target.value)} /></td>
                          <td className="num"><input className="cell" defaultValue={h.cost || ''} placeholder="—" onBlur={(e) => updateField(h.id, 'cost', e.target.value)} /></td>
                          <td className="num"><input className="cell" defaultValue={h.price} onBlur={(e) => updateField(h.id, 'price', e.target.value)} /></td>
                          <td className="num">{fmt(value(h))}</td>
                          <td className="num" style={{ color: pnlColor(h) }}>{pnlText(h)}</td>
                          <td><button className="row-del" onClick={() => deleteRow(h.id)}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="add-row" onClick={() => addRow(cls)}>+ añadir posición</button>
              </div>
            );
          })}

          <div className="card">
            <h3>Precios en vivo</h3>
            <p className="cap">CoinGecko (cripto) + Twelve Data (acciones/ETFs)</p>
            <p className="note">Los fondos (Robeco) y el equity privado (Ledgy) no tienen API pública — esos siguen siendo manuales.</p>
            <button className="btn" onClick={refreshPrices}>Actualizar precios ahora</button>
          </div>
        </div>
      )}

      {tab === 'historial' && (
        <div className="panel">
          <div className="card">
            <h3>Evolución del patrimonio</h3>
            <p className="cap">cada instantánea que guardes queda aquí, sincronizada entre tus dispositivos</p>
            <div className="chart-wrap" style={{ height: 280 }}><canvas ref={historyCanvas} /></div>
            <button className="btn" style={{ margin: '16px 0' }} onClick={saveSnapshot}>Guardar instantánea de hoy</button>
          </div>
          <div className="card">
            <h3>Instantáneas guardadas</h3>
            {snapshots.length === 0 && <p className="note">Aún no has guardado ninguna instantánea.</p>}
            {[...snapshots].reverse().map((s, i) => (
              <div className="snap-row" key={i}>
                <span>{new Date(s.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>{fmt(s.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
