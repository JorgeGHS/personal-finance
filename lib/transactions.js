// Movimientos reales de capital hacia cuentas de inversion, reconstruidos a partir
// del historial de transacciones (Revolut Investments/Crypto, Kraken, eToro).
// NO incluye Oracle (RSU - compensacion, sin movimiento de caja) ni Ledgy (stock
// options - compensacion, sin movimiento de caja). Si incluye Sabadell (dinero real
// que entro en la cuenta, aunque fuera un regalo) con fecha aproximada (30 cumpleanos).
export const CONTRIBUTIONS = [
  { date: '2021-03-06', amount: 1806.90, label: 'Kraken: BTC + ETH' },
  { date: '2021-03-08', amount: 180.00, label: 'Kraken: NANO, BCH, EOS, XRP, DOGE, LTC, LINK, ADA, DOT, UNI, XTZ, XLM' },
  { date: '2021-03-11', amount: 170.00, label: 'Kraken: ETH' },
  { date: '2021-03-16', amount: 5000.00, label: 'Kraken: BTC + ETH' },
  { date: '2021-05-11', amount: 150.00, label: 'Kraken: DOGE' },
  { date: '2021-07-10', amount: 5083.00, label: 'Kraken: BTC' },
  { date: '2022-01-11', amount: 447.60, label: 'eToro: RIVN' },
  { date: '2022-01-18', amount: 453.00, label: 'eToro: RIVN' },
  { date: '2022-01-21', amount: 389.82, label: 'eToro: BTC' },
  { date: '2022-01-22', amount: 389.82, label: 'eToro: ETH' },
  { date: '2022-02-03', amount: 684.33, label: 'eToro: META' },
  { date: '2022-03-07', amount: 550.90, label: 'eToro: RIVN' },
  { date: '2023-03-03', amount: 599.96, label: 'eToro: RIVN' },
  { date: '2023-04-19', amount: 1500.00, label: 'Revolut Crypto: BTC' },
  { date: '2023-06-29', amount: 3000.00, label: 'Revolut: NQSE' },
  { date: '2023-07-18', amount: 3000.00, label: 'Revolut: NQSE' },
  { date: '2023-08-30', amount: 3000.00, label: 'Revolut: NQSE' },
  { date: '2023-10-05', amount: 6000.00, label: 'Revolut: IUSA' },
  { date: '2024-03-06', amount: -10487.44, label: 'Revolut: venta NQSE retirada a Personal' },
  { date: '2024-05-26', amount: 59837.77, label: 'Sabadell: fondo Robeco (fecha aproximada)' },
  { date: '2024-08-01', amount: 41.06, label: 'Revolut: IUSA' },
  { date: '2024-08-19', amount: 14709.81, label: 'Revolut: IUSA + NQSE' },
  { date: '2025-01-02', amount: 69.18, label: 'Revolut: NQSE' },
  { date: '2025-01-30', amount: 2500.00, label: 'Revolut: VUAA' },
  { date: '2025-03-11', amount: 5000.00, label: 'Revolut: NQSE' },
  { date: '2025-04-08', amount: 19034.97, label: 'Revolut: VUAA + IUSA' },
  { date: '2025-09-01', amount: 5000.00, label: 'Revolut: VUAA' },
  { date: '2025-12-01', amount: 56.90, label: 'Revolut: ONON' },
  { date: '2026-01-11', amount: 42.07, label: 'Revolut: ONON' },
  { date: '2026-03-06', amount: 2500.00, label: 'Revolut: VUAA' },
  { date: '2026-04-06', amount: 30.64, label: 'Revolut: ONON' },
  { date: '2026-06-12', amount: 377.00, label: 'Revolut: SPCX' },
  { date: '2026-06-16', amount: 2133.00, label: 'Revolut: VUAA' },
  { date: '2026-08-13', amount: 39.66, label: 'Revolut: RGTI' },
];

export function cumulativeSeries() {
  const sorted = [...CONTRIBUTIONS].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  return sorted.map((c) => {
    running += c.amount;
    return { date: c.date, total: running };
  });
}

export function totalContributed() {
  return CONTRIBUTIONS.reduce((s, c) => s + c.amount, 0);
}
