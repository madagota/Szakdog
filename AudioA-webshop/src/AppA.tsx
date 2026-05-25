import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ProductDetailsStatic from './components/ProductDetailsStatic';
import { Checkout } from './components/Checkout';
import { HeaderPro } from './components/HeaderPro';
import { FooterPro } from './components/FooterPro';
import ReactGA from "react-ga4";
//import ImageWithFallback from './components/figma/ImageWithFallback';

// Image URLs from public assets
import proImage from './assets/pexels-caleboquendo-7772547.jpg';
import studioImage from './assets/sound-tools-NOCwdxBRGJA-unsplash.jpg';
import landingImage from './assets/sound-tools-Q-J34Sj65FQ-unsplash.jpg';
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

type Page = 'home' | 'product' | 'checkout';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [pendingScrollSection, setPendingScrollSection] = useState<string>('');

  const products: Product[] = [
    {
      id: 1,
      name: "AudioA Pro",
      description: "Prémium vezeték nélküli fejhallgató aktív zajszűréssel",
      price: 799,
      image: proImage
    },
    {
      id: 2,
      name: "AudioA Studio",
      description: "Professzionális stúdió monitor zenei produkciókhoz",
      price: 1099,
      image: studioImage
    }
  ];

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

  const addToCart = (id: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const fullProduct = products.find(p => p.id === id)!;
      return [...prev, { ...fullProduct, quantity: 1 }];
    });
    setCartOpen(true);

    // --- GOOGLE ANALYTICS MÉRÉS: KOSÁRBA RAKÁS ---
    ReactGA.event({
      category: "Webshop",
      action: "Kosarba_rakas",
      label: `Termek_ID_${id}`
    });
  };
 

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

 const handleCheckout = () => {
    setCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);

    // --- GOOGLE ANALYTICS MÉRÉS: FIZETÉS GOMB ---
    ReactGA.event({
      category: "Webshop",
      action: "Fizetes_kattintas",
      value: cartTotal
    });
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'product' && selectedProduct) {
    return (
      <div className="min-h-screen bg-white">
        {showWelcome && (
          <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl shadow-black/10">
              <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
                A
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
                className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Kezdés!
              </button>
            </div>
          </div>
        )}

        {!showWelcome && (
          <HeaderPro
            cartItems={cartItems}
            cartTotal={cartTotal}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={handleCheckout}
            isCartOpen={cartOpen}
            setCartOpen={setCartOpen}
            cartCount={cartCount}
            onLogoClick={navigateHome}
            onNavigateSection={navigateHomeAndScroll}
            animated={false}
            currentPage={currentPage}
          />
        )}

        <ProductDetailsStatic
          product={selectedProduct}
          onBack={navigateHome}
          onAddToCart={addToCart}
        />
        <FooterPro />

        {/* Cart dropdown is handled inside HeaderPro */}
      </div>
    );
  }

  if (currentPage === 'checkout') {
    return (
      <div className="min-h-screen bg-white">
        {showWelcome && (
          <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl shadow-black/10">
              <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
                A
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
                Kezdés!
              </button>
            </div>
          </div>
        )}

        {!showWelcome && (
          <HeaderPro
            cartItems={cartItems}
            cartTotal={cartTotal}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={handleCheckout}
            isCartOpen={cartOpen}
            setCartOpen={setCartOpen}
            cartCount={cartCount}
            onLogoClick={navigateHome}
            onNavigateSection={navigateHomeAndScroll}
            animated={false}
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
          animated={false}
        />
        <FooterPro />

        {cartOpen && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-black bg-opacity-50" 
              onClick={() => setCartOpen(false)}
            />
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 max-w-md bg-white shadow-2xl flex flex-col z-50">
              <div className="border-b border-gray-200 p-6 flex items-center justify-between bg-gray-50">
                <h2 className="text-2xl font-bold">Kosár</h2>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded font-bold">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">A kosarad üres.</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-bold">
                            Törlés
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 font-bold text-sm sm:text-base">-</button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 font-bold text-sm sm:text-base">+</button>
                          </div>
                          <p className="font-bold">RON {item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex justify-between mb-4 font-bold text-xl">
                    <span>Összesen:</span>
                    <span>RON {cartTotal}</span>
                  </div>
                  <button 
                    className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800"
                    onClick={handleCheckout}
                  >
                    Tovább a fizetéshez
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  
      return (
    <div className="min-h-screen bg-white">
      
      {/* --- FELUGRÓ ÜDVÖZLŐ ABLAK --- */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-black/10 p-8 max-w-lg text-center shadow-2xl shadow-black/10">
            <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
              A
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Üdvözöllek a kutatásomban!</h2>
            <p className="text-gray-700 mb-6 text-base sm:text-lg leading-7">
              Ez a weboldal egy szakdolgozat kutatás része. A feladatod nagyon egyszerű:
              <br/><br/>
              <strong className="text-black text-lg sm:text-xl">Nézz körül, és &quot;rendelj meg&quot; egy fejhallgatót!</strong>
              <br/><br/>
              A fizetésnél nyugodtan adj meg <strong>kamu adatokat</strong>, ez csak egy szimuláció. A rendelés végén egy rövid kérdőív vár rád.
            </p>
            <button 
              onClick={() => setShowWelcome(false)} 
              className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg"
            >
              Kezdés!
            </button>
          </div>
        </div>
      )}
      {/* --- FELUGRÓ ABLAK VÉGE --- */}

      {!showWelcome && (
        <HeaderPro
          cartItems={cartItems}
          cartTotal={cartTotal}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          isCartOpen={cartOpen}
          setCartOpen={setCartOpen}
          cartCount={cartCount}
          onLogoClick={navigateHome}
          onNavigateSection={navigateHomeAndScroll}
          animated={false}
          currentPage={currentPage}
        />
      )}

      {/* Main content padding for sticky header */}
      <div className="pt-20">

      {/* Hero Szekció */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Prémium Hangélmény</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Fedezd fel a kényelem, a stílus és a kiváló hangminőség tökéletes egyensúlyát.
            </p>
            <button 
              onClick={scrollToProducts}
              className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800"
            >
              Vásárlás
            </button>
          </div>
          <div>
            <img 
              src={landingImage} 
              alt="Premium AudioA"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

{/* Features Section */}
<section id="features" className="bg-gray-50 py-12 sm:py-16 md:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <h2 className="text-4xl text-center font-bold mb-16">
      Miért válassza az AudioA-t?
    </h2>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {[
        { title: "Studióhangzás. Bárhol.", description: "Lépjen be a részletgazdag hangzások világába. A precízen hangolt akusztika mély, telt basszusokat és kristálytiszta magasakat hoz el a mindennapjaiba." },
        { title: "Időtálló, prémium anyagok.", description: "Nemcsak szép, strapabíró is. Az eloxált alumínium zsanérok és a megerősített fejpánt garantálják, hogy a fejhallgató éveken át ellenálljon a mindennapi használat kihívásainak." },
        { title: "Hosszú üzemidő", description: "Felejtse el a folyamatos töltögetést. Az akár 40 órás üzemidő azt jelenti, hogy a fejhallgatója készen áll a teljes munkahétre, az utazásokra és a hétvégi kikapcsolódásra is." }
      ].map((feature, index) => (
        <div key={index} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full" />
          </div>
          <h3 className="text-lg sm:text-xl mb-2 sm:mb-3">{feature.title}</h3>
          <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Termékek Szekció */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <h2 className="text-4xl text-center font-bold mb-16">Kollekciónk</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
             <div style={{ height: '384px', overflow: 'hidden', position: 'relative', backgroundColor: '#f3f4f6' }}>
    <img 
      src={product.image} 
      alt={product.name} 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-xl font-bold mb-6 mt-auto">RON {product.price}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button 
                    className="flex-1 border-2 border-black text-black font-bold py-3 rounded hover:bg-gray-100"
                    onClick={() => viewProductDetails(product)}
                  >
                    Részletek
                  </button>
                  <button 
                    className="flex-1 bg-black text-white font-bold py-3 rounded hover:bg-gray-800"
                    onClick={() => addToCart(product.id)}
                  >
                    Kosárba
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      

      {/* Rólunk Szekció */}
<section id="about" className="bg-white py-20">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">A mi történetünk</p>
        <h2 className="text-4xl font-bold mb-6 leading-tight">
          A hangzás iránti szenvedély hajtja minden döntésünket.
        </h2>
        <p className="text-gray-600 mb-5 text-lg leading-relaxed">
          Az AudioA-t egy egyszerű küldetéssel alapítottuk: kivételes hangélményt nyújtani minden zene szerelmese számára. Hiszünk abban, hogy a kiváló hangzás nem lehet luxus — mindenki megérdemli.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Hangmérnökökből és tervezőkből álló csapatunk fáradhatatlanul dolgozik azon, hogy olyan fejhallgatókat hozzon létre, amelyek a legmodernebb technológiát ötvözik az időtálló dizájnnal.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { number: "40h", label: "Üzemidő egyetlen töltéssel" },
          { number: "2 év", label: "Teljes körű garancia" },
          { number: "Hi-Res", label: "Minősített hangzás" },
          { number: "250g", label: "Könnyű, kényelmes viselet" },
        ].map((stat) => (
          <div key={stat.number} className="border border-gray-100 rounded-2xl p-6">
            <p className="text-3xl font-bold mb-1">{stat.number}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      </div>

      {/* Cart dropdown handled in HeaderPro */}

      <FooterPro />
    </div>
  );
}