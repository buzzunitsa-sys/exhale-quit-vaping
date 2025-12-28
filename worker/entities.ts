import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, JournalEntry } from "@shared/types";
// USER ENTITY: one DO instance per user (using email as ID)
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = {
    id: "",
    email: "",
    createdAt: 0
  };
  async addJournalEntry(entry: JournalEntry): Promise<User> {
    return this.mutate(s => ({
      ...s,
      journal: [entry, ...(s.journal || [])] // Prepend new entry
    }));
  }
  async removeJournalEntry(entryId: string): Promise<User> {
    return this.mutate(s => ({
      ...s,
      journal: (s.journal || []).filter(e => e.id !== entryId)
    }));
  }
  async resetProgress(): Promise<User> {
    return this.mutate(s => {
      const now = new Date().toISOString();
      return {
        ...s,
        journal: [], // Clear journal
        profile: s.profile ? {
          ...s.profile,
          quitDate: now // Reset quit date to now
        } : undefined,
        pledgeStreak: 0,
        lastPledgeDate: undefined
      };
    });
  }
  async submitPledge(date: string): Promise<User> {
    return this.mutate(s => {
      const lastDate = s.lastPledgeDate;
      // If already pledged today (or passed same date), return current state
      if (lastDate === date) return s;
      let newStreak = 1;
      if (lastDate) {
        // Calculate difference in days
        const d1 = new Date(lastDate);
        const d2 = new Date(date);
        // Reset time part to ensure pure date comparison (though input should be YYYY-MM-DD)
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // Consecutive day
          newStreak = (s.pledgeStreak || 0) + 1;
        } else if (diffDays === 0) {
           // Same day (redundant check but safe)
           return s;
        }
        // If diffDays > 1, streak resets to 1
      }
      return {
        ...s,
        lastPledgeDate: date,
        pledgeStreak: newStreak
      };
    });
  }
}
// CHAT BOARD ENTITY: Kept for template compatibility
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}