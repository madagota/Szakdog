import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function EnhancedButton({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  fullWidth = false
}: EnhancedButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleClick = async () => {
    if (disabled || status !== 'idle' || !onClick) return;
    
    setStatus('loading');
    try {
      await onClick();
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  const isPrimary = variant === 'primary';
  const baseClass = isPrimary
    ? 'bg-black text-white hover:bg-gray-800'
    : 'border border-black text-black hover:bg-gray-100';

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || status !== 'idle'}
      className={`
        relative overflow-hidden px-8 py-3 rounded-lg
        transition-all duration-300 ease-out
        ${baseClass}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      animate={{
        x: mousePosition.x * 0.15,
        y: mousePosition.y * 0.15,
        scale: status === 'loading' ? 0.95 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.3
      }}
      whileHover={status === 'idle' ? { scale: 1.05 } : {}}
      whileTap={status === 'idle' ? { scale: 0.95 } : {}}
    >
      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '100%', opacity: 0.1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          opacity: status === 'loading' ? 0 : 1,
          scale: status === 'loading' ? 0.8 : 1
        }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>

      {/* Loading state */}
      {status === 'loading' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={`rounded-full ${isPrimary ? 'border-white' : 'border-black'}`}
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid',
              borderTopColor: 'transparent'
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </motion.div>
      )}

      {/* Success state */}
      {status === 'success' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
          >
            <Check className={`w-6 h-6 ${isPrimary ? 'text-white' : 'text-black'}`} />
          </motion.div>
        </motion.div>
      )}

      {/* Success background pulse */}
      {status === 'success' && (
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
