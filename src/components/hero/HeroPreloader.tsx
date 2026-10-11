import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HeroPreloaderProps {
  progress: number;
  isReady: boolean;
}

export default function HeroPreloader({ progress, isReady }: HeroPreloaderProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 bg-[#1a0a13] flex flex-col items-center justify-center p-6 select-none"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#d96677]/10 blur-[120px] pointer-events-none" />

          {/* Luxury Brand Title & Script */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center relative z-10 mb-8"
          >
            <h1 className="font-handwriting text-6xl md:text-8xl text-white drop-shadow-[0_4px_20px_rgba(217,102,119,0.4)] leading-none mb-3">
              Sect
            </h1>
            <p className="font-arabic text-xs md:text-sm text-white/70 tracking-[0.25em] uppercase font-medium">
              {isAr ? 'صُنع بحب، خصيصاً لك ♡' : 'Handmade with love, just for you ♡'}
            </p>
          </motion.div>

          {/* Progress Bar Container */}
          <div className="relative z-10 w-72 max-w-[85vw] flex flex-col items-center">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ab4458] to-[#d96677] rounded-full shadow-[0_0_15px_rgba(217,102,119,0.8)]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
            </div>

            {/* Labels & Percentage */}
            <div className="w-full flex items-center justify-between text-xs text-white/60 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d96677] animate-ping" />
                {isAr ? 'جاري تحضير التجربة السينمائية...' : 'Preparing cinematic experience...'}
              </span>
              <span className="font-mono text-[#d96677] font-bold text-sm">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
