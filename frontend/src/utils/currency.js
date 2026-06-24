export const EXCHANGE_RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.51,
  JPY: 156.4,
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

export const CURRENCY_NAMES = {
  INR: 'INR (₹)',
  USD: 'USD ($)',
  EUR: 'EUR (€)',
  GBP: 'GBP (£)',
  CAD: 'CAD (C$)',
  AUD: 'AUD (A$)',
  JPY: 'JPY (¥)',
};

export const convertAmount = (amount, from = 'USD', to = 'INR') => {
  if (typeof amount !== 'number') return amount;
  const rateFrom = EXCHANGE_RATES[from] || 1;
  const amountInUSD = amount / rateFrom;
  const rateTo = EXCHANGE_RATES[to] || 1;
  return Math.round(amountInUSD * rateTo);
};

export const formatCurrency = (amount, from = 'USD', to = 'INR') => {
  const converted = convertAmount(amount, from, to);
  if (typeof converted !== 'number') return converted;
  const symbol = CURRENCY_SYMBOLS[to] || to;
  return `${symbol}${converted.toLocaleString()}`;
};

export const parseAndConvertCost = (costStr, baseCurrency = 'USD', targetCurrency = 'INR') => {
  if (!costStr) return '';
  if (typeof costStr !== 'string') return costStr;
  
  // Find all matches of numbers (including decimals and commas) in the string
  const numMatch = costStr.match(/[\d,.]+/);
  if (!numMatch) return costStr;
  
  const rawNum = parseFloat(numMatch[0].replace(/,/g, ''));
  if (isNaN(rawNum)) return costStr;
  
  // Try to determine the source currency from the string
  let sourceCurrency = baseCurrency;
  if (costStr.includes('$')) sourceCurrency = 'USD';
  else if (costStr.includes('€') || costStr.toLowerCase().includes('eur')) sourceCurrency = 'EUR';
  else if (costStr.includes('£') || costStr.toLowerCase().includes('gbp')) sourceCurrency = 'GBP';
  else if (costStr.includes('₹') || costStr.toLowerCase().includes('inr')) sourceCurrency = 'INR';
  else if (costStr.includes('C$') || costStr.toLowerCase().includes('cad')) sourceCurrency = 'CAD';
  else if (costStr.includes('A$') || costStr.toLowerCase().includes('aud')) sourceCurrency = 'AUD';
  else if (costStr.includes('¥') || costStr.toLowerCase().includes('jpy')) sourceCurrency = 'JPY';
  
  const converted = convertAmount(rawNum, sourceCurrency, targetCurrency);
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;
  
  // Reconstruct string while keeping suffix (e.g. "per person")
  const suffix = costStr.replace(numMatch[0], '').replace(/[$\u20AC\u00A3\u20B9\u00A5]/g, '').trim();
  
  return `${symbol}${converted.toLocaleString()}${suffix ? ` ${suffix}` : ''}`;
};
