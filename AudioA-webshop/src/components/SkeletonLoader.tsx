import { motion } from 'framer-motion';

export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-8 items-center">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="h-12 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded mb-8 animate-pulse"></div>
            <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-16 animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-16 animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-12">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-80 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Animation Overlay */}
      <motion.div
        className="skeleton-overlay fixed inset-0 bg-white z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        onAnimationComplete={() => {
          const element = document.querySelector('.skeleton-overlay') as HTMLElement;
          if (element) element.style.display = 'none';
        }}
      >
        <div className="text-center">
          <motion.div
            className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Loading AudioA...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
