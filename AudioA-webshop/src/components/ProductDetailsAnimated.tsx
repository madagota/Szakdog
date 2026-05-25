import { ArrowLeft, Check, ChevronLeft, ChevronRight, Star, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
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
}

export default function ProductDetailsAnimated({ product, onBack, onAddToCart, onBuyNow }: ProductDetailsProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [imageState, setImageState] = useState({ productId: product.id, index: 0 });
const [showAddedCheckmark, setShowAddedCheckmark] = useState(false);

const proImages = [proSlide1, proSlide2, proSlide3, proSlide4, proSlide5];
const studioImages = [studioSlide1, studioSlide2, studioSlide3, studioSlide4, studioSlide5];
const galleryImages = product.id === 1 ? proImages : studioImages;

const currentImageIndex = imageState.productId === product.id ? imageState.index : 0;
const currentImage = galleryImages[currentImageIndex];
const handleNextImage = () =>
  setImageState({ productId: product.id, index: (currentImageIndex + 1) % galleryImages.length });

const handlePrevImage = () =>
  setImageState({ productId: product.id, index: (currentImageIndex - 1 + galleryImages.length) % galleryImages.length });

const selectImage = (index: number) =>
  setImageState({ productId: product.id, index });

  const handleAddToCartWithCheckmark = (id: number, name: string, price: number) => {
    setShowAddedCheckmark(true);
    onAddToCart(id, name, price);
    setTimeout(() => setShowAddedCheckmark(false), 1000);
  };

  const features = product.id === 1 ? [
    "Aktív zajszűrés a lenyűgöző hangzásért",
    "Transzparencia mód a környezet érzékeléséhez",
    "Adaptív EQ, ami automatikusan a füledhez hangolja a zenét",
    "Akár 40 óra akkumulátor-üzemidő",
    "Prémium memóriahabos párnák az egész napos kényelemért",
    "4-mikrofonos beamforming technológia a krisztálytiszta hivásokért.",
    "USB-C villámgyors töltési lehetőség",
    "Összecsukható dizájn prémium hordtáskával.",
  ] : [
    "Intelligens hibrid zajszűrés a zavartalan fókuszért és stúdióélményért.",
    "Transzparencia mód a környezet azonnali, természetes érzékeléséhez.",
    "Adaptív EQ és stúdió-profilok a fülhöz és műfajhoz igazodó hangzásért.",
    "Kiemelkedő, 40 órás üzemidő vezeték nélküli stúdióreferencia-módban.",
    "Pro-szintű memóriahabos párnák a nyomásmentes, egész napos kényelemért.",
    "Térbeli hangzás dinamikus fejkövetéssel a magával ragadó dimenziókért.",
    "USB-C gyorstöltési lehetőség",
    "Robusztus, fémvázas konstrukció és prémium keménytok az időtálló védelemért.",
  ];

  const specs = product.id === 1 ? [
    { label: "Hangszóró mérete", value: "40mm-es High-Definition dinamikus driver" },
    { label: "Frekvenciaátvitel", value: "20Hz - 20kHz" },
    { label: "Mikrofonok", value: "4 db beépített mikrofon szél- és környezeti zajszűréssel" },
    { label: "Súly", value: "230g" },
    { label: "Bluetooth®", value: "5.3" },
    { label: "Támogatott kodekek", value: "AAC, SBC, aptX Adaptive" },
    { label: "Akkumulátor", value: "Akár 40 óra" },
    { label: "Garancia", value: "2 év" },
  ] : [
    { label: "Hangszóró mérete", value: "40mm-es egyedi fejlesztésű dinamikus driver" },
    { label: "Frekvenciaátvitel", value: "4Hz - 40.000 Hz (Hi-Res Audio)" },
    { label: "Impedancia", value: "32 Ohm" },
    { label: "Súly", value: "250g" },
    { label: "Bluetooth®", value: "5.2" },
    { label: "Támogatott kodekek", value: "AAC, aptX HD, LDAC" },
    { label: "Töltési idő", value: "2 óra" },
    { label: "Garancia", value: "2 év" },
  ];

    const reviews = product.id === 1 ? [
    {
      id: 1,
      name: "Fekete Sára",
      rating: 5,
      date: "2025. December 15.",
      title: "A legjobb fejhallgató, amit valaha használtam",
      comment: "A zajszűrés hihetetlen! Munkahívásokhoz és zenéhez is használom. Az akkumulátor simán kibír egy egész hetet.",
      verified: true
    },
    {
      id: 2,
      name: "Szabó Péter",
      rating: 5,
      date: "2026. Április 10.",
      title: "Minden fillért megért",
      comment: "Lenyűgöző hangminőség. A basszus mély, de nem túlzó, a magas hangok pedig kristálytiszták. Nagyon kényelmes is!",
      verified: true
    }
  ] : [
    {
      id: 1,
      name: "Kovács István",
      rating: 5,
      date: "2025. Augusztus 18.",
      title: "Professzionális minőség",
      comment: "Az otthoni stúdiómban használom, és fenomenálisak. A részletgazdagság és a tisztaság páratlan. Minden hangszer tökéletesen elkülönül.",
      verified: true
    },
    {
      id: 2,
      name: "Nagy Anna",
      rating: 5,
      date: "2026. Január 22.",
      title: "Tökéletes keveréshez",
      comment: "A lapos frekvenciaválasz miatt ideális keveréshez. Végre hallom, hogyan szólnak valójában a zenéim színezés nélkül.",
      verified: true
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigáció */}
      <div className="max-w-7xl mx-auto px-6 py-6 sticky top-0 z-10 bg-white bg-opacity-95 backdrop-blur-sm">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Vissza
        </motion.button>
      </div>

      {/* Hero Szekció */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="transition-transform duration-300"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
              <img
                src={currentImage}
                alt={`${product.name} kép ${currentImageIndex + 1}`}
                className="w-full h-[520px] sm:h-[560px] object-contain"
              />

              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white w-11 h-11 flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                aria-label="Előző kép"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white w-11 h-11 flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                aria-label="Következő kép"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-3 py-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => selectImage(index)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${index === currentImageIndex ? 'border-white' : 'border-transparent'} transition-all duration-200`}
                    aria-label={`Kép ${index + 1}`}
                  >
                    <img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              {product.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl text-gray-600 mb-8"
            >
              {product.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-4xl font-bold">RON {product.price}</p>
                <p className="text-lg text-gray-500 line-through">RON {Math.round(product.price * 1.2)}</p>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">-17%</span>
              </div>
              <p className="text-gray-500 text-sm">✓ Ingyenes szállítás | 30 napos visszavásárlás | 2 év garancia</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3"
            >
              <motion.button
                className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                onClick={() => onBuyNow ? onBuyNow(product.id, product.name, product.price) : onAddToCart(product.id, product.name, product.price)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span className="relative z-10">Vásárlás most</span>
                <motion.div className="absolute inset-0 bg-gray-700" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
              </motion.button>

              <motion.button
                className="w-full border-2 border-black text-black font-bold py-3 rounded-xl text-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                onClick={() => handleAddToCartWithCheckmark(product.id, product.name, product.price)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                {showAddedCheckmark ? (
                  <>
                    <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check className="w-5 h-5 text-green-600" />
                    </motion.span>
                    <span className="text-green-600">Hozzáadva!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Kosárba
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Jellemzők Szekció */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-4xl text-center font-bold mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            A doboz tartalma és jellemzők
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-100 hover:border-black hover:shadow-lg transition-all cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div
                  className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  animate={{ scale: hoveredFeature === index ? 1.2 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
                <motion.p
                  className="text-gray-700 font-medium"
                  animate={{ x: hoveredFeature === index ? 4 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technikai adatok */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-4xl text-center font-bold mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Műszaki adatok
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            {specs.map((spec, index) => (
              <motion.div
                key={index}
                className="border-b border-gray-200 py-6 flex justify-between items-center px-4 rounded transition-all hover:bg-gray-50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{ paddingLeft: 20 }}
              >
                <span className="text-gray-600 font-medium">{spec.label}</span>
                <motion.span
                  className="font-bold"
                  whileHover={{ scale: 1.1, color: '#000' }}
                >
                  {spec.value}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Értékelések */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Vásárlói értékelések
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-2 mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onMouseEnter={() => setShowRating(true)}
              onMouseLeave={() => setShowRating(false)}
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    animate={{ scale: showRating ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-xl font-bold">{averageRating.toFixed(1)} / 5</span>
            </motion.div>
            <p className="text-gray-600">{reviews.length} értékelés alapján</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      {review.name.charAt(0)}
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{review.name}</p>
                        {review.verified && (
                          <motion.div
                            className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
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
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>

                <motion.button
                  className="mt-4 text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2"
                  whileHover={{ x: 4 }}
                >
                  Hasznos volt ez az értékelés? →
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tapasztald meg az AudioA minőséget
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ingyenes szállítás minden rendelésre. 30 napos visszavásárlási garancia.
          </motion.p>
          <motion.button
            className="bg-white text-black font-bold px-12 py-4 rounded-xl text-lg hover:bg-gray-200 transition-all group relative overflow-hidden flex items-center justify-center gap-2 mx-auto"
            onClick={() => onBuyNow ? onBuyNow(product.id, product.name, product.price) : onAddToCart(product.id, product.name, product.price)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
            Vásárlás most - RON {product.price}
            <motion.div className="absolute inset-0 bg-gray-300" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
          </motion.button>
        </div>
      </section>
    </div>
  );
}