export interface Quote {
  text: string;
  author: string;
}
export const QUOTES: Quote[] = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Recovery is about progression, not perfection.", author: "Unknown" },
  { text: "Every smokeless day is a victory.", author: "Unknown" },
  { text: "You are stronger than your cravings.", author: "Unknown" },
  { text: "Breathe in confidence, exhale doubt.", author: "Unknown" },
  { text: "Your body is healing every second you stay free.", author: "Unknown" },
];
export function getDailyQuote(): Quote {
  // Use the current date to select a quote so it changes every 24h but stays consistent for the day
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % QUOTES.length;
  return QUOTES[index];
}