import { ArrowLeft, Check, ChevronLeft, ChevronRight, Star, ShoppingCart, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function ProductDetailsStatic({ product, onBack, onAddToCart, onBuyNow }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const proImages = [
    proSlide1,
    proSlide2,
    proSlide3,
    proSlide4,
    proSlide5,
  ];

  const studioImages = [
    studioSlide1,
    studioSlide2,
    studioSlide3,
    studioSlide4,
    studioSlide5,
  ];

  const galleryImages = product.id === 1 ? proImages : studioImages;
  const currentImage = galleryImages[currentImageIndex];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const selectImage = (index: number) => setCurrentImageIndex(index);

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
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024. December 15.",
      title: "A legjobb fejhallgató, amit valaha használtam",
      comment: "A zajszűrés hihetetlen! Munkahívásokhoz és zenéhez is használom. Az akkumulátor simán kibír egy egész hetet.",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "2024. December 10.",
      title: "Minden fillért megért",
      comment: "Lenyűgöző hangminőség. A basszus mély, de nem túlzó, a magas hangok pedig kristálytiszták. Nagyon kényelmes is!",
      verified: true
    }
  ] : [
    {
      id: 1,
      name: "Alex Martinez",
      rating: 5,
      date: "2024. December 18.",
      title: "Professzionális minőség",
      comment: "Az otthoni stúdiómban használom, és fenomenálisak. A részletgazdagság és a tisztaság páratlan. Minden hangszer tökéletesen elkülönül.",
      verified: true
    },
    {
      id: 2,
      name: "Lisa Thompson",
      rating: 5,
      date: "2024. December 12.",
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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Vissza
        </button>
      </div>

      {/* Hero Szekció */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="transition-transform duration-300">
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
          </div>

          <div>
            <h1 className="text-5xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              {product.description}
            </p>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-4xl font-bold">RON {product.price}</p>
                <p className="text-lg text-gray-500 line-through">RON {Math.round(product.price * 1.2)}</p>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">-17%</span>
              </div>
              <p className="text-gray-500 text-sm">✓ Ingyenes szállítás | 30 napos visszavásárlás | 2 év garancia</p>
            </div>

            <div className="space-y-3">
              <button
                className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                onClick={() => onBuyNow ? onBuyNow(product.id, product.name, product.price) : onAddToCart(product.id, product.name, product.price)}
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span className="relative z-10">Vásárlás most</span>
                <div className="absolute inset-0 bg-gray-700" />
              </button>

              <button
                className="w-full border-2 border-black text-black font-bold py-3 rounded-xl text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                onClick={() => onAddToCart(product.id, product.name, product.price)}
              >
                <ShoppingCart className="w-5 h-5" />
                Kosárba
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Jellemzők Szekció */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl text-center font-bold mb-16">
            A doboz tartalma és jellemzők
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-100 hover:border-black hover:shadow-lg transition-all cursor-default"
              >
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 font-medium">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technikai adatok */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl text-center font-bold mb-16">
            Műszaki adatok
          </h2>
          <div className="max-w-3xl mx-auto">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-6 flex justify-between items-center px-4 rounded transition-all hover:bg-gray-50"
              >
                <span className="text-gray-600 font-medium">{spec.label}</span>
                <span className="font-bold">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Értékelések */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Vásárlói értékelések
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star}>
                    <Star
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <span className="text-xl font-bold">{averageRating.toFixed(1)} / 5</span>
            </div>
            <p className="text-gray-600">{reviews.length} értékelés alapján</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{review.name}</p>
                        {review.verified && (
                          <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                            ✓ Igazolt vásárlás
                          </div>
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

                <button className="mt-4 text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                  Hasznos volt ez az értékelés? →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Kész vagy a következő szintre lépni?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Csatlakozz a prémium hangzás világához még ma!
          </p>
          <button
            onClick={() => onBuyNow ? onBuyNow(product.id, product.name, product.price) : onAddToCart(product.id, product.name, product.price)}
            className="bg-white text-black font-bold py-4 px-12 rounded-xl text-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <Zap className="w-6 h-6" />
            Vásárlás most
          </button>
        </div>
      </section>
    </div>
  );
}