import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, QuitProfile } from '@shared/types';
interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateProfile: (profile: QuitProfile) => void;
  logout: () => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateProfile: (profile) => set((state) => {
        if (!state.user) return {};
        return { user: { ...state.user, profile } };
      }),
      logout: () => set({ user: null }),
    }),
    { 
      name: 'exhale-storage',
      version: 1,
    }
  )
);