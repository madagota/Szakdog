import { useState } from 'react';
import { X } from 'lucide-react';
import ProductDetails from './components/ProductDetails';
import { Checkout } from './components/Checkout';
import { HeaderPro } from './components/HeaderPro';
import { FooterPro } from './components/FooterPro';
import ReactGA from "react-ga4";
import ImageWithFallback from './components/figma/ImageWithFallback';

// Import images from assets
import proImage from './assets/birgith-roosipuu-6jMXHpbpL0M-unsplash.jpg';
import studioImage from './assets/sound-tools-2QUUKTJUKgI-unsplash.jpg';
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

  const products: Product[] = [
    {
      id: 1,
      name: "AudioA Pro",
      description: "Prémium vezeték nélküli fejhallgató aktív zajszűréssel",
      price: 299,
      image: proImage
    },
    {
      id: 2,
      name: "AudioA Studio",
      description: "Professzionális stúdió monitor zenei produkciókhoz",
      price: 399,
      image: studioImage
    }
  ];

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
      <ProductDetails
        product={selectedProduct}
        onBack={() => setCurrentPage('home')}
        onAddToCart={addToCart}
      />
    );
  }

  if (currentPage === 'checkout') {
    return (
      <Checkout
        cartItems={cartItems}
        cartTotal={cartTotal}
        onBack={() => {
          setCurrentPage('home');
          setCartOpen(true);
        }}
        onComplete={handleCheckoutComplete}
      />
    );
  }

  
      return (
    <div className="min-h-screen bg-white">
      
      {/* --- FELUGRÓ ÜDVÖZLŐ ABLAK --- */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Üdvözöllek a kutatásomban!</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Ez a weboldal egy szakdolgozat kutatás része. A feladatod nagyon egyszerű: 
              <br/><br/>
              <strong className="text-black text-xl">Nézz körül, és "rendelj meg" egy fejhallgatót!</strong>
              <br/><br/>
              A fizetésnél nyugodtan adj meg kamu adatokat, ez csak egy szimuláció. A rendelés végén egy nagyon rövid kérdőív vár rád. Köszönöm a segítséged!
            </p>
            <button 
              onClick={() => setShowWelcome(false)} 
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Értettem, kezdjük a tesztet!
            </button>
          </div>
        </div>
      )}
      {/* --- FELUGRÓ ABLAK VÉGE --- */}

      <HeaderPro
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onLogoClick={() => setCurrentPage('home')}
        animated={false}
      />

      {/* Main content padding for sticky header */}
      <div className="pt-20">

      {cartOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50" 
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 max-w-md bg-white shadow-2xl flex flex-col z-50">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between bg-gray-50">
              <h2 className="text-2xl font-bold">Kosár</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-200 rounded font-bold">
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
                        <p className="font-bold">${item.price * item.quantity}</p>
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
                  <span>${cartTotal}</span>
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
              src="https://images.unsplash.com/photo-1657223143933-33ceab36ecb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaGVhZHBob25lcyUyMGJsYWNrfGVufDF8fHx8MTc2Njc0MTg3NHww&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Premium AudioA"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Termékek Szekció */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <h2 className="text-4xl text-center font-bold mb-16">Kollekciónk</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
              <img 
                src={product.image}
                alt={product.name}
               className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-xl font-bold mb-6 mt-auto">${product.price}</p>
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

      {/* Jellemzők Szekció */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl text-center font-bold mb-16">Miért válassza az AudioA-t?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kiváló hangzás</h3>
              <p className="text-gray-600">
                Tapasztalja meg a stúdió minőségű hangzást mély basszussal és kristálytiszta magasakkal.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3">Egész napos kényelem</h3>
              <p className="text-gray-600">
                Ergonomikus kialakítás prémium párnázással a hosszú zenehallgatáshoz.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hosszú üzemidő</h3>
              <p className="text-gray-600">
                Akár 40 óra vezeték nélküli lejátszás egyetlen töltéssel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rólunk Szekció */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Rólunk</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Az AudioA egy egyszerű küldetéssel indult: hogy kivételes hangélményt nyújtson mindenkinek, aki szereti a zenét. Hiszünk abban, hogy a nagyszerű hangzás nem lehet luxus.
          </p>
          <p className="text-gray-600 text-lg">
            Hangmérnökeinkből és tervezőinkből álló csapatunk fáradhatatlanul dolgozik azon, hogy olyan fejhallgatókat alkosson, amelyek ötvözik a legmodernebb technológiát az időtlen dizájnnal.
          </p>
        </div>
      </section>

      </div>

      <FooterPro />
    </div>
  );
}