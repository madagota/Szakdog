import { useEffect, useState } from 'react';
import AppA from './AppA';
import AppB from './AppB';

type Variant = 'A' | 'B';

export default function App() {
  // Lazy initializer: prefer stored value, otherwise pick randomly
  const [variant] = useState<Variant>(() => {
    try {
      const stored = localStorage.getItem('ab_test_version');
      if (stored === 'A' || stored === 'B') return stored;
    } catch {
      // ignore localStorage errors (e.g. SSR or privacy modes)
    }
    return Math.random() < 0.5 ? 'A' : 'B';
  });

  // Persist the chosen variant to localStorage once. Intentionally
  // omit `variant` from deps so this effect only runs once and
  // doesn't trigger exhaustive-deps ESLint warnings.
  useEffect(() => {
    try {
      const existing = localStorage.getItem('ab_test_version');
      if (existing !== 'A' && existing !== 'B') {
        localStorage.setItem('ab_test_version', variant);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //return variant === 'A' ? <AppA /> : <AppB />;
  return <AppB />; // B verzió: animációval 
}