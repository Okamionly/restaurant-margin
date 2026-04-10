// Currency formatting utility for RestauMargin
// Reads the user's chosen currency from localStorage (restaumargin_settings)

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '\u20ac',   // €
  USD: '$',
  GBP: '\u00a3',   // £
  MAD: 'DH',
  CHF: 'CHF',
};

/** Return the currency code saved in settings, default EUR */
export function getCurrency(): string {
  try {
    const raw = localStorage.getItem('restaumargin_settings');
    if (raw) {
      const s = JSON.parse(raw);
      if (s.currency && typeof s.currency === 'string') return s.currency;
    }
  } catch {
    // ignore
  }
  return 'EUR';
}

/** Return the symbol for a given currency code */
export function getCurrencySymbol(currency?: string): string {
  const code = currency || getCurrency();
  return CURRENCY_SYMBOLS[code] || code;
}

/**
 * Format an amount with the correct currency symbol.
 * Examples:
 *   formatCurrency(12.5)         => "12.50 €"
 *   formatCurrency(12.5, 'MAD')  => "12.50 DH"
 *   formatCurrency(12.5, 'USD')  => "12.50 $"
 */
export function formatCurrency(amount: number, currency?: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${(Number(amount) || 0).toFixed(2)} ${symbol}`;
}

/**
 * Return just the symbol string for suffix usage (e.g. AnimatedNumber suffix).
 * Example: currencySuffix() => " €"
 */
export function currencySuffix(currency?: string): string {
  const symbol = getCurrencySymbol(currency);
  return ` ${symbol}`;
}
