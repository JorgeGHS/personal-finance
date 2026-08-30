export const CLASS_LABELS = {
  cash: 'Efectivo',
  equity: 'Renta variable',
  crypto: 'Cripto',
  fund: 'Fondos',
  privateEquity: 'Equity privado',
};

export const CLASS_COLORS = {
  cash: '#B08A3E',
  equity: '#1F6F5C',
  crypto: '#A6503A',
  fund: '#4A6670',
  privateEquity: '#8C8577',
};

export const PLATFORM_COLORS = ['#1F6F5C', '#A6503A', '#B08A3E', '#4A6670', '#8C8577', '#6B4F6B', '#3D5A80'];

// CoinGecko ids used by /api/prices for live crypto quotes
export const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  NANO: 'nano',
  BCH: 'bitcoin-cash',
  EOS: 'eos',
  LTC: 'litecoin',
  LINK: 'chainlink',
  DOT: 'polkadot',
  UNI: 'uniswap',
  XTZ: 'tezos',
  XLM: 'stellar',
  SHIB: 'shiba-inu',
};

// Reconciled with real transaction history (Revolut Investments + Crypto, Kraken, eToro, Fidelity, Sabadell, Ledgy)
export const SEED_HOLDINGS = [
  { id: 'vuaa', platform: 'Revolut', assetClass: 'equity', name: 'Vanguard S&P500 Acc UCITS ETF', ticker: 'VUAA', quantity: 320.31, price: 127.98, cost: 97.20 },
  { id: 'nqse', platform: 'Revolut', assetClass: 'equity', name: 'iShares NASDAQ 100 Acc ETF', ticker: 'NQSE', quantity: 1296.28, price: 17.05, cost: 11.69 },
  { id: 'iusa', platform: 'Revolut', assetClass: 'equity', name: 'iShares Core S&P 500 Dist ETF', ticker: 'IUSA', quantity: 243.01, price: 65.84, cost: 44.03 },
  { id: 'spcx', platform: 'Revolut', assetClass: 'equity', name: 'SpaceX', ticker: 'SPCX', quantity: 3, price: 120, cost: 125.55 },
  { id: 'onon', platform: 'Revolut', assetClass: 'equity', name: 'On Holding AG', ticker: 'ONON', quantity: 3.57, price: 25.21, cost: 36.30 },
  { id: 'rgti', platform: 'Revolut', assetClass: 'equity', name: 'Rigetti Computing', ticker: 'RGTI', quantity: 2.48908296, price: 15.93, cost: 15.93 },
  { id: 'btc-rev', platform: 'Revolut', assetClass: 'crypto', name: 'Bitcoin', ticker: 'BTC', quantity: 0.055, price: 69090, cost: 27272.73 },
  { id: 'shib-rev', platform: 'Revolut', assetClass: 'crypto', name: 'Shiba Inu', ticker: 'SHIB', quantity: 975185, price: 0.00000378, cost: 0.00000378 },
  { id: 'cash-rev', platform: 'Revolut', assetClass: 'cash', name: 'Flexible Account (2.35% APY)', ticker: 'EUR', quantity: 1, price: 29596.26 },
  { id: 'btc-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Bitcoin', ticker: 'BTC', quantity: 0.28146, price: 68210, cost: 35158.9 },
  { id: 'eth-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Ethereum', ticker: 'ETH', quantity: 1.67436, price: 2150, cost: 1472.68 },
  { id: 'xrp-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'XRP', ticker: 'XRP', quantity: 25.28, price: 1.225, cost: 0.3956 },
  { id: 'ada-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Cardano', ticker: 'ADA', quantity: 30.163383, price: 0.182, cost: 0.9604 },
  { id: 'doge-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Dogecoin', ticker: 'DOGE', quantity: 579.60, price: 0.2761, cost: 0.2761 },
  { id: 'nano-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Nano', ticker: 'NANO', quantity: 3.39491, price: 4.4183, cost: 4.4183 },
  { id: 'bch-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Bitcoin Cash', ticker: 'BCH', quantity: 0.03414, price: 439.4, cost: 439.4 },
  { id: 'eos-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'EOS', ticker: 'EOS', quantity: 3.07046, price: 3.257, cost: 3.257 },
  { id: 'ltc-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Litecoin', ticker: 'LTC', quantity: 0.12266, price: 163.05, cost: 163.05 },
  { id: 'link-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Chainlink', ticker: 'LINK', quantity: 1.03063, price: 24.257, cost: 24.257 },
  { id: 'dot-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Polkadot', ticker: 'DOT', quantity: 0.66953562, price: 29.874, cost: 29.874 },
  { id: 'uni-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Uniswap', ticker: 'UNI', quantity: 0.34049, price: 29.375, cost: 29.375 },
  { id: 'xtz-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Tezos', ticker: 'XTZ', quantity: 2.797097, price: 3.575, cost: 3.575 },
  { id: 'xlm-kraken', platform: 'Kraken', assetClass: 'crypto', name: 'Stellar Lumens', ticker: 'XLM', quantity: 28.50814, price: 0.3508, cost: 0.3508 },
  { id: 'orcl-fid', platform: 'Fidelity', assetClass: 'equity', name: 'Oracle Corp.', ticker: 'ORCL', quantity: 58, price: 128.09, cost: 61.63 },
  { id: 'btc-etoro', platform: 'eToro', assetClass: 'crypto', name: 'Bitcoin', ticker: 'BTC', quantity: 0.012438, price: 68904.6, cost: 31346.68 },
  { id: 'eth-etoro', platform: 'eToro', assetClass: 'crypto', name: 'Ethereum', ticker: 'ETH', quantity: 0.181695, price: 2161.66, cost: 2145.60 },
  { id: 'meta-etoro', platform: 'eToro', assetClass: 'equity', name: 'Meta Platforms', ticker: 'META', quantity: 3.25612, price: 492.57, cost: 210.19 },
  { id: 'rivn-etoro', platform: 'eToro', assetClass: 'equity', name: 'Rivian', ticker: 'RIVN', quantity: 62.0291, price: 14.35, cost: 28.40 },
  { id: 'robeco-sab', platform: 'Sabadell', assetClass: 'fund', name: 'Robeco Global Consumer Trends D EUR Acc', ticker: 'ROBGCT', quantity: 240.77, price: 402.34, cost: 248.53 },
  { id: 'ledgy-rev', platform: 'Ledgy', assetClass: 'privateEquity', name: 'Revolut stock options (vested)', ticker: 'RVLT', quantity: 79, price: 1865.7 },
];

export function value(h) {
  return (Number(h.quantity) || 0) * (Number(h.price) || 0);
}

export function pnl(h) {
  if (!h.cost) return null;
  return (Number(h.price) - Number(h.cost)) * (Number(h.quantity) || 0);
}

export function computeTotals(holdings) {
  const byClass = {};
  const byPlatform = {};
  let cash = 0, invested = 0, privateEq = 0, liquidTotal = 0;
  holdings.forEach((h) => {
    const v = value(h);
    byClass[h.assetClass] = (byClass[h.assetClass] || 0) + v;
    byPlatform[h.platform] = (byPlatform[h.platform] || 0) + v;
    if (h.assetClass === 'privateEquity') {
      privateEq += v;
    } else {
      liquidTotal += v;
      if (h.assetClass === 'cash') cash += v;
      else invested += v;
    }
  });
  return { byClass, byPlatform, cash, invested, privateEq, liquidTotal };
}

export function fmt(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
}
