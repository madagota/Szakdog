import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  showNav?: boolean;
  cartItems?: Array<{ id: number; name: string; price: number; quantity: number }>;
}

export function Header({ cartCount, onCartClick, onLogoClick, showNav = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#products', label: 'Termékek' },
    { href: '#features', label: 'Jellemzők' },
    { href: '#about', label: 'Rólunk' }
  ];

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logó */}
        <h1 
          className="text-2xl font-bold cursor-pointer text-black"
          onClick={onLogoClick}
        >
          AudioA
        </h1>
        
        {/* Navigáció és Kosár */}
        {showNav && (
          <>
            {/* --- ASZTALI NÉZET (Desktop) --- */}
            <nav className="hidden md:flex gap-8 items-center relative">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href} 
                  className="text-gray-700 hover:text-black font-medium"
                >
                  {link.label}
                </a>
              ))}

              <button 
                onClick={onCartClick} 
                className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* --- MOBIL NÉZET (Mobile) --- */}
            <div className="flex md:hidden items-center gap-4">
              <button 
                onClick={onCartClick} 
                className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 bg-gray-100 text-black rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- MOBIL MENÜ LENYÍLÓ ABLAK --- */}
      {showNav && isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white absolute w-full shadow-xl">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-800 hover:text-black block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}