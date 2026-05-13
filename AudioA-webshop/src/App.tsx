import { useState } from 'react';
import AppA from './AppA';
import AppB from './AppB';

type Variant = 'A' | 'B';

export default function App() {
  const [variant] = useState<Variant>(() => {
    try {
      const stored = localStorage.getItem('ab_test_version');
      if (stored === 'A' || stored === 'B') return stored;
    } catch {}
    const newVariant = Math.random() < 0.5 ? 'A' : 'B';
    try {
      localStorage.setItem('ab_test_version', newVariant);
    } catch {}
    return newVariant;
  });

  return variant === 'A' ? <AppA /> : <AppB />;
}