import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandMark from './BrandMark';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-950"
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary-500 blur-[200px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent-500 blur-[200px]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-primary-500/20"
              style={{ margin: '-4px' }}
            />
            <BrandMark className="h-20 w-auto rounded-2xl shadow-2xl shadow-primary-500/20" />
          </motion.div>

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <BrandMark className="h-12 w-auto mx-auto rounded-xl" />
            <p className="text-gray-500 text-sm text-center mt-2">GPS Tracking Solutions</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 200 }}
            transition={{ delay: 0.5 }}
            className="h-1 bg-white/5 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.15 }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 text-xs mt-3"
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
