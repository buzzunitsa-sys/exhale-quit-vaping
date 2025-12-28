export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface QuitProfile {
  quitDate: string; // ISO string
  costPerUnit: number;
  unitsPerWeek: number;
  currency: string;
  motivation?: string;
}
export interface User {
  id: string; // email
  email: string;
  name?: string;
  profile?: QuitProfile;
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