export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface QuitProfile {
  quitDate: string; // ISO string
  costPerUnit: number;
  unitsPerWeek: number;
  puffsPerUnit?: number; // New field for cost per puff calculation
  dailyLimit?: number; // New field for tapering goal
  currency: string;
  motivation?: string;
  nicotineStrength?: number; // mg/ml (e.g., 50 for 5%, 20 for 2%)
  volumePerUnit?: number; // ml per pod/device (e.g., 0.7, 2.0, 10.0)
}
export interface JournalEntry {
  id: string;
  timestamp: number;
  intensity: number; // 1-10
  trigger: string; // e.g., "Stress", "Boredom", "Social"
  note?: string;
  puffs?: number; // Actual puffs taken (slips)
}
export interface User {
  id: string; // email
  email: string;
  name?: string;
  profile?: QuitProfile;
  journal?: JournalEntry[];
  createdAt: number;
}
// Keeping Chat types for compatibility with existing template structure if needed,
// though we aren't using them for the main features yet.
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}