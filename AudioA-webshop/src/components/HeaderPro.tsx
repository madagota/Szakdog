import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface HeaderProProps {
  cartItems: CartItem[];
  cartTotal: number;
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
  onLogoClick: () => void;
  animated?: boolean;
  onNavigateSection?: (section: string) => void;
  currentPage?: 'home' | 'product' | 'checkout';
  cartBounce?: boolean;
}

// ─── Shared CartPanel ──────────────────────────────────────────────────────────
function CartPanel({
  cartItems,
  cartTotal,
  cartCount,
  onRemoveFromCart,
  onUpdateQuantity,
  onCheckout,
  setCartOpen,
  animated,
}: {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
  setCartOpen: (open: boolean) => void;
  animated: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">Kosár</h3>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {cartCount} db
          </span>
        </div>
        <button
          onClick={() => setCartOpen(false)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items */}
      <div className="p-4 overflow-y-auto flex-1" style={{ maxHeight: 340 }}>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
            <div className="text-gray-500 mt-3 font-semibold">A kosarad üres.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <div className="font-semibold text-sm">{item.name}</div>
                  </div>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">
                    RON {item.price * item.quantity}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      −
                    </button>
                    <div className="w-7 text-center text-sm font-semibold">{item.quantity}</div>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Összesen</span>
            <span className="text-lg font-bold">RON {cartTotal}</span>
          </div>

          {animated ? (
            <motion.button
              onClick={() => { onCheckout(); setCartOpen(false); }}
              className="w-full bg-black text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Lock className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Tovább a fizetéshez</span>
              <motion.div
                className="absolute inset-0 bg-gray-800"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
              />
            </motion.button>
          ) : (
            <button
              onClick={() => { onCheckout(); setCartOpen(false); }}
              className="w-full bg-black text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Tovább a fizetéshez</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function HeaderPro({
  cartItems,
  cartTotal,
  onRemoveFromCart,
  onUpdateQuantity,
  onCheckout,
  isCartOpen,
  setCartOpen,
  cartCount,
  onLogoClick,
  animated = false,
  onNavigateSection,
  cartBounce = false,
}: HeaderProProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [effectiveBounce, setEffectiveBounce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prevCartCount = useRef(cartCount);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Detect mobile ────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Cart bounce on add ───────────────────────────────────────────────────────
  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setEffectiveBounce(true);
      const timer = setTimeout(() => setEffectiveBounce(false), 400);
      prevCartCount.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  // ── Close cart on outside click (desktop dropdown only) ──────────────────────
  useEffect(() => {
    if (!isCartOpen || isMobile) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-cart-area]')) setCartOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isCartOpen, isMobile, setCartOpen]);

  // ── Nav links ────────────────────────────────────────────────────────────────
  const navLinks = [
    { href: 'home', label: 'Otthon', isHome: true },
    { href: '#products', label: 'Termékek' },
    { href: '#features', label: 'Jellemzők' },
    { href: '#about', label: 'Rólunk' },
  ];

  const handleNavClick = (href: string, isHome?: boolean) => {
  setIsMobileMenuOpen(false);
  setCartOpen(false);
  if (isHome) { onLogoClick(); return; }
  setTimeout(() => {
    if (href.startsWith('#') && onNavigateSection) {
      onNavigateSection(href.replace('#', ''));
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }, 250);
};

  // ── Desktop hover handlers (debounced leave) ──────────────────────────────────
  const handleCartMouseEnter = () => {
    if (isMobile) return;
    if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    setCartOpen(true);
  };
  const handleCartMouseLeave = () => {
    if (isMobile) return;
    hoverLeaveTimer.current = setTimeout(() => setCartOpen(false), 150);
  };

  const cartPanelProps = {
    cartItems,
    cartTotal,
    cartCount,
    onRemoveFromCart,
    onUpdateQuantity,
    onCheckout,
    setCartOpen,
    animated,
  };

  // ────────────────────────────────────────────────────────────────────────────
  //  B VERZIÓ (animated = true)
  // ────────────────────────────────────────────────────────────────────────────
  if (animated) {
    return (
      <>
        <header className="fixed top-0 w-full z-[101] bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">

            {/* Logo */}
            <motion.button
              onClick={onLogoClick}
              className="text-xl sm:text-2xl font-bold tracking-tight text-black shrink-0"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              AudioA
            </motion.button>

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden md:flex gap-1 items-center flex-1 justify-center">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href, link.isHome); }}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg cursor-pointer relative overflow-hidden"
                  whileHover={{ scale: 1.05, color: '#000' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <motion.div
                    className="absolute inset-0 bg-gray-100 -z-0"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 15 }}
                  />
                </motion.a>
              ))}
            </nav>

            {/* Right side: cart + hamburger */}
            <div className="flex items-center gap-2 shrink-0">

              {/* ── Cart button ─────────────────────────────────────────── */}
              <div data-cart-area className="relative">
                <motion.button
                  // Mobile: toggle on click | Desktop: also clickable, hover opens
                  onClick={() => {
                    setCartOpen(!isCartOpen);
                    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  className="relative p-2.5 rounded-xl transition-colors"
                  animate={effectiveBounce || cartBounce ? { scale: [1, 1.22, 0.95, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ShoppingCart className="w-6 h-6 text-black" />
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                      animate={
                        effectiveBounce || cartBounce
                          ? { scale: [0.8, 1.15, 1] }
                          : { scale: 1 }
                      }
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Desktop dropdown — only on md+ */}
                <AnimatePresence>
                  {isCartOpen && !isMobile && (
                    <motion.div
                      data-cart-area
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      onMouseEnter={handleCartMouseEnter}
                      onMouseLeave={handleCartMouseLeave}
                      // Max width capped so it never overflows on any screen
                      className="absolute right-0 mt-3 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 flex flex-col"
                      style={{ width: 'min(420px, calc(100vw - 32px))', maxHeight: 480 }}
                    >
                      {/* Arrow tip */}
                      <div
                        style={{
                          position: 'absolute', top: -6, right: 18,
                          width: 12, height: 12,
                          transform: 'rotate(45deg)',
                          background: '#fff',
                          borderTop: '1px solid #f3f4f6',
                          borderLeft: '1px solid #f3f4f6',
                          zIndex: 51,
                        }}
                      />
                      <CartPanel {...cartPanelProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Hamburger — mobile only ──────────────────────────────── */}
              <motion.button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  if (isCartOpen) setCartOpen(false);
                }}
                className="md:hidden p-2.5 rounded-xl transition-colors"
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
                whileTap={{ scale: 0.92 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {isMobileMenuOpen
                    ? <X className="w-6 h-6 text-black" />
                    : <Menu className="w-6 h-6 text-black" />
                  }
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* ── Mobile nav menu ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
              >
                <div className="px-4 py-3 space-y-1">
                  {navLinks.map((link) => (
                    <motion.a
                      key={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href, link.isHome); }}
                      href={link.href}
                      className="flex items-center px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl cursor-pointer"
                      whileTap={{ scale: 0.98, backgroundColor: 'rgba(0,0,0,0.05)' }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── Mobile cart: full-screen bottom sheet ──────────────────────────── */}
        <AnimatePresence>
          {isCartOpen && isMobile && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[110] bg-black/50"
                onClick={() => setCartOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-2xl shadow-2xl flex flex-col"
                style={{ maxHeight: '85dvh' }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>
                <CartPanel {...cartPanelProps} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  A VERZIÓ (animated = false) — statikus, azonos mobile logika mint B
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="fixed top-0 w-full z-[101] bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="text-xl sm:text-2xl font-bold tracking-tight text-black shrink-0"
          >
            AudioA
          </button>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex gap-1 items-center flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href, link.isHome); }}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side: cart + hamburger */}
          <div className="flex items-center gap-2 shrink-0">

            {/* ── Cart button ───────────────────────────────────────────── */}
            <div data-cart-area className="relative">
              <button
                onClick={() => {
                  setCartOpen(!isCartOpen);
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Desktop dropdown — only on md+ */}
              {isCartOpen && !isMobile && (
                <div
                  data-cart-area
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  className="absolute right-0 mt-3 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 flex flex-col"
                  style={{ width: 'min(420px, calc(100vw - 32px))', maxHeight: 480 }}
                >
                  {/* Arrow tip */}
                  <div
                    style={{
                      position: 'absolute', top: -6, right: 18,
                      width: 12, height: 12,
                      transform: 'rotate(45deg)',
                      background: '#fff',
                      borderTop: '1px solid #f3f4f6',
                      borderLeft: '1px solid #f3f4f6',
                      zIndex: 51,
                    }}
                  />
                  <CartPanel {...cartPanelProps} />
                </div>
              )}
            </div>

            {/* ── Hamburger — mobile only ────────────────────────────────── */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (isCartOpen) setCartOpen(false);
              }}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen
                ? <X className="w-6 h-6 text-black" />
                : <Menu className="w-6 h-6 text-black" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile nav menu ────────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href, link.isHome); }}
                  href={link.href}
                  className="flex items-center px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile cart: bottom sheet — nincs animáció, csak CSS transition ──── */}
      {isCartOpen && isMobile && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[110] bg-black/50"
            onClick={() => setCartOpen(false)}
          />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '85dvh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <CartPanel {...cartPanelProps} />
          </div>
        </>
      )}
    </>
  );
}