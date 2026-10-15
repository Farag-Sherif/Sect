import { useState, useEffect, useRef } from 'react';
import { Package, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
// @ts-ignore
import { twMerge } from 'tailwind-merge';
import { imageScheduler, type ImagePriority } from '../../utils/imageScheduler';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ProductImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g., 'aspect-[4/3]' or 'aspect-square'
  icon?: 'package' | 'sparkles';
  label?: string;
  priority?: ImagePriority;
  loading?: 'lazy' | 'eager';
}

export default function ProductImage({
  src,
  alt = 'Sect Handmade',
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatio,
  icon = 'package',
  label,
  priority = 'normal',
  loading = 'lazy',
}: ProductImageProps) {
  const { t, i18n } = useTranslation();
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isAr = i18n.language === 'ar';
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!src) {
      setResolvedSrc(null);
      setIsLoaded(false);
      setHasError(false);
      return;
    }

    // Abort any in-progress load on src change or unmount
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoaded(false);
    setHasError(false);

    // Schedule controlled load via shared concurrency scheduler
    imageScheduler
      .scheduleLoad(src, priority, controller.signal)
      .then((finalSrc) => {
        if (!controller.signal.aborted) {
          setResolvedSrc(finalSrc);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.warn(`[ProductImage] Failed to load ${src}:`, err.message);
          setHasError(true);
        }
      });

    return () => {
      controller.abort();
    };
  }, [src, priority]);

  // If no src is provided or image failed to load after all retries, render the elegant placeholder
  const showPlaceholder = !src || hasError;

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "w-full h-full relative overflow-hidden bg-gradient-to-br from-[#fff7f8] via-[#f9eef1] to-[#fbf2f4] flex flex-col items-center justify-center p-4 select-none",
          aspectRatio,
          containerClassName
        )}
      >
        {/* Subtle shimmer loader line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[pulse_2.5s_infinite] pointer-events-none" />

        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 shadow-[0_2px_10px_rgba(217,102,119,0.08)] flex items-center justify-center text-[#d96677] mb-2 z-10 transition-transform group-hover:scale-105 duration-300">
          {icon === 'sparkles' ? (
            <Sparkles className="w-6 h-6 stroke-[1.5]" />
          ) : (
            <Package className="w-6 h-6 stroke-[1.5]" />
          )}
        </div>

        <span className="text-[11px] sm:text-xs font-semibold text-[#89364a]/60 text-center z-10 tracking-wide">
          {label || (isAr ? 'سكت هاندميد' : 'Sect Handmade')}
        </span>
        <span className="text-[9px] text-[#d96677]/40 text-center z-10 mt-0.5">
          {t('common.handcraftedWithLove', isAr ? '♡ صنع يدوي بحب' : '♡ Handcrafted with love')}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-[#fdf5f6]",
        aspectRatio,
        containerClassName
      )}
    >
      {/* Skeleton loader while genuine image is in flight */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf5f6] via-[#f7e8eb] to-[#fdf5f6] animate-pulse z-10" />
      )}

      {resolvedSrc && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={loading}
          className={cn(
            className,
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
