import { motion } from 'framer-motion';


interface HeadphoneCableProgressProps {
  step: 'shipping' | 'payment' | 'complete';
}

export function HeadphoneCableProgress({ step }: HeadphoneCableProgressProps) {
  const progress = step === 'shipping' ? 33 : step === 'payment' ? 66 : 100;

  return (
    <div className="relative w-full py-12">
      {/* Cable Path */}
      <svg
        className="w-full h-32"
        viewBox="0 0 800 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background cable (gray) */}
        <motion.path
          d="M 50 64 Q 200 20, 400 64 T 750 64"
          stroke="#E5E7EB"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Animated progress cable (black) */}
        <motion.path
          d="M 50 64 Q 200 20, 400 64 T 750 64"
          stroke="#000"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Left Jack */}
        <g>
          <motion.rect
            x="30"
            y="54"
            width="20"
            height="20"
            fill="#000"
            rx="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          />
          <motion.rect
            x="20"
            y="59"
            width="10"
            height="10"
            fill="#666"
            rx="1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          />
        </g>

        {/* Shipping milestone */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: progress >= 33 ? 1 : 0.3, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="266" cy="44" r="8" fill={progress >= 33 ? "#000" : "#E5E7EB"} />
          <text x="266" y="20" textAnchor="middle" className="text-xs fill-gray-600">
            Szállítás
          </text>
        </motion.g>

        {/* Payment milestone */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: progress >= 66 ? 1 : 0.3, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <circle cx="533" cy="84" r="8" fill={progress >= 66 ? "#000" : "#E5E7EB"} />
          <text x="533" y="110" textAnchor="middle" className="text-xs fill-gray-600">
            Fizetés
          </text>
        </motion.g>

        {/* Right Headphones */}
        <motion.g
          initial={{ scale: 0, rotate: -90 }}
          animate={{
            scale: progress === 100 ? 1 : 0.7,
            rotate: 0,
            y: progress === 100 ? [0, -10, 0] : 0
          }}
          transition={{
            scale: { duration: 0.5 },
            rotate: { duration: 0.5 },
            y: { duration: 0.6, repeat: progress === 100 ? Infinity : 0, repeatDelay: 1 }
          }}
        >
          {/* Headband */}
          <path
            d="M 730 30 Q 760 10, 790 30 L 790 50 Q 760 35, 730 50 Z"
            fill={progress === 100 ? "#000" : "#666"}
          />
          
          {/* Left ear cup */}
          <ellipse
            cx="740"
            cy="64"
            rx="15"
            ry="18"
            fill={progress === 100 ? "#000" : "#666"}
          />
          <ellipse cx="740" cy="64" rx="10" ry="13" fill="#333" />
          
          {/* Right ear cup */}
          <ellipse
            cx="780"
            cy="64"
            rx="15"
            ry="18"
            fill={progress === 100 ? "#000" : "#666"}
          />
          <ellipse cx="780" cy="64" rx="10" ry="13" fill="#333" />
          
          {/* Success checkmark */}
          {progress === 100 && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <circle cx="760" cy="50" r="12" fill="#22C55E" />
              <path
                d="M 755 50 L 758 53 L 765 46"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          )}
        </motion.g>
      </svg>

      {/* Progress text */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-600">
          {step === 'shipping' && 'Adja meg a szállítási adatait'}
          {step === 'payment' && 'Fizetés befejezése'}
          {step === 'complete' && 'Rendelés sikeresen leadva!'}
        </p>
      </motion.div>
    </div>
  );
}
