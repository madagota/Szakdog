import ImageWithFallback from './components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ProductDetails from './components/ProductDetails';
import { Checkout } from './components/Checkout';
import { SkeletonLoader } from './components/SkeletonLoader';
import { HeaderPro } from './components/HeaderPro';
import { FooterPro } from './components/FooterPro';

// Image URLs from public assets
const proImage = '/assets/adrian-regeci-rlJngr1ReOw-unsplash.jpg';
const studioImage = '/assets/sound-tools-NOCwdxBRGJA-unsplash.jpg';
const landingImage = '/assets/sound-tools-Q-J34Sj65FQ-unsplash.jpg';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

type Page = 'home' | 'product' | 'checkout';

export default function AppB() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartPop, setCartPop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const products: Product[] = [
    {
      id: 1,
      name: 'AudioA Pro',
      description: 'Prémium vezeték nélküli fejhallgató aktív zajszűréssel',
      price: 299,
      image: proImage,
    },
    {
      id: 2,
      name: 'AudioA Studio',
      description: 'Professzionális stúdió monitor zenei produkciókhoz',
      price: 399,
      image: studioImage,
    },
  ];

  const addToCart = (id: number, name: string, price: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) return prev.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...prev, { id, name, price, quantity: 1 }];
    });
    setCartOpen(true);
    setCartPop(true);
  };

  const removeFromCart = (id: number) => setCartItems(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) return removeFromCart(id);
    setCartItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'product' && selectedProduct) {
    return <ProductDetails product={selectedProduct} onBack={() => setCurrentPage('home')} onAddToCart={addToCart} onBuyNow={(id, name, price) => { addToCart(id, name, price); setTimeout(() => { setCurrentPage('checkout'); window.scrollTo(0, 0); }, 300); }} />;
  }

  if (currentPage === 'checkout') {
    return <Checkout cartItems={cartItems} cartTotal={cartTotal} onBack={() => { setCurrentPage('home'); setCartOpen(true); }} onComplete={handleCheckoutComplete} />;
  }

  return (
    <>
      {loading && <SkeletonLoader />}
      <div className={`min-h-screen bg-white ${loading ? 'hidden' : 'block'}`}>
        <HeaderPro cartCount={cartCount} onCartClick={() => setCartOpen(true)} onLogoClick={() => setCurrentPage('home')} animated={true} />

        <div className="pt-20">

        <AnimatePresence>
          {cartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full sm:w-96 max-w-md bg-white shadow-2xl flex flex-col z-50"
              >
                <div className="border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl">Kosár</h2>
                  <motion.button onClick={() => setCartOpen(false)} whileHover={{ rotate: 90, scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {cartItems.length === 0 ? (
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-gray-600 text-center py-12">Your cart is empty</motion.p>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {cartItems.map((item, index) => (
                          <motion.div key={item.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50, height: 0 }} transition={{ delay: index * 0.04 }} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <div className="flex justify-between mb-2">
                              <h3 className="text-sm sm:text-base">{item.name}</h3>
                              <motion.button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <motion.button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm sm:text-base" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>-</motion.button>
                                <motion.span key={item.quantity} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="text-sm sm:text-base">{item.quantity}</motion.span>
                                <motion.button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm sm:text-base" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>+</motion.button>
                              </div>
                              <p className="text-sm sm:text-base">${item.price * item.quantity}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t border-gray-200 p-4 sm:p-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-base sm:text-lg">Összesen</span>
                      <p className="text-lg sm:text-xl">${cartTotal}</p>
                    </div>
                    <motion.button className="w-full bg-black text-white py-3 rounded relative overflow-hidden group text-sm sm:text-base" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheckout}>
                      <span className="relative z-10">Pénztár</span>
                      <motion.div className="absolute inset-0 bg-gray-800" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.28 }} />
                    </motion.button>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Hero, features, products, about, footer sections (unchanged) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <motion.h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>Prémium Hangélmény</motion.h2>
              <motion.p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>Fedezd fel a kényelem, a stílus és a kiváló hangminőség tökéletes egyensúlyát.</motion.p>
              <motion.button onClick={scrollToProducts} className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded relative overflow-hidden group text-sm sm:text-base" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <span className="relative z-10">Vásárlás</span>
                <motion.div className="absolute inset-0 bg-gray-800" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.02 }} className="transition-transform duration-300">
              <ImageWithFallback src={landingImage} alt="Premium AudioA Headphones" className="w-full h-auto rounded-lg shadow-lg" />
            </motion.div>
          </div>
        </section>

        {/* Products Section - using whileInView for smooth entrance */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <motion.h2 className="text-3xl sm:text-4xl text-center mb-10 sm:mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>Kollekciónk</motion.h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {products.map((product, index) => (
              <motion.div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden group" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.12 }} whileHover={{ y: -8 }}>
                <div className="overflow-hidden relative h-96 bg-gray-100">
                  <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.45 }} className="h-full">
                    <img src={product.image} alt={product.name} className="w-full h-full object-scale-down" />
                  </motion.div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl mb-2">{product.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{product.description}</p>
                  <p className="text-lg sm:text-xl mb-3 sm:mb-4">${product.price}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 border border-black text-black py-2.5 sm:py-3 rounded text-sm sm:text-base" onClick={() => viewProductDetails(product)}>Részletek</button>
                    <button className="flex-1 bg-black text-white py-2.5 sm:py-3 rounded text-sm sm:text-base" onClick={() => addToCart(product.id, product.name, product.price)}>Kosárba</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        </div>
        
        <FooterPro />
      </div>
    </>
  );
}
 