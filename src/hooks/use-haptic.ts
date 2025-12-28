import { useCallback } from 'react';
type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
export function useHaptic() {
  const vibrate = useCallback((type: HapticType = 'medium') => {
    // Check if Vibration API is supported
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(40);
          break;
        case 'success':
          navigator.vibrate([10, 30, 10]);
          break;
        case 'warning':
          navigator.vibrate([30, 50, 10]);
          break;
        case 'error':
          navigator.vibrate([50, 50, 50]);
          break;
        default:
          navigator.vibrate(20);
      }
    } catch (e) {
      // Ignore errors if vibration fails (e.g. user interaction required or not supported)
      console.warn('Haptic feedback failed', e);
    }
  }, []);
  return { vibrate };
}