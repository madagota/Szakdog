# AudioA – A/B Testing Platform for Microinteraction Research

> **Academic research project** | React · TypeScript · Framer Motion · Vite · Tailwind CSS

---
## Website's link
https://audioa-webshop.vercel.app/

## Overview

AudioA is a fully functional e-commerce webshop built as part of my undergraduate thesis research. The platform was designed to investigate the effect of microinteractions on user experience and purchasing behavior through a controlled A/B experiment.

The project simulates a premium headphone webshop with two identical versions — one static (A), one enriched with microinteractions (B) — randomly assigned to participants via a localStorage-based splitting mechanism.

---

## What I Built

A production-ready React + TypeScript SPA featuring:

- **A/B test infrastructure** with persistent user assignment via localStorage
- **Animated version (B)** with 15+ distinct microinteractions built in Framer Motion
- **Static version (A)** as a pixel-perfect control group
- **Full purchase flow** — product browsing → product detail → cart → checkout → order confirmation
- **Form validation** with real-time field feedback (green checkmarks, animated error messages)
- **Responsive design** — mobile bottom sheet cart, touch swipe gallery, adaptive layout
- **Google Analytics 4** event tracking for behavioral data collection
- **Custom SVG animation** — headphone cable progress indicator in checkout

---

## Technical Highlights

### A/B Split Logic

```typescript
const [variant] = useState<Variant>(() => {
  const stored = localStorage.getItem('ab_test_version');
  if (stored === 'A' || stored === 'B') return stored;
  const newVariant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem('ab_test_version', newVariant);
  return newVariant;
});
```

Synchronous lazy initializer ensures no flash of wrong version on load. Persistent assignment means returning users always see the same variant.

### Microinteraction Examples

**Parallax scroll effect**
```typescript
const { scrollY } = useScroll();
const heroImageY = useTransform(scrollY, [0, 400], [0, 60]);
```

**Animated price counter using IntersectionObserver**
```typescript
const observer = new IntersectionObserver(
  ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
  { threshold: 0.5 }
);
```

**Cart icon bounce on item add**
```typescript
animate={cartBounce ? { scale: [1, 1.22, 0.95, 1] } : {}}
```

**SVG path animation for checkout progress**
```typescript
<motion.path
  initial={{ pathLength: 0 }}
  animate={{ pathLength: progress / 100 }}
  transition={{ duration: 0.8, ease: 'easeInOut' }}
/>
```

---

## Project Structure

```
src/
├── AppA.tsx                  # Static control version
├── AppB.tsx                  # Animated experimental version
├── App.tsx                   # A/B split entry point
└── components/
    ├── HeaderPro.tsx         # Shared header (animated/static prop)
    ├── FooterPro.tsx         # Footer
    ├── Checkout.tsx          # Multi-step checkout form
    ├── ProductDetailsAnimated.tsx
    ├── ProductDetailsStatic.tsx
    ├── HeadphoneCableProgress.tsx  # Custom SVG progress indicator
    └── SkeletonLoader.tsx
```

---

## Microinteractions Implemented (B version)

| Location | Microinteraction |
|---|---|
| Page load | Staggered hero section fade-in |
| Hero section | Parallax image scroll, pulsing CTA ring, scroll indicator |
| Product cards | Price count-up animation, hover overlay, add-to-cart checkmark feedback |
| Cart icon | Bounce animation on item add |
| Toast notification | Slide-in confirmation message |
| Cart panel | Spring-physics open/close, mobile bottom sheet |
| Product gallery | Fade transition between images, touch swipe |
| Checkout form | Real-time validation feedback, animated error messages |
| Checkout steps | Horizontal slide transition between steps |
| Checkout progress | Animated SVG cable drawing |
| Order complete | Spring-bounce checkmark, staggered text reveal |
| Sticky bar | Scroll-triggered bottom purchase bar |
| Scroll | Back-to-top button with animated appearance |

---

## What I Learned

- Architecting a **controlled experiment** in a React codebase while keeping the two variants DRY through shared components and a single boolean prop
- Building **production-quality animations** with Framer Motion — spring physics, `AnimatePresence`, `pathLength`, `useScroll`/`useTransform`
- **Mobile-first responsive behavior** — same component, different UX pattern based on viewport (dropdown vs bottom sheet)
- Avoiding common React pitfalls — no components defined inside render, no unnecessary `setState` in effects, proper cleanup of timers and observers
- Integrating **GA4 event tracking** for quantitative behavioral research

---

## Running Locally

```bash
git clone https://github.com/madagota/Szakdog
cd AudioA-webshop
npm install
npm run dev
```

To reset your A/B variant assignment, open DevTools → Application → Local Storage → delete `ab_test_version`.

---

## Research Context

This platform was developed as the empirical foundation of my bachelor's thesis:

> *"The Effect of Microinteractions on User Experience in E-commerce Interfaces"*

Participants were randomly assigned to one version and asked to complete a simulated purchase. Post-task survey data and GA4 behavioral metrics were collected and analyzed to measure the impact of microinteractions on perceived usability, trust, and engagement.

---

*Built by Madarász Ágota — 2025/2026*
