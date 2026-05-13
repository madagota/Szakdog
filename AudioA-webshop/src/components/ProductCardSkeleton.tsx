import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
  index?: number;
}

export function ProductCardSkeleton({ index = 0 }: ProductCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="relative h-80 bg-gray-200 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-7 bg-gray-200 rounded w-2/3 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1 + 0.1
            }}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1 + 0.2
              }}
            />
          </div>
          <div className="h-4 bg-gray-200 rounded w-4/5 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1 + 0.3
              }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/4 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1 + 0.4
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1 + 0.5
              }}
            />
          </div>
          <div className="flex-1 h-12 bg-gray-200 rounded overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1 + 0.6
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
