import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  showNav?: boolean;
  cartPop?: boolean;
  cartItems?: Array<{ id: number; name: string; price: number; quantity: number }>;
}

export function Header({ cartCount, onCartClick, onLogoClick, showNav = true, cartPop = false, cartItems = [] }: HeaderProps) {
  const [shouldPop, setShouldPop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [underlinePosition, setUnderlinePosition] = useState({ left: 0, width: 0 });
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartPop) {
      // schedule state updates to avoid synchronous setState inside effects
      const startTimer = setTimeout(() => setShouldPop(true), 0);
      const startShake = setTimeout(() => setShouldShake(true), 0);
      const timer = setTimeout(() => setShouldPop(false), 600);
      const shakeTimer = setTimeout(() => setShouldShake(false), 800);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(startShake);
        clearTimeout(timer);
        clearTimeout(shakeTimer);
      };
    }
  }, [cartPop, cartCount]);

  // Scroll detection for morphing header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    setHoveredLink(link);
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = navRef.current?.getBoundingClientRect();
    if (parentRect) {
      setUnderlinePosition({
        left: rect.left - parentRect.left,
        width: rect.width
      });
    }
  };

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '#products', label: 'Products' },
    { href: '#features', label: 'Features' },
    { href: '#about', label: 'About' }
  ];

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        height: isScrolled ? '64px' : '80px'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        height: { duration: 0.3, ease: 'easeInOut' }
      }}
      className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40"
    >
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between"
        animate={{
          scale: isScrolled ? 0.95 : 1
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <motion.h1 
          className="text-xl sm:text-2xl cursor-pointer"
          onClick={onLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            fontSize: isScrolled ? '1.25rem' : '1.5rem'
          }}
          transition={{ duration: 0.3 }}
        >
          AudioA
        </motion.h1>
        {showNav && (
          <>
            {/* Desktop Navigation */}
            <nav ref={navRef} className="hidden md:flex gap-8 items-center relative">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 relative py-2"
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkHover(e, link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, duration: 0.25 }}
                >
                  {link.label}
                </motion.a>
              ))}
              
              {/* Sliding underline that follows cursor */}
              <AnimatePresence>
                {hoveredLink && (
                  <motion.div
                    className="absolute bottom-0 h-0.5 bg-black"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      left: underlinePosition.left,
                      width: underlinePosition.width,
                      opacity: 1
                    }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      duration: 0.3
                    }}
                  />
                )}
              </AnimatePresence>

              <div 
                className="relative"
                onMouseEnter={() => cartItems.length > 0 && setShowCartPreview(true)}
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <motion.button 
                  onClick={onCartClick} 
                  className="relative"
                  animate={shouldShake ? {
                    rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
                    transition: { duration: 0.8, ease: "easeInOut" }
                  } : shouldPop ? {
                    scale: [1, 1.3, 0.9, 1.1, 1],
                    rotate: [0, -10, 10, -5, 0]
                  } : {}}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={shouldPop ? {
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-black rounded-full opacity-0"
                  />
                  <ShoppingCart className="w-6 h-6 relative z-10" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: shouldPop ? [1, 1.5, 1] : 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: shouldPop ? 0.6 : 0.3 }}
                        className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Pop notification */}
                  <AnimatePresence>
                    {shouldPop && (
                      <motion.div
                        initial={{ scale: 0, y: 0, opacity: 0 }}
                        animate={{ scale: 1, y: -60, opacity: 1 }}
                        exit={{ scale: 0, y: -80, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap pointer-events-none"
                      >
                        Added to cart!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Cart Preview on Hover - Desktop only */}
                <AnimatePresence>
                  {showCartPreview && cartItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* Arrow pointer */}
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                      
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">
                          Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                        </p>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                        {cartItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${item.price * item.quantity}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-lg font-medium text-gray-900">
                            ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                          </span>
                        </div>
                        <motion.button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onCartClick();
                          }}
                          className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-4">
              <motion.button 
                onClick={onCartClick} 
                className="relative"
                animate={shouldShake ? {
                  rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
                  transition: { duration: 0.8, ease: "easeInOut" }
                } : shouldPop ? {
                  scale: [1, 1.3, 0.9, 1.1, 1],
                  rotate: [0, -10, 10, -5, 0]
                } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: shouldPop ? [1, 1.5, 1] : 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: shouldPop ? 0.6 : 0.3 }}
                      className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Pop notification for mobile */}
                <AnimatePresence>
                  {shouldPop && (
                    <motion.div
                      initial={{ scale: 0, y: 0, opacity: 0 }}
                      animate={{ scale: 1, y: -60, opacity: 1 }}
                      exit={{ scale: 0, y: -80, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap pointer-events-none"
                    >
                      Added!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[80px] bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden"
            >
              <nav className="flex flex-col p-6 space-y-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handleMobileNavClick(link.href);
                    }}
                    className="text-lg text-gray-700 py-2 border-b border-gray-100"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.95, x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}