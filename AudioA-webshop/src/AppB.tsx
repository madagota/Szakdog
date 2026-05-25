import ImageWithFallback from './components/figma/ImageWithFallback';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowUp, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

// Animált ár számláló
function PriceCounter({ target, prefix = '' }: { target: number; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (800 / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{prefix} {count}</span>;
}

// Vissza a tetejére gomb
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl"
      >
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">B</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Üdvözöllek a kutatásomban!</h2>
        <p className="text-gray-700 mb-6 text-base sm:text-lg leading-7">
          Ez a weboldal egy szakdolgozat kutatás része. A feladatod nagyon egyszerű:
          <br /><br />
          <strong className="text-black text-lg sm:text-xl">Nézz körül, és &quot;rendelj meg&quot; egy fejhallgatót!</strong>
          <br /><br />
          A fizetésnél nyugodtan adj meg <strong>kamu adatokat</strong>, ez csak egy szimuláció. A rendelés végén egy rövid kérdőív vár rád.
        </p>
        <motion.button onClick={onClose}
          className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg relative overflow-hidden"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <span className="relative z-10">Kezdés!</span>
          <motion.div className="absolute inset-0 bg-gray-800" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
        </motion.button>
      </motion.div>
    </div>
  );
}
export default function AppB() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [cartBounce, setCartBounce] = useState(false);
  const [addedStates, setAddedStates] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [pendingScrollSection, setPendingScrollSection] = useState<string>('');
  const prevCartCount = useRef<number>(0);
  const toastTimer = useRef<number | null>(null);

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 400], [0, 60]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentPage === 'home' && pendingScrollSection) {
      const timer = window.setTimeout(() => {
        document.getElementById(pendingScrollSection)?.scrollIntoView({ behavior: 'smooth' });
        setPendingScrollSection('');
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [currentPage, pendingScrollSection]);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartBounce(true);
      const timer = window.setTimeout(() => setCartBounce(false), 400);
      prevCartCount.current = cartCount;
      return () => window.clearTimeout(timer);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    if (toastMessage && toastTimer.current) window.clearTimeout(toastTimer.current);
    if (toastMessage) toastTimer.current = window.setTimeout(() => setToastMessage(null), 2000);
    return () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); };
  }, [toastMessage]);

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
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const products: Product[] = [
    { id: 1, name: 'AudioA Pro', description: 'Prémium vezeték nélküli fejhallgató aktív zajszűréssel', price: 799, image: proImage },
    { id: 2, name: 'AudioA Studio', description: 'Professzionális stúdió monitor zenei produkciókhoz', price: 1099, image: studioImage },
  ];

  const addToCart = (id: number, name: string, price: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id, name, price, quantity: 1 }];
    });
    setCartOpen(true);
    setAddedStates(prev => ({ ...prev, [id]: true }));
    window.setTimeout(() => setAddedStates(prev => ({ ...prev, [id]: false })), 1200);
    setToastMessage(`${name} kosárba rakva`);
  };

  const removeFromCart = (id: number) => setCartItems(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleCheckout = () => { setCartOpen(false); setCurrentPage('checkout'); window.scrollTo(0, 0); };
  const handleCheckoutComplete = () => { setCartItems([]); setCurrentPage('home'); window.scrollTo(0, 0); };

  const headerProps = {
    cartItems, cartTotal, onRemoveFromCart: removeFromCart, onUpdateQuantity: updateQuantity,
    onCheckout: handleCheckout, isCartOpen: cartOpen, setCartOpen,
    cartCount, onLogoClick: navigateHome, onNavigateSection: navigateHomeAndScroll,
    animated: true, currentPage, cartBounce,
  };

const viewProductDetails = (product: Product) => {
  setSelectedProduct(product);
  setCurrentPage('product');
  window.scrollTo(0, 0);
};
  if (currentPage === 'product' && selectedProduct) {
    return (
      <>
        {loading && <SkeletonLoader />}
        <div className="min-h-screen bg-white">
          {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
          {!showWelcome && <HeaderPro {...headerProps} />}
          <ProductDetailsAnimated
          key={selectedProduct.id} 
            product={selectedProduct} onBack={navigateHome} onAddToCart={addToCart}
            onBuyNow={(id, name, price) => { addToCart(id, name, price); setTimeout(() => { setCurrentPage('checkout'); window.scrollTo(0, 0); }, 300); }}
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
          {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
          {!showWelcome && <HeaderPro {...headerProps} />}
          <Checkout cartItems={cartItems} cartTotal={cartTotal}
            onBack={() => { navigateHome(); setCartOpen(true); }}
            onComplete={handleCheckoutComplete} animated={true} />
          <FooterPro />
        </div>
      </>
    );
  }

  return (
    <>
      {loading && <SkeletonLoader />}
      <div className="min-h-screen bg-white">
        {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
        {!showWelcome && (
          <>
            <HeaderPro {...headerProps} />
            <AnimatePresence>
              {toastMessage && (
                <motion.div key="toast"
                  initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.35 }}
                  className="fixed right-4 top-24 z-[200] rounded-2xl bg-black text-white px-4 py-3 shadow-2xl flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <ScrollToTop />

        <div className="pt-20">
          {/* Hero szekció */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-bold"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  Prémium Hangélmény
                </motion.h2>
                <motion.p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  Fedezd fel a kényelem, a stílus és a kiváló hangminőség tökéletes egyensúlyát.
                </motion.p>
                <motion.div className="relative inline-block"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                  <motion.div className="absolute inset-0 rounded bg-black"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
                  <motion.button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="relative bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded font-bold text-sm sm:text-base overflow-hidden"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <span className="relative z-10">Vásárlás</span>
                    <motion.div className="absolute inset-0 bg-gray-800" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div style={{ y: heroImageY }} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <ImageWithFallback src={landingImage} alt="Premium AudioA Headphones" className="w-full h-auto rounded-lg shadow-lg" />
              </motion.div>
            </div>

            {/* Görgetés indikátor */}
            <motion.div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 cursor-pointer"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <span className="text-xs">Görgets le</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </section>

          {/* Features szekció */}
          <section id="features" className="bg-gray-50 py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.h2 className="text-3xl sm:text-4xl text-center mb-10 sm:mb-16"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                Miért válassza az AudioA-t?
              </motion.h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                {[
                  { title: "Studióhangzás. Bárhol.", description: "Lépjen be a részletgazdag hangzások világába. A precízen hangolt akusztika mély, telt basszusokat és kristálytiszta magasakat hoz el a mindennapjaiba." },
        { title: "Időtálló, prémium anyagok.", description: "Nemcsak szép, strapabíró is. Az eloxált alumínium zsanérok és a megerősített fejpánt garantálják, hogy a fejhallgató éveken át ellenálljon a mindennapi használat kihívásainak." },
        { title: "Hosszú üzemidő", description: "Felejtse el a folyamatos töltögetést. Az akár 40 órás üzemidő azt jelenti, hogy a fejhallgatója készen áll a teljes munkahétre, az uazásokra és a hétvégi kikapcsolódásra is.." },
                ].map((feature, index) => (
                  <motion.div key={index} className="text-center group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ y: -10 }}>
                    <motion.div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.6 }}>
                      <motion.div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full" whileHover={{ scale: 0.8 }} />
                    </motion.div>
                    <motion.h3 className="text-lg sm:text-xl mb-2 sm:mb-3"
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}>
                      {feature.title}
                    </motion.h3>
                    <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-900 transition-colors">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Termékek szekció */}
          <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
            <motion.h2 className="text-3xl sm:text-4xl text-center mb-10 sm:mb-16"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              Kollekciónk
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {products.map((product, index) => (
                <motion.div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden group"
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.12 }} whileHover={{ y: -8 }}
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}>

                  <div style={{ height: '384px', overflow: 'hidden', position: 'relative', backgroundColor: '#f3f4f6' }}>
                    <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.45 }} style={{ height: '100%' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                    <AnimatePresence>
                      {hoveredProductId === product.id && (
                        <motion.button type="button" onClick={() => viewProductDetails(product)}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                          className="absolute inset-0 bg-black/40 text-white flex items-end justify-center pb-6 font-bold">
                          <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}>
                            Részletek megtekintése →
                          </motion.span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl mb-2">{product.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{product.description}</p>
                    <p className="text-lg sm:text-xl mb-3 sm:mb-4 font-semibold">
                      <PriceCounter target={product.price} prefix="RON" />
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        className="flex-1 border border-black text-black py-2.5 sm:py-3 rounded text-sm sm:text-base font-bold relative overflow-hidden"
                        onClick={() => viewProductDetails(product)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                        <span className="relative z-10">Részletek</span>
                        <motion.div className="absolute bottom-0 left-0 h-0.5 bg-black"
                          initial={{ width: 0 }} whileHover={{ width: '100%' }} transition={{ type: 'tween', duration: 0.3 }} />
                      </motion.button>

                      <motion.button
                        className={`flex-1 py-2.5 sm:py-3 rounded text-sm sm:text-base font-bold relative overflow-hidden ${addedStates[product.id] ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-black text-white'}`}
                        onClick={() => !addedStates[product.id] && addToCart(product.id, product.name, product.price)}
                        whileHover={addedStates[product.id] ? {} : { scale: 1.03 }}
                        whileTap={addedStates[product.id] ? {} : { scale: 0.96 }}
                        disabled={Boolean(addedStates[product.id])}>
                        <AnimatePresence mode="wait">
                          {addedStates[product.id] ? (
                            <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="block">
                              ✓ Hozzáadva
                            </motion.span>
                          ) : (
                            <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="block relative z-10">
                              Kosárba
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!addedStates[product.id] && (
                          <motion.div className="absolute inset-0 bg-gray-800"
                            initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

         {/* Rólunk szekció */}
<section id="about" className="bg-white py-20">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">A mi történetünk</p>
        <motion.h2
          className="text-4xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A hangzás iránti szenvedély hajtja minden döntésünket.
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-5 text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Az AudioA-t egy egyszerű küldetéssel alapítottuk: kivételes hangélményt nyújtani minden zene szerelmese számára. Hiszünk abban, hogy a kiváló hangzás nem lehet luxus — mindenki megérdemli.
        </motion.p>
        <motion.p
          className="text-gray-600 text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Hangmérnökökből és tervezőkből álló csapatunk fáradhatatlanul dolgozik azon, hogy olyan fejhallgatókat hozzon létre, amelyek a legmodernebb technológiát ötvözik az időtálló dizájnnal.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { number: "40h", label: "Üzemidő egyetlen töltéssel" },
          { number: "2 év", label: "Teljes körű garancia" },
          { number: "Hi-Res", label: "Minősített hangzás" },
          { number: "250g", label: "Könnyű, kényelmes viselet" },
        ].map((stat, index) => (
          <motion.div
            key={stat.number}
            className="border border-gray-100 rounded-2xl p-6 cursor-default"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -6, borderColor: '#000', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          >
            <p className="text-3xl font-bold mb-1">{stat.number}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>
        </div>

        <FooterPro />
      </div>
    </>
  );
}
