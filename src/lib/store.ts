import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, QuitProfile } from '@shared/types';
import { GUEST_USER } from './constants';
interface AppState {
  user: User | null;
  isGuest: boolean;
  setUser: (user: User | null) => void;
  updateProfile: (profile: QuitProfile) => void;
  loginAsGuest: () => void;
  logout: () => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,
      setUser: (user) => set({ user, isGuest: false }),
      updateProfile: (profile) => set((state) => {
        if (!state.user) return {};
        // If guest, update locally but it won't persist to backend (read-only mostly, but allow local tweaks for demo feel)
        return { user: { ...state.user, profile } };
      }),
      loginAsGuest: () => set({ user: GUEST_USER, isGuest: true }),
      logout: () => set({ user: null, isGuest: false }),
    }),
    {
      name: 'exhale-storage',
      version: 2, // Increment version for migration if needed, though simple addition is usually fine
    }
  )
);