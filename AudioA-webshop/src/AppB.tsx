import ImageWithFallback from './components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetailsAnimated from './components/ProductDetailsAnimated';
import { Checkout } from './components/Checkout';
import { SkeletonLoader } from './components/SkeletonLoader';
import { HeaderPro } from './components/HeaderPro';
import { FooterPro } from './components/FooterPro';

import proImage from './assets/pexels-caleboquendo-7772547.jpg';
import studioImage from './assets/sound-tools-NOCwdxBRGJA-unsplash.jpg';
import landingImage from './assets/sound-tools-Q-J34Sj65FQ-unsplash.jpg';

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [cartBounce, setCartBounce] = useState(false);
  const [pendingScrollSection, setPendingScrollSection] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentPage === 'home' && pendingScrollSection) {
      const timer = window.setTimeout(() => {
        const element = document.getElementById(pendingScrollSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setPendingScrollSection('');
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [currentPage, pendingScrollSection]);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateHome = () => {
    setCurrentPage('home');
    setPendingScrollSection('');
    setCartOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateHomeAndScroll = (section: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setPendingScrollSection(section);
      window.scrollTo(0, 0);
    } else {
      scrollToSection(section);
    }
  };

  const products: Product[] = [
    {
      id: 1,
      name: 'AudioA Pro',
      description: 'Prémium vezeték nélküli fejhallgató aktív zajszűréssel',
      price: 799,
      image: proImage,
    },
    {
      id: 2,
      name: 'AudioA Studio',
      description: 'Professzionális stúdió monitor zenei produkciókhoz',
      price: 1099,
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
    
    // Cart icon bounce animáció
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
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
    return (
      <>
        {loading && <SkeletonLoader />}
        <div className="min-h-screen bg-white">
          {showWelcome && (
            <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
              <div className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl shadow-black/10">
                <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
                  B
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Üdvözöllek a kutatásomban!</h2>
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-7">
                  Ez a weboldal egy szakdolgozat kutatás része. A feladatod nagyon egyszerű:
                  <br/><br/>
                  <strong className="text-black text-lg sm:text-xl">Nézz körül, és &quot;rendelj meg&quot; egy fejhallgatót!</strong>
                  <br/><br/>
                  A fizetésnél nyugodtan adj meg kamu adatokat, ez csak egy szimuláció. A rendelés végén egy rövid kérdőív vár rád.
                </p>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors"
                >
                  Értettem, kezdjük a tesztet!
                </button>
              </div>
            </div>
          )}

          {!showWelcome && (
            <HeaderPro
              cartCount={cartCount}
              onCartClick={() => setCartOpen(true)}
              onLogoClick={navigateHome}
              onNavigateSection={navigateHomeAndScroll}
              animated={true}
              currentPage={currentPage}
              cartBounce={cartBounce}
            />
          )}

          <ProductDetailsAnimated
            product={selectedProduct}
            onBack={navigateHome}
            onAddToCart={addToCart}
            onBuyNow={(id, name, price) => {
              addToCart(id, name, price);
              setTimeout(() => { setCurrentPage('checkout'); window.scrollTo(0, 0); }, 300);
            }}
          />
          <FooterPro />
        </div>
      </>
    );
  }

  if (currentPage === 'checkout') {
    return (
      <>
        {loading && <SkeletonLoader />}
        <div className="min-h-screen bg-white">
          {showWelcome && (
            <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
              <div className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl shadow-black/10">
                <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
                  B
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Üdvözöllek a kutatásomban!</h2>
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-7">
                  Ez a weboldal egy szakdolgozat kutatás része. A feladatod nagyon egyszerű:
                  <br/><br/>
                  <strong className="text-black text-lg sm:text-xl">Nézz körül, és &quot;rendelj meg&quot; egy fejhallgatót!</strong>
                  <br/><br/>
                  A fizetésnél adj meg kamu adatokat, ez csak egy szimuláció. A rendelés végén egy rövid kérdőív vár rád.
                </p>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors"
                >
                  Kezdés!
                </button>
              </div>
            </div>
          )}

          {!showWelcome && (
            <HeaderPro
              cartCount={cartCount}
              onCartClick={() => setCartOpen(true)}
              onLogoClick={navigateHome}
              onNavigateSection={navigateHomeAndScroll}
              animated={true}
              currentPage={currentPage}
            />
          )}

          <Checkout
            cartItems={cartItems}
            cartTotal={cartTotal}
            onBack={() => {
              navigateHome();
              setCartOpen(true);
            }}
            onComplete={handleCheckoutComplete}
            animated={true}
          />
          <FooterPro />
        </div>
      </>
    );
  }

  return (
    <>
      {loading && <SkeletonLoader />}
      <div className="min-h-screen bg-white">
        {showWelcome && (
          <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl shadow-black/10">
              <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
                B
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Üdvözöllek a kutatásomban!</h2>
              <p className="text-gray-700 mb-6 text-base sm:text-lg leading-7">
                Ez a weboldal egy szakdolgozat kutatás része. A feladatod nagyon egyszerű:
                <br/><br/>
                <strong className="text-black text-lg sm:text-xl">Nézz körül, és &quot;rendelj meg&quot; egy fejhallgatót!</strong>
                <br/><br/>
                A fizetésnél nyugodtan adj meg kamu adatokat, ez csak egy szimuláció. A rendelés végén egy rövid kérdőív vár rád.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors"
              >
                Értettem, kezdjük a tesztet!
              </button>
            </div>
          </div>
        )}

        {!showWelcome && (
          <HeaderPro
            cartCount={cartCount}
            onCartClick={() => setCartOpen(true)}
            onLogoClick={navigateHome}
            onNavigateSection={navigateHomeAndScroll}
            animated={true}
            currentPage={currentPage}
            cartBounce={cartBounce}
          />
        )}

        <div className="pt-20">
          <AnimatePresence>
            {cartOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
                  onClick={() => setCartOpen(false)}
                />
                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-full sm:w-96 max-w-md bg-white shadow-2xl flex flex-col z-50"
                >
                  <div className="border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl">Kosár</h2>
                    <motion.button
                      onClick={() => setCartOpen(false)}
                      whileHover={{ rotate: 90, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {cartItems.length === 0 ? (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-600 text-center py-12"
                      >
                        A kosarad üres.
                      </motion.p>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {cartItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50, height: 0 }}
                              transition={{ delay: index * 0.04 }}
                              className="border border-gray-200 rounded-lg p-3 sm:p-4"
                            >
                              <div className="flex justify-between mb-2">
                                <h3 className="text-sm sm:text-base">{item.name}</h3>
                                <motion.button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                  whileHover={{ scale: 1.15, rotate: 15 }}
                                  whileTap={{ scale: 0.96 }}
                                >
                                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <motion.button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm sm:text-base font-bold"
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.96 }}
                                  >-</motion.button>
                                  <motion.span
                                    key={item.quantity}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="text-sm sm:text-base"
                                  >{item.quantity}</motion.span>
                                  <motion.button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm sm:text-base font-bold"
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.96 }}
                                  >+</motion.button>
                                </div>
                                <p className="text-sm sm:text-base">RON {item.price * item.quantity}</p>
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
                        <p className="text-lg sm:text-xl">RON {cartTotal}</p>
                      </div>
                      <motion.button
                        className="w-full bg-black text-white py-3 rounded relative overflow-hidden group text-sm sm:text-base font-bold hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleCheckout}
                      >
                        <span className="relative z-10">Pénztár</span>
                        <motion.div
                          className="absolute inset-0 bg-gray-800"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ type: 'tween', duration: 0.28 }}
                        />
                      </motion.button>
                    </div>
                  )}
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Hero szekció */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.h2
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Prémium Hangélmény
                </motion.h2>
                <motion.p
                  className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Fedezd fel a kényelem, a stílus és a kiváló hangminőség tökéletes egyensúlyát.
                </motion.p>
                <motion.button
                  onClick={scrollToProducts}
                  className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded relative overflow-hidden group text-sm sm:text-base font-bold hover:bg-gray-800 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="relative z-10">Vásárlás</span>
                  <motion.div
                    className="absolute inset-0 bg-gray-800"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ type: 'tween', duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="transition-transform duration-300"
              >
                <ImageWithFallback
                  src={landingImage}
                  alt="Premium AudioA Headphones"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </section>

{/* Features szekció */}
<section id="features" className="bg-gray-50 py-12 sm:py-16 md:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <motion.h2 
      className="text-3xl sm:text-4xl text-center mb-10 sm:mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      Miért válassza az AudioA-t?
    </motion.h2>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {[
        { title: "Kiváló hangzás", description: "Tapasztalja meg a stúdió minőségű hangzást mély basszussal és kristálytiszta magasakkal." },
        { title: "Egész napos kényelem", description: "Ergonomikus kialakítás prémium párnázással a hosszú zenehallgatáshoz." },
        { title: "Hosszú üzemidő", description: "Akár 40 óra vezeték nélküli lejátszás egyetlen töltéssel." }
      ].map((feature, index) => (
        <motion.div
          key={index}
          className="text-center group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -10 }}
        >
          <motion.div 
            className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full" whileHover={{ scale: 0.8 }} />
          </motion.div>
          <h3 className="text-lg sm:text-xl mb-2 sm:mb-3">{feature.title}</h3>
          <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-900 transition-colors">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
          {/* Termékek szekció */}
          <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
            <motion.h2
              className="text-3xl sm:text-4xl text-center mb-10 sm:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Kollekciónk
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  whileHover={{ y: -8 }}
                >
                  <div style={{ height: '384px', overflow: 'hidden', position: 'relative', backgroundColor: '#f3f4f6' }}>
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.45 }}
                      style={{ height: '100%' }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </motion.div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl mb-2">{product.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{product.description}</p>
                    <p className="text-lg sm:text-xl mb-3 sm:mb-4">RON {product.price}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        className="flex-1 border border-black text-black py-2.5 sm:py-3 rounded text-sm sm:text-base font-bold hover:bg-gray-50 transition-colors"
                        onClick={() => viewProductDetails(product)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        Részletek
                      </motion.button>
                      <motion.button
                        className="flex-1 bg-black text-white py-2.5 sm:py-3 rounded text-sm sm:text-base font-bold hover:bg-gray-800 transition-colors"
                        onClick={() => addToCart(product.id, product.name, product.price)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        Kosárba
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Rólunk szekció */}
          <section id="about" className="bg-white py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-6">Rólunk</h2>
              <p className="text-gray-600 mb-4 text-lg">
                Az AudioA-t egy egyszerű küldetéssel alapítottuk: kivételes hangélményt nyújtani minden zene szerelmese számára. Hiszünk abban, hogy a kiváló hangzás nem lehet luxus.
              </p>
              <p className="text-gray-600 text-lg">
                Hangmérnökökből és tervezőkből álló csapatunk fáradhatatlanul dolgozik azon, hogy olyan fejhallgatókat hozzon létre, amelyek a legmodernebb technológiát ötvözik az időtálló dizájnnal.
              </p>
            </div>
          </section>
        </div>

        <FooterPro />
      </div>
    </>
  );
}
