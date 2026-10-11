import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMockData } from '../../data/mockData';
import ProductCard from './ProductCard';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../ui/Stagger';
// @ts-ignore
import clsx from 'clsx';
// @ts-ignore
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Bestsellers() {
  const { bestsellers, products } = useMockData();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine bestsellers and products to have 8 items for scrolling
  const displayProducts = [...bestsellers, ...products];

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.querySelector('.snap-start') as HTMLElement;
      if (!firstChild) return;
      
      const gap = window.innerWidth < 640 ? 16 : 24;
      const cardWidth = firstChild.offsetWidth + gap;
      const isRTL = getComputedStyle(container).direction === 'rtl';
      const scrollPos = isRTL ? -(index * cardWidth) : (index * cardWidth);
      
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    const maxIndex = displayProducts.length - 2;
    const nextIndex = activeIndex < maxIndex ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const maxIndex = displayProducts.length - 2;
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : maxIndex;
    scrollToIndex(prevIndex);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstChild = container.querySelector('.snap-start') as HTMLElement;
    if (!firstChild) return;

    const gap = window.innerWidth < 640 ? 16 : 24;
    const cardWidth = firstChild.offsetWidth + gap;
    if (cardWidth <= 0) return;

    const index = Math.round(Math.abs(container.scrollLeft) / cardWidth);
    setActiveIndex(Math.min(displayProducts.length - 1, Math.max(0, index)));
  };

  return (
    <section 
      className="py-20 relative bg-white"
      style={{ 
        backgroundImage: "url('/images/backgrounds/bg-bestseller.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-start mb-10 lg:mb-12">
          <div className="inline-flex items-center text-brand-pink text-sm font-medium mb-2">
            <span className="text-xl rtl:ml-2 ltr:mr-2">🔥</span> {t('sections.bestsellersSub')}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold font-arabic text-brand-brown">{t('sections.bestsellersTitle')}</h2>
        </div>
        
        {/* Slider Section */}
        <div className="relative w-full flex items-center gap-3">
          {/* Right Arrow (Previous) */}
          <button 
            onClick={handlePrev}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#89364a] transition-colors z-20 shrink-0 border border-gray-100 hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2"
            aria-label="Previous"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto py-4 scroll-smooth hide-scrollbar snap-x snap-mandatory min-w-0" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 sm:gap-6 pb-4 w-full">
              {displayProducts.map((product, i) => (
                <div key={`${product.id}-${i}`} className="snap-start w-[calc(50%-8px)] min-w-[calc(50%-8px)] sm:min-w-[200px] sm:w-[200px] lg:min-w-[calc(25%-18px)] lg:w-[calc(25%-18px)] shrink-0 group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow (Next) */}
          <button 
            onClick={handleNext}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#89364a] transition-colors z-20 shrink-0 border border-gray-100 hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2"
            aria-label="Next"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-2 lg:hidden">
          {bestsellers.map((_, dotIndex) => (
            <button 
              key={dotIndex}
              onClick={() => scrollToIndex(dotIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                (activeIndex % bestsellers.length) === dotIndex ? "w-6 bg-[#89364a]" : "w-1.5 bg-gray-300"
              )}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </div>

      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
