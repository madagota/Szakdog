import { ArrowLeft, Check, CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';
import { HeadphoneCableProgress } from './HeadphoneCableProgress';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onBack: () => void;
  onComplete: () => void;
  animated?: boolean;
}

export function Checkout({ cartItems, cartTotal, onBack, onComplete, animated = false }: CheckoutProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'complete'>('shipping');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Kérjük, adjon meg egy érvényes email címet';
    }
    if (formData.firstName.length < 2) {
      newErrors.firstName = 'A keresztnévnek legalább 2 karakternek kell lennie';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Szimulált fizetés feldolgozás
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('complete');
  };

  const surveyLink = animated
    ? 'https://docs.google.com/forms/d/e/1FAIpQLSczKAC17GkbSNjcxGOudJq5N5QIYj-renC1ihVkzXr77qdaYw/viewform?usp=pp_url&entry.1582522446=B_verzio'
    : 'https://docs.google.com/forms/d/e/1FAIpQLSczKAC17GkbSNjcxGOudJq5N5QIYj-renC1ihVkzXr77qdaYw/viewform?usp=pp_url&entry.1582522446=A+_verzio';

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center bg-black text-white p-8 rounded-[32px] border border-black shadow-2xl shadow-black/10">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white text-black text-4xl font-bold shadow-lg">
            ✓
          </div>
          <h2 className="text-4xl mb-4 font-bold">Rendelés sikeres!</h2>
          <p className="text-gray-200 mb-8 text-lg leading-8">
            A feladat kész! Most még csak egy lépés maradt hátra: töltsd ki a kérdőívet.
          </p>
          
          <div className="bg-white text-black p-6 rounded-3xl border border-black/10 shadow-md mb-8">
            <h3 className="font-bold text-2xl mb-3">Kérlek, töltsd ki a kérdőívet!</h3>
            <p className="text-gray-600 mb-6 text-sm leading-6">
              Ez maximum 2 percet vesz igénybe, de a szakdolgozatomhoz elengedhetetlen, hogy megtudjam, milyen volt a weboldal használata.
            </p>
            <a 
              href={surveyLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors shadow-lg"
            >
              Kérdőív megnyitása
            </a>
          </div>

          <button
            onClick={onComplete}
            className="text-gray-300 hover:text-white font-bold text-sm"
          >
            Vissza a webshop kezdőlapjára
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
          Vissza a kosárhoz
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Folyamatjelző */}
        {animated ? (
          <HeadphoneCableProgress step={step} />
        ) : (
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className={step === 'shipping' ? "text-black border-b-2 border-black pb-1" : "text-gray-400"}>1. Szállítási adatok</span>
              <span className="text-gray-300">/</span>
              <span className={step === 'payment' ? "text-black border-b-2 border-black pb-1" : "text-gray-400"}>2. Fizetés</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Bal oszlop - Űrlap */}
          <div>
            <h1 className="text-4xl mb-8 font-bold">Pénztár</h1>

            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                
                {/* Statikus Input mezők a lebegő animáltak helyett */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keresztnév</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vezetéknév</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cím</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Város</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Megye</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Irányítószám</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800">
                  Tovább a fizetéshez
                </button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">Biztonságos Fizetés</p>
                    <p className="text-xs text-blue-700">A fizetési adatai titkosítva vannak</p>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Kártyaszám</label>
                   <div className="relative">
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" required className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                      <CreditCard className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lejárati dátum</label>
                    <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="HH/ÉÉ" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep('shipping')} className="flex-1 border border-gray-300 py-4 rounded-xl font-bold hover:bg-gray-100">
                    Vissza
                  </button>
                  <button type="submit" className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800">
                    Fizetés RON {cartTotal}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Jobb oszlop - Rendelés összesítő */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl mb-6 font-bold">Rendelés Összesítése</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-600">Mennyiség: {item.quantity}</p>
                    </div>
                    <p className="font-bold">RON {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Részösszeg</span>
                  <span>RON {cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Szállítás</span>
                  <span>Ingyenes</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Adó (10%)</span>
                  <span>RON {(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                  <span>Végösszeg</span>
                  <span>RON {(cartTotal * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Ingyenes szállítás minden rendelésre</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>30 napos visszavásárlási garancia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>2 év garancia a termékekre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}