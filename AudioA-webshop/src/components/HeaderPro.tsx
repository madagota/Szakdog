import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProProps {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  animated?: boolean;
  onNavigateSection?: (section: string) => void;
  currentPage?: 'home' | 'product' | 'checkout';
  cartBounce?: boolean;
}

export function HeaderPro({ cartCount, onCartClick, onLogoClick, animated = false, onNavigateSection, cartBounce = false }: HeaderProProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          <motion.button
            onClick={onCartClick}
            className="relative p-2.5 rounded-lg transition-colors group"
            animate={cartBounce ? { scale: [1, 1.2, 1] } : {}}
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
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

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
                handleNavClick(link.href, link.isHome);
              }}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg transition-all duration-200 cursor-pointer relative overflow-hidden group hover:bg-gray-100 hover:shadow-sm"
            >
              <span className="relative z-10 group-hover:text-black transition-colors">{link.label}</span>
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 15 }}
              />
            </a>
          ))}
        </nav>

        <motion.button
          onClick={onCartClick}
          className="relative p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 group"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-6 h-6 text-black transition-transform group-hover:scale-110" />
          {cartCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>

        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100"
          whileHover={{ scale: 1.08 }}
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
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                whileHover={{ x: 4 }}
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
