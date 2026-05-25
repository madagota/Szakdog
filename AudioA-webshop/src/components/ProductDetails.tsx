import { ArrowLeft, Check, ChevronLeft, ChevronRight, Star, ShoppingCart, Zap, Battery, Headphones, Volume2, Eye, Clock, Layers, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import React from 'react';
import proSlide1 from '../assets/pexels-caleboquendo-7772549.jpg';
import proSlide2 from '../assets/pexels-caleboquendo-7772547.jpg';
import proSlide3 from '../assets/pexels-dario-fernandez-ruz-9130505.jpg';
import proSlide4 from '../assets/pexels-caleboquendo-7772548.jpg';
import proSlide5 from '../assets/pexels-dario-fernandez-ruz-9130519.jpg';
import studioSlide1 from '../assets/sound-tools-2QUUKTJUKgI-unsplash.jpg';
import studioSlide2 from '../assets/sound-tools-FsfL94sfgzI-unsplash.jpg';
import studioSlide3 from '../assets/sound-tools-NOCwdxBRGJA-unsplash.jpg';
import studioSlide4 from '../assets/sound-tools-o64nE3PW2cE-unsplash.jpg';
import studioSlide5 from '../assets/sound-tools-Q-J34Sj65FQ-unsplash.jpg';

const AnimatedElement = ({ as = 'div', animated, ...props }: Record<string, unknown> & { as?: string; animated?: boolean }) => {
  if (animated) {
    const MotionComponent = (motion as unknown as Record<string, React.ElementType>)[as] || motion.div;
    return <MotionComponent {...props} />;
  }
  const Component = as;
  return <Component {...props} />;
};

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onBack: () => void;
  onAddToCart: (id: number, name: string, price: number) => void;
  onBuyNow?: (id: number, name: string, price: number) => void;
  animated?: boolean;
}

export default function ProductDetailsAnimated({ product, onBack, onAddToCart, onBuyNow, animated = true }: ProductDetailsProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const proImages = [proSlide1, proSlide2, proSlide3, proSlide4, proSlide5];
  const studioImages = [studioSlide1, studioSlide2, studioSlide3, studioSlide4, studioSlide5];
  const galleryImages = product.id === 1 ? proImages : studioImages;



  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const handlePrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const selectImage = (index: number) => setCurrentImageIndex(index);

  const handleAddToCart = () => {
    onAddToCart(product.id, product.name, product.price);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1200);
  };

  const featureIcons = [Volume2, Eye, Headphones, Battery, Layers, Clock, Zap, Package];

  const features = [
    "Aktív zajszűrés a lenyűgöző hangzásért",
    "Transzparencia mód a környezet érzékeléséhez",
    "Adaptív EQ, ami automatikusan a füledhez hangolja a zenét",
    "Akár 40 óra akkumulátor-üzemidő",
    "Prémium memóriahabos párnák az egész napos kényelemért",
    "Térbeli hangzás dinamikus fejkövetéssel",
    "USB-C gyorstöltési lehetőség",
    "Összecsukható dizájn prémium hordtáskával"
  ];

  const specs = [
    { label: "Hangszóró mérete", value: "40mm" },
    { label: "Frekvenciaátvitel", value: "20Hz - 20kHz" },
    { label: "Impedancia", value: "32 Ohm" },
    { label: "Súly", value: "250g" },
    { label: "Bluetooth", value: "5.2" },
    { label: "Támogatott kodekek", value: "AAC, aptX HD, LDAC" },
    { label: "Töltési idő", value: "2 óra" },
    { label: "Garancia", value: "2 év" }
  ];

  const reviews = product.id === 1 ? [
    { id: 1, name: "Sarah Johnson", rating: 5, date: "2024. December 15.", title: "A legjobb fejhallgató, amit valaha használtam", comment: "A zajszűrés hihetetlen! Munkahívásokhoz és zenéhez is használom. Az akkumulátor simán kibír egy egész hetet.", verified: true },
    { id: 2, name: "Michael Chen", rating: 5, date: "2024. December 10.", title: "Minden fillért megért", comment: "Lenyűgöző hangminőség. A basszus mély, de nem túlzó, a magas hangok pedig kristálytiszták. Nagyon kényelmes is!", verified: true }
  ] : [
    { id: 1, name: "Alex Martinez", rating: 5, date: "2024. December 18.", title: "Professzionális minőség", comment: "Az otthoni stúdiómban használom, és fenomenálisak. A részletgazdagság és a tisztaság páratlan. Minden hangszer tökéletesen elkülönül.", verified: true },
    { id: 2, name: "Lisa Thompson", rating: 5, date: "2024. December 12.", title: "Tökéletes keveréshez", comment: "A lapos frekvenciaválasz miatt ideális keveréshez. Végre hallom, hogyan szólnak valójában a zenéim színezés nélkül.", verified: true }
  ];

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigáció */}
      <div className="max-w-7xl mx-auto px-6 py-6 sticky top-20 z-10 bg-white bg-opacity-95 backdrop-blur-sm">
        <AnimatedElement as="button" animated={animated} onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors"
          whileHover={animated ? { x: -4 } : undefined} whileTap={animated ? { scale: 0.95 } : undefined}>
          <ArrowLeft className="w-5 h-5" />
          Vissza
        </AnimatedElement>
      </div>

      {/* Hero Szekció */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Képgaléria swipe + fade */}
          <AnimatedElement as="div" animated={animated}
            initial={animated ? { opacity: 0, x: -50 } : undefined}
            animate={animated ? { opacity: 1, x: 0 } : undefined}
            transition={animated ? { duration: 0.6 } : undefined}
            whileHover={animated ? { scale: 1.02 } : undefined}
            className="transition-transform duration-300">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100"
              onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
              onTouchEnd={(e) => {
                const diff = touchStart - e.changedTouches[0].clientX;
                if (diff > 50) handleNextImage();
                if (diff < -50) handlePrevImage();
              }}>

              {/* Fade animáció képváltáskor */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={galleryImages[currentImageIndex]}
                  alt={`${product.name} kép ${currentImageIndex + 1}`}
                  className="w-full h-[520px] sm:h-[560px] object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              <button onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white w-11 h-11 flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                aria-label="Előző kép">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white w-11 h-11 flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                aria-label="Következő kép">
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-3 py-2">
                {galleryImages.map((image, index) => (
                  <motion.button key={image} onClick={() => selectImage(index)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${index === currentImageIndex ? 'border-white' : 'border-transparent'}`}
                    whileHover={animated ? { scale: 1.15 } : undefined}
                    whileTap={animated ? { scale: 0.9 } : undefined}
                    aria-label={`Kép ${index + 1}`}>
                    <img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>
          </AnimatedElement>

          {/* Termék info */}
          <AnimatedElement as="div" animated={animated}
            initial={animated ? { opacity: 0, x: 50 } : undefined}
            animate={animated ? { opacity: 1, x: 0 } : undefined}
            transition={animated ? { duration: 0.6, delay: 0.1 } : undefined}>

            <AnimatedElement as="h1" animated={animated} className="text-5xl font-bold mb-4"
              initial={animated ? { opacity: 0, y: 20 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              transition={animated ? { duration: 0.6, delay: 0.2 } : undefined}>
              {product.name}
            </AnimatedElement>

            <AnimatedElement as="p" animated={animated} className="text-2xl text-gray-600 mb-8"
              initial={animated ? { opacity: 0, y: 20 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              transition={animated ? { duration: 0.6, delay: 0.3 } : undefined}>
              {product.description}
            </AnimatedElement>

            <AnimatedElement as="div" animated={animated} className="mb-8"
              initial={animated ? { opacity: 0, y: 20 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              transition={animated ? { duration: 0.6, delay: 0.4 } : undefined}>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-4xl font-bold">RON {product.price}</p>
                <p className="text-lg text-gray-500 line-through">RON {Math.round(product.price * 1.2)}</p>
                <motion.span
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold inline-block"
                  animate={animated ? { scale: [1, 1.08, 1] } : undefined}
                  transition={animated ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}>
                  -17%
                </motion.span>
              </div>
              <p className="text-gray-500 text-sm">✓ Ingyenes szállítás | 30 napos visszavásárlás | 2 év garancia</p>
            </AnimatedElement>

            <AnimatedElement as="div" animated={animated} className="space-y-3"
              initial={animated ? { opacity: 0, y: 20 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              transition={animated ? { duration: 0.6, delay: 0.5 } : undefined}>

              {/* Vásárlás most gomb */}
              <AnimatedElement as="button" animated={animated}
                className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 group relative overflow-hidden"
                onClick={() => onBuyNow ? onBuyNow(product.id, product.name, product.price) : handleAddToCart()}
                whileHover={animated ? { scale: 1.02 } : undefined}
                whileTap={animated ? { scale: 0.98 } : undefined}>
                <Zap className="w-5 h-5 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">Vásárlás most</span>
                <motion.div className="absolute inset-0 bg-gray-700" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
              </AnimatedElement>

              {/* Kosárba gomb ✓ visszajelzéssel */}
              <AnimatedElement as="button" animated={animated}
                className={`w-full border-2 font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors ${cartAdded ? 'bg-green-600 border-green-600 text-white' : 'border-black text-black hover:bg-gray-50'}`}
                onClick={handleAddToCart}
                whileHover={animated && !cartAdded ? { scale: 1.02 } : undefined}
                whileTap={animated ? { scale: 0.98 } : undefined}
                disabled={cartAdded}>
                <AnimatePresence mode="wait">
                  {cartAdded ? (
                    <motion.span key="added" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      ✓ Hozzáadva
                    </motion.span>
                  ) : (
                    <motion.span key="add" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      <ShoppingCart className="w-5 h-5" />
                      Kosárba
                    </motion.span>
                  )}
                </AnimatePresence>
              </AnimatedElement>
            </AnimatedElement>
          </AnimatedElement>
        </div>
      </section>

      {/* Jellemzők Szekció */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement as="h2" animated={animated} className="text-4xl text-center font-bold mb-16"
            initial={animated ? { opacity: 0, y: 20 } : undefined}
            whileInView={animated ? { opacity: 1, y: 0 } : undefined}
            viewport={animated ? { once: true } : undefined}
            transition={animated ? { duration: 0.6 } : undefined}>
            A doboz tartalma és jellemzők
          </AnimatedElement>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = featureIcons[index] || Check;
              return (
                <AnimatedElement as="div" animated={animated} key={index}
                  className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-100 hover:border-black hover:shadow-lg transition-all cursor-default"
                  initial={animated ? { opacity: 0, y: 20 } : undefined}
                  whileInView={animated ? { opacity: 1, y: 0 } : undefined}
                  viewport={animated ? { once: true } : undefined}
                  transition={animated ? { duration: 0.4, delay: index * 0.05 } : undefined}
                  onMouseEnter={animated ? () => setHoveredFeature(index) : undefined}
                  onMouseLeave={animated ? () => setHoveredFeature(-1) : undefined}>
                  <AnimatedElement as="div" animated={animated}
                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    animate={animated ? { scale: hoveredFeature === index ? 1.2 : 1 } : undefined}
                    transition={animated ? { type: 'spring', stiffness: 300 } : undefined}>
                    <Icon className="w-4 h-4 text-white" />
                  </AnimatedElement>
                  <AnimatedElement as="p" animated={animated} className="text-gray-700 font-medium"
                    animate={animated ? { x: hoveredFeature === index ? 4 : 0 } : undefined}
                    transition={animated ? { type: 'spring', stiffness: 300 } : undefined}>
                    {feature}
                  </AnimatedElement>
                </AnimatedElement>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technikai adatok */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement as="h2" animated={animated} className="text-4xl text-center font-bold mb-16"
            initial={animated ? { opacity: 0, y: 20 } : undefined}
            whileInView={animated ? { opacity: 1, y: 0 } : undefined}
            viewport={animated ? { once: true } : undefined}
            transition={animated ? { duration: 0.6 } : undefined}>
            Műszaki adatok
          </AnimatedElement>
          <div className="max-w-3xl mx-auto">
            {specs.map((spec, index) => (
              <AnimatedElement as="div" animated={animated} key={index}
                className="border-b border-gray-200 py-6 flex justify-between items-center px-4 rounded transition-all hover:bg-gray-50"
                initial={animated ? { opacity: 0, x: -20 } : undefined}
                whileInView={animated ? { opacity: 1, x: 0 } : undefined}
                viewport={animated ? { once: true } : undefined}
                transition={animated ? { duration: 0.4, delay: index * 0.03 } : undefined}
                whileHover={animated ? { paddingLeft: 20 } : undefined}>
                <span className="text-gray-600 font-medium">{spec.label}</span>
                <AnimatedElement as="span" animated={animated} className="font-bold"
                  whileHover={animated ? { scale: 1.1, color: '#000' } : undefined}>
                  {spec.value}
                </AnimatedElement>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Értékelések */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2 className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              Vásárlói értékelések
            </motion.h2>
            <motion.div className="flex items-center justify-center gap-2 mb-2"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              onMouseEnter={() => setShowRating(true)} onMouseLeave={() => setShowRating(false)}>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div key={star} animate={{ scale: showRating ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}>
                    <Star className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </motion.div>
                ))}
              </div>
              <span className="text-xl font-bold">{averageRating.toFixed(1)} / 5</span>
            </motion.div>
            <p className="text-gray-600">{reviews.length} értékelés alapján</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <motion.div key={review.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      whileHover={{ scale: 1.1 }}>
                      {review.name.charAt(0)}
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{review.name}</p>
                        {review.verified && (
                          <motion.div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}>
                            ✓ Igazolt vásárlás
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                <motion.button className="mt-4 text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2"
                  whileHover={{ x: 4 }}>
                  Hasznos volt ez az értékelés? →
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA – fekete, seamless a footerrel */}
      <section className="bg-black py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 className="text-4xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            Tapasztald meg az AudioA minőséget
          </motion.h2>
          <motion.p className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            Ingyenes szállítás minden rendelésre. 30 napos visszavásárlási garancia.
          </motion.p>
          <motion.button
            className="bg-white text-black font-bold px-12 py-4 rounded-xl text-lg group relative overflow-hidden flex items-center justify-center gap-2 mx-auto"
            onClick={() => onBuyNow ? onBuyNow(product.id, product.name, product.price) : handleAddToCart()}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ShoppingCart className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
            <span className="relative z-10">Vásárlás most - RON {product.price}</span>
            <motion.div className="absolute inset-0 bg-gray-200" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
          </motion.button>
        </div>
      </section>

      {/* Sticky bottom bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">{product.name}</p>
                <p className="text-gray-600 text-sm">RON {product.price}</p>
              </div>
              <motion.button
                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${cartAdded ? 'bg-green-600 text-white' : 'bg-black text-white'}`}
                onClick={handleAddToCart}
                whileHover={!cartAdded ? { scale: 1.03 } : undefined}
                whileTap={{ scale: 0.96 }}
                disabled={cartAdded}>
                <AnimatePresence mode="wait">
                  {cartAdded ? (
                    <motion.span key="added" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      ✓ Hozzáadva
                    </motion.span>
                  ) : (
                    <motion.span key="add" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      <ShoppingCart className="w-4 h-4" />
                      Kosárba
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}