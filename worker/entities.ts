import { IndexedEntity } from "./core-utils";
import type { User, JournalEntry } from "@shared/types";
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
  async updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): Promise<User> {
    return this.mutate(s => {
      const journal = s.journal || [];
      const index = journal.findIndex(e => e.id === entryId);
      if (index === -1) return s; // Entry not found, return current state
      const updatedJournal = [...journal];
      updatedJournal[index] = { ...updatedJournal[index], ...updates };
      return {
        ...s,
        journal: updatedJournal
      };
    });
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
  async importData(data: Partial<User>): Promise<User> {
    return this.mutate(current => {
      // Security: Force preserve the original ID and Email of the entity
      // This prevents a user from overwriting their identity with someone else's backup
      const safeData = {
        ...data,
        id: current.id,
        email: current.email
      };
      return {
        ...current,
        ...safeData
      };
    });
  }
}