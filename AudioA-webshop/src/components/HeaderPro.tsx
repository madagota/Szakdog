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

export function HeaderPro({ cartItems, cartTotal, onRemoveFromCart, onUpdateQuantity, onCheckout, isCartOpen, setCartOpen, cartCount, onLogoClick, animated = false, onNavigateSection, cartBounce = false }: HeaderProProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [effectiveBounce, setEffectiveBounce] = useState(false);
  const prevCartCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setEffectiveBounce(true);
      const timer = window.setTimeout(() => setEffectiveBounce(false), 400);
      return () => window.clearTimeout(timer);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const navLinks = [
    { href: 'home', label: 'Otthon', isHome: true },
    { href: '#products', label: 'Termékek' },
    { href: '#features', label: 'Jellemzők' },
    { href: '#about', label: 'Rólunk' }
  ];

  const handleNavClick = (href: string, isHome?: boolean) => {
    setIsMobileMenuOpen(false);
    if (isHome) {
      onLogoClick();
      return;
    }
    if (href.startsWith('#') && onNavigateSection) {
      onNavigateSection(href.replace('#', ''));
      return;
    }

    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (animated) {
    // B verzió animációval
    return (
      <header className="fixed top-0 w-full z-[101] bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.button
            onClick={onLogoClick}
            className="text-2xl font-bold tracking-tight text-black hover:text-gray-600 transition-colors"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            AudioA
          </motion.button>

          <nav className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.isHome);
                }}
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

          <div className="relative">
            <motion.button
              onClick={() => setCartOpen(!isCartOpen)}
              onMouseEnter={() => setCartOpen(true)}
              className="relative p-2.5 rounded-lg transition-colors group"
              animate={effectiveBounce || cartBounce ? { scale: [1, 1.22, 0.95, 1] } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gray-100 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <ShoppingCart className="w-6 h-6 text-black relative z-10" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={effectiveBounce || cartBounce ? { scale: [0.8, 1.15, 1] } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={animated ? { opacity: 0, y: -8, scale: 0.97 } : { opacity: 1 }}
                  animate={animated ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
                  exit={animated ? { opacity: 0, y: -8, scale: 0.97 } : { opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onMouseEnter={() => setCartOpen(true)}
                  onMouseLeave={() => setCartOpen(false)}
                 className="absolute right-0 mt-3 w-[440px] bg-white rounded-2xl border border-gray-100 shadow-2xl z-50"
                  style={{ maxHeight: 480, overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: -6, right: 18, width: 12, height: 12, transform: 'rotate(45deg)', background: '#fff', borderTop: '1px solid #f3f4f6', borderLeft: '1px solid #f3f4f6', zIndex: 51 }} />
                  <div className="origin-top-right">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">Kosár</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{cartCount} db</span>
                      </div>
                      <button onClick={() => setCartOpen(false)} className="p-1 rounded hover:bg-gray-100">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4" style={{ maxHeight: 350, overflowY: 'auto' }}>
                      {cartItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
                          <div className="text-gray-500 mt-3 font-semibold">A kosarad üres.</div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 pr-3">
                                  <div className="font-semibold text-sm md:text-base">{item.name}</div>
                                </div>
                                <button onClick={() => onRemoveFromCart(item.id)} className="p-1 rounded hover:bg-gray-100">
                                  <X className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-gray-500">RON {item.price * item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded-md text-sm font-bold">-</button>
                                  <div className="w-8 text-center">{item.quantity}</div>
                                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded-md text-sm font-bold">+</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-bold">Összesen</span>
                        <span className="text-base font-bold">RON {cartTotal}</span>
                      </div>
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
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg transition-colors"
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.isHome);
                  }}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </header>
    );
  }

  // A verzió (no animation)
  return (
    <header className="fixed top-0 w-full z-[101] bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="text-2xl font-bold tracking-tight text-black"
        >
          AudioA
        </button>

        <nav className="hidden md:flex gap-1 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href, link.isHome);
              }}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg cursor-pointer relative overflow-hidden"
            >
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="relative">
          <button
            onClick={() => setCartOpen(!isCartOpen)}
            onMouseEnter={() => setCartOpen(true)}
            className="relative p-2.5 rounded-lg"
          >
            <ShoppingCart className="w-6 h-6 text-black" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md"
              >
                {cartCount}
              </span>
            )}
          </button>

          {isCartOpen && (
            <div onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)} className="absolute right-0 mt-3 w-[440px] bg-white rounded-2xl border border-gray-100 shadow-2xl z-50" style={{ maxHeight: 480, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -6, right: 18, width: 12, height: 12, transform: 'rotate(45deg)', background: '#fff', borderTop: '1px solid #f3f4f6', borderLeft: '1px solid #f3f4f6', zIndex: 51 }} />
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">Kosár</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{cartCount} db</span>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4" style={{ maxHeight: 350, overflowY: 'auto' }}>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
                    <div className="text-gray-500 mt-3 font-semibold">A kosarad üres.</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-3">
                            <div className="font-semibold text-sm md:text-base">{item.name}</div>
                          </div>
                          <button onClick={() => onRemoveFromCart(item.id)} className="p-1 rounded hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">RON {item.price * item.quantity}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded-md text-sm font-bold">-</button>
                            <div className="w-8 text-center">{item.quantity}</div>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded-md text-sm font-bold">+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold">Összesen</span>
                  <span className="text-base font-bold">RON {cartTotal}</span>
                </div>
                <button onClick={() => { onCheckout(); setCartOpen(false); }} className="w-full bg-black text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Tovább a fizetéshez</span>
                      </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 rounded-lg"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.isHome);
                }}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-lg cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
