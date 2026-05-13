import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProProps {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  animated?: boolean;
  onFeaturesClick?: () => void;
  currentPage?: 'home' | 'product' | 'checkout';
  cartBounce?: boolean;
}

export function HeaderPro({ cartCount, onCartClick, onLogoClick, animated = false, onFeaturesClick, currentPage = 'home', cartBounce = false }: HeaderProProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const navLinks = [
    { href: '#products', label: currentPage === 'home' ? 'Termékek' : 'Menü', action: currentPage === 'home' ? undefined : onLogoClick },
    { href: '#features', label: 'Jellemzők', action: undefined },
    { href: '#about', label: 'Rólunk', action: undefined }
  ];

  const handleNavClick = (href: string, action?: () => void) => {
    setIsMobileMenuOpen(false);
    if (action) {
      action();
    } else if (href === '#features' && onFeaturesClick) {
      onFeaturesClick();
    } else if (href.startsWith('#')) {
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
              <a
                key={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.action);
                }}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <motion.button
            onClick={onCartClick}
            className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            animate={cartBounce ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ShoppingCart className="w-6 h-6 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </motion.button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
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
                    handleNavClick(link.href, link.action);
                  }}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
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

  // A verzió (no animation)
  return (
    <header className="fixed top-0 w-full z-[101] bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="text-2xl font-bold tracking-tight text-black hover:text-gray-600 transition-colors"
        >
          AudioA
        </button>

        <nav className="hidden md:flex gap-1 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href, link.action);
              }}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={onCartClick}
          className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-black" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
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
                  handleNavClick(link.href, link.action);
                }}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
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
