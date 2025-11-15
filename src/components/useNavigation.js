// Simple navigation hook for handling navigation events
import { useEffect } from 'react';

export function useNavigate() {
  return (page) => {
    const event = new CustomEvent('navigate', { detail: page });
    window.dispatchEvent(event);
  };
}

export function useNavigationListener(callback) {
  useEffect(() => {
    const handler = (e) => {
      const customEvent = e;
      callback(customEvent.detail);
    };

    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [callback]);
}
