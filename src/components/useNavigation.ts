// Simple navigation hook for handling navigation events
import { useEffect } from 'react';

export function useNavigate() {
  return (page: string) => {
    const event = new CustomEvent('navigate', { detail: page });
    window.dispatchEvent(event);
  };
}

export function useNavigationListener(callback: (page: string) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail);
    };

    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [callback]);
}
