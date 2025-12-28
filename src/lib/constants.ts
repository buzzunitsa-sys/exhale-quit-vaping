import type { User, QuitProfile, JournalEntry } from '@shared/types';
import { subDays, subHours } from 'date-fns';
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
// Helper to generate mock journal entries
const generateMockJournal = (): JournalEntry[] => {
  const now = new Date();
  const entries: JournalEntry[] = [];
  // Create some entries over the last few days
  const triggers = ["Stress", "Boredom", "Coffee", "Social Pressure"];
  for (let i = 0; i < 12; i++) {
    const date = subHours(now, i * 14 + Math.random() * 5); // Spread out
    entries.push({
      id: `guest-entry-${i}`,
      timestamp: date.getTime(),
      intensity: Math.floor(Math.random() * 6) + 3, // 3-8 intensity
      trigger: triggers[Math.floor(Math.random() * triggers.length)],
      puffs: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0, // Occasional slips
      note: Math.random() > 0.5 ? "Feeling a bit anxious." : undefined
    });
  }
  return entries;
};
export const GUEST_USER: User = {
  id: 'guest',
  email: 'guest@exhale.app',
  createdAt: subDays(new Date(), 14).getTime(), // Joined 2 weeks ago
  pledgeStreak: 5,
  lastPledgeDate: subDays(new Date(), 0).toISOString().split('T')[0], // Pledged today
  profile: {
    quitDate: subDays(new Date(), 7).toISOString(), // Quit 1 week ago
    costPerUnit: 20,
    unitsPerWeek: 2,
    puffsPerUnit: 300,
    mlPerPuff: 0.05,
    dailyLimit: 15,
    currency: 'USD',
    country: 'US',
    nicotineStrength: 50,
    volumePerUnit: 2.0,
    savingsGoal: {
      name: "New Headphones",
      cost: 250
    }
  },
  journal: generateMockJournal()
};