export interface Country {
  code: string;
  name: string;
  currency: string; // Symbol
  currencyCode: string; // ISO code
}
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', currency: '$', currencyCode: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: '£', currencyCode: 'GBP' },
  { code: 'ZA', name: 'South Africa', currency: 'R', currencyCode: 'ZAR' },
  { code: 'CA', name: 'Canada', currency: '$', currencyCode: 'CAD' },
  { code: 'AU', name: 'Australia', currency: '$', currencyCode: 'AUD' },
  { code: 'EU', name: 'Europe (Eurozone)', currency: '€', currencyCode: 'EUR' },
  { code: 'NZ', name: 'New Zealand', currency: '$', currencyCode: 'NZD' },
  { code: 'IN', name: 'India', currency: '₹', currencyCode: 'INR' },
  { code: 'JP', name: 'Japan', currency: '¥', currencyCode: 'JPY' },
  { code: 'CN', name: 'China', currency: '¥', currencyCode: 'CNY' },
  { code: 'BR', name: 'Brazil', currency: 'R$', currencyCode: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: '$', currencyCode: 'MXN' },
  { code: 'RU', name: 'Russia', currency: '₽', currencyCode: 'RUB' },
  { code: 'KR', name: 'South Korea', currency: '₩', currencyCode: 'KRW' },
  { code: 'CH', name: 'Switzerland', currency: 'Fr', currencyCode: 'CHF' },
  { code: 'SE', name: 'Sweden', currency: 'kr', currencyCode: 'SEK' },
  { code: 'NO', name: 'Norway', currency: 'kr', currencyCode: 'NOK' },
  { code: 'DK', name: 'Denmark', currency: 'kr', currencyCode: 'DKK' },
  { code: 'SG', name: 'Singapore', currency: '$', currencyCode: 'SGD' },
  { code: 'MY', name: 'Malaysia', currency: 'RM', currencyCode: 'MYR' },
  { code: 'TH', name: 'Thailand', currency: '฿', currencyCode: 'THB' },
  { code: 'ID', name: 'Indonesia', currency: 'Rp', currencyCode: 'IDR' },
  { code: 'PH', name: 'Philippines', currency: '₱', currencyCode: 'PHP' },
  { code: 'VN', name: 'Vietnam', currency: '₫', currencyCode: 'VND' },
  { code: 'TR', name: 'Turkey', currency: '₺', currencyCode: 'TRY' },
  { code: 'SA', name: 'Saudi Arabia', currency: '﷼', currencyCode: 'SAR' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'د.إ', currencyCode: 'AED' },
  { code: 'IL', name: 'Israel', currency: '₪', currencyCode: 'ILS' },
  { code: 'NG', name: 'Nigeria', currency: '₦', currencyCode: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KSh', currencyCode: 'KES' },
];
export const DEFAULT_COUNTRY = COUNTRIES[0]; // US