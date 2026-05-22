import { ArrowLeft, Check, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { HeadphoneCableProgress } from './HeadphoneCableProgress';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorMsgProps { error?: string }
function ErrorMsg({ error }: ErrorMsgProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

interface ValidCheckProps { show: boolean }
function ValidCheck({ show }: ValidCheckProps) {
  if (!show) return null;
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <Check className="w-4 h-4 text-green-500" />
    </div>
  );
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isFieldValid = (name: string): boolean => {
    if (!touched[name]) return false;
    const value = formData[name as keyof typeof formData];
    switch (name) {
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'firstName':
      case 'lastName': return value.length >= 2;
      case 'address':
      case 'city':
      case 'state': return value.length >= 2;
      case 'zipCode': return /^\d{4,6}$/.test(value);
      case 'cardNumber': return value.replace(/\s/g, '').length === 16;
      case 'expiry': return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
      case 'cvv': return /^\d{3,4}$/.test(value);
      default: return value.length > 0;
    }
  };

  const validateShipping = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Érvényes email cím szükséges';
    if (formData.firstName.length < 2)
      newErrors.firstName = 'Legalább 2 karakter szükséges';
    if (formData.lastName.length < 2)
      newErrors.lastName = 'Legalább 2 karakter szükséges';
    if (formData.address.length < 2)
      newErrors.address = 'Cím megadása kötelező';
    if (formData.city.length < 2)
      newErrors.city = 'Város megadása kötelező';
    if (formData.state.length < 2)
      newErrors.state = 'Megye megadása kötelező';
    if (!/^\d{4,6}$/.test(formData.zipCode))
      newErrors.zipCode = 'Érvényes irányítószám szükséges';
    return newErrors;
  };

  const validatePayment = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (formData.cardNumber.replace(/\s/g, '').length !== 16)
      newErrors.cardNumber = '16 számjegy szükséges';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry))
      newErrors.expiry = 'Érvényes dátum szükséges (HH/ÉÉ)';
    if (!/^\d{3,4}$/.test(formData.cvv))
      newErrors.cvv = '3-4 számjegy szükséges';
    return newErrors;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateShipping();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validatePayment();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStep('complete');
  };

  const surveyLink = animated
    ? 'https://docs.google.com/forms/d/e/1FAIpQLSczKAC17GkbSNjcxGOudJq5N5QIYj-renC1ihVkzXr77qdaYw/viewform?usp=pp_url&entry.1582522446=B_verzio'
    : 'https://docs.google.com/forms/d/e/1FAIpQLSczKAC17GkbSNjcxGOudJq5N5QIYj-renC1ihVkzXr77qdaYw/viewform?usp=pp_url&entry.1582522446=A+_verzio';

  // Input wrapper – shows green checkmark if valid, red border if error
 

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center bg-black text-white p-8 rounded-[32px]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white text-black text-4xl font-bold shadow-lg"
          >
            ✓
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl mb-4 font-bold"
          >
            Rendelés sikeres!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-200 mb-8 text-lg leading-8"
          >
            A feladat kész! Most még csak egy lépés maradt hátra: töltsd ki a kérdőívet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white text-black p-6 rounded-3xl border border-black/10 shadow-md mb-8"
          >
            <h3 className="font-bold text-2xl mb-3">Kérlek, töltsd ki a kérdőívet!</h3>
            <p className="text-gray-600 mb-6 text-sm leading-6">
              Ez maximum 2 percet vesz igénybe, de a szakdolgozatomhoz elengedhetetlen.
            </p>
            {animated ? (
              <motion.a
                href={surveyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Kérdőív megnyitása
              </motion.a>
            ) : (
              <a
                href={surveyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
              >
                Kérdőív megnyitása
              </a>
            )}
          </motion.div>

          <button
            onClick={onComplete}
            className="text-gray-300 text-sm"
          >
            Vissza a webshop kezdőlapjára
          </button>
        </div>
      </div>
    );
  }

  const shippingForm = (
  <form onSubmit={handleShippingSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
      <div className="relative">
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} required
          className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('email') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
        <ValidCheck show={isFieldValid('email') && !errors.email} />
      </div>
      <ErrorMsg error={errors.email} />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keresztnév <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={handleBlur} required
            className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.firstName ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('firstName') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
          <ValidCheck show={isFieldValid('firstName') && !errors.firstName} />
        </div>
        <ErrorMsg error={errors.firstName} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vezetéknév <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={handleBlur} required
            className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.lastName ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('lastName') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
          <ValidCheck show={isFieldValid('lastName') && !errors.lastName} />
        </div>
        <ErrorMsg error={errors.lastName} />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Cím <span className="text-red-500">*</span></label>
      <div className="relative">
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur} required
          className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.address ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('address') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
        <ValidCheck show={isFieldValid('address') && !errors.address} />
      </div>
      <ErrorMsg error={errors.address} />
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Város <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} required
            className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.city ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('city') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
          <ValidCheck show={isFieldValid('city') && !errors.city} />
        </div>
        <ErrorMsg error={errors.city} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Megye <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type="text" name="state" value={formData.state} onChange={handleInputChange} onBlur={handleBlur} required
            className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.state ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('state') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
          <ValidCheck show={isFieldValid('state') && !errors.state} />
        </div>
        <ErrorMsg error={errors.state} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Irányítószám <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} onBlur={handleBlur} required
            className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.zipCode ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('zipCode') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
          <ValidCheck show={isFieldValid('zipCode') && !errors.zipCode} />
        </div>
        <ErrorMsg error={errors.zipCode} />
      </div>
    </div>

    <p className="text-xs text-gray-400">* kötelező mező</p>

    {animated ? (
      <motion.button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold relative overflow-hidden" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <span className="relative z-10">Tovább a fizetéshez</span>
        <motion.div className="absolute inset-0 bg-gray-800" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
      </motion.button>
    ) : (
      <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold">Tovább a fizetéshez</button>
    )}
  </form>
);
 
  const paymentForm = (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-blue-900">Biztonságos Fizetés</p>
          <p className="text-xs text-blue-700">A fizetési adatai 256-bit SSL titkosítással védve vannak</p>
        </div>
      </div>

      {/* Elfogadott kártyák */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">Elfogadott kártyák:</span>
        <div className="flex gap-2">
          {['VISA', 'MC', 'AMEX'].map((card) => (
            <span key={card} className="text-xs border border-gray-200 rounded px-2 py-1 font-bold text-gray-500">
              {card}
            </span>
          ))}
        </div>
      </div>

     <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Kártyaszám <span className="text-red-500">*</span></label>
  <div className="relative">
    <input type="text" name="cardNumber" value={formData.cardNumber}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
        setFormData({ ...formData, cardNumber: value });
        if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
      }}
      onBlur={handleBlur} placeholder="1234 5678 9012 3456" maxLength={19} required
      className={`w-full border p-3 pl-10 rounded-lg outline-none transition-colors ${errors.cardNumber ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('cardNumber') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
    <CreditCard className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
    <ValidCheck show={isFieldValid('cardNumber') && !errors.cardNumber} />
  </div>
  <ErrorMsg error={errors.cardNumber} />
</div>

      <div className="grid grid-cols-2 gap-4">
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Lejárati dátum <span className="text-red-500">*</span></label>
  <div className="relative">
    <input type="text" name="expiry" value={formData.expiry}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
        setFormData({ ...formData, expiry: value });
        if (errors.expiry) setErrors({ ...errors, expiry: '' });
      }}
      onBlur={handleBlur} placeholder="HH/ÉÉ" maxLength={5} required
      className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.expiry ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('expiry') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
    <ValidCheck show={isFieldValid('expiry') && !errors.expiry} />
  </div>
  <ErrorMsg error={errors.expiry} />
</div>

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">CVV <span className="text-red-500">*</span></label>
  <div className="relative">
    <input type="text" name="cvv" value={formData.cvv}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData({ ...formData, cvv: value });
        if (errors.cvv) setErrors({ ...errors, cvv: '' });
      }}
      onBlur={handleBlur} placeholder="123" maxLength={4} required
      className={`w-full border p-3 rounded-lg outline-none transition-colors ${errors.cvv ? 'border-red-400 focus:ring-2 focus:ring-red-300' : isFieldValid('cvv') ? 'border-green-400' : 'border-gray-300 focus:ring-2 focus:ring-black'}`} />
    <ValidCheck show={isFieldValid('cvv') && !errors.cvv} />
  </div>
  <ErrorMsg error={errors.cvv} />
</div>
      </div>

      <p className="text-xs text-gray-400">* kötelező mező</p>

      <div className="flex gap-4">
        {animated ? (
          <>
            <motion.button
              type="button"
              onClick={() => setStep('shipping')}
              className="flex-1 border border-gray-300 py-4 rounded-xl font-bold"
              whileHover={{ x: -3, backgroundColor: '#f9fafb' }}
              whileTap={{ scale: 0.97 }}
            >
              ← Vissza
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Fizetés RON {cartTotal}</span>
              <motion.div
                className="absolute inset-0 bg-gray-800"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
              />
            </motion.button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className="flex-1 border border-gray-300 py-4 rounded-xl font-bold"
            >
              Vissza
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold"
            >
              Fizetés RON {cartTotal}
            </button>
          </>
        )}
      </div>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
        <ShieldCheck className="w-4 h-4" />
        <span>256-bit SSL titkosítás · Pénzvisszafizetési garancia 30 napig</span>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {animated ? (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600"
            whileHover={{ x: -4, color: '#000' }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Vissza a kosárhoz
          </motion.button>
        ) : (
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
            Vissza a kosárhoz
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Folyamatjelző */}
        {animated ? (
          <HeadphoneCableProgress step={step} />
        ) : (
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className={step === 'shipping' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400'}>
                1. Szállítási adatok
              </span>
              <span className="text-gray-300">/</span>
              <span className={step === 'payment' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400'}>
                2. Fizetés
              </span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Bal oszlop – Űrlap */}
          <div>
            <h1 className="text-4xl mb-8 font-bold">Pénztár</h1>
            {animated ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 'shipping' ? shippingForm : paymentForm}
                </motion.div>
              </AnimatePresence>
            ) : (
              <>
                {step === 'shipping' && shippingForm}
                {step === 'payment' && paymentForm}
              </>
            )}
          </div>

          {/* Jobb oszlop – Rendelés összesítő */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl mb-6 font-bold">Rendelés Összesítése</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity > 1
                          ? `${item.quantity} × RON ${item.price}`
                          : `RON ${item.price}`}
                      </p>
                    </div>
                    <p className="font-bold shrink-0">RON {item.price * item.quantity}</p>
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
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Ingyenes szállítás minden rendelésre</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>30 napos visszavásárlási garancia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
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
