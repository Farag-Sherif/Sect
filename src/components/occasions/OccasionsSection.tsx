import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useMockData } from '../../data/mockData';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../ui/Stagger';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function OccasionsSection() {
  const { occasions } = useMockData();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Duplicate items for scrolling
  const displayItems = [...occasions, ...occasions];

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
    const maxIndex = displayItems.length - 2;
    const nextIndex = activeIndex < maxIndex ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const maxIndex = displayItems.length - 2;
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
    setActiveIndex(Math.min(displayItems.length - 1, Math.max(0, index)));
  };

  const getFallbackImage = (id: string) => {
    switch (id) {
      case 'events': return 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400';
      case 'ramadan': return 'https://images.unsplash.com/photo-1583267746534-20626b4859a2?auto=format&fit=crop&q=80&w=400';
      case 'wedding': return 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400';
      case 'birthday': return 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400';
      default: return 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400';
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#fffdfb]">
      {/* Floral Decorations */}
      <img 
        src="/images/decorations/floral.png" 
        alt="" 
        className="absolute rtl:-left-10 ltr:-right-10 top-0 h-full opacity-40 object-contain w-48 pointer-events-none" 
      />
      <img 
        src="/images/decorations/floral.png" 
        alt="" 
        className="absolute rtl:-right-10 ltr:-left-10 top-0 h-full opacity-40 object-contain w-48 pointer-events-none" 
        style={{ transform: 'scaleX(-1)' }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-start mb-12 flex flex-col items-start">
          <h2 className="text-3xl lg:text-4xl font-bold font-arabic text-brand-brown mb-2">{t('sections.occasionsTitle')}</h2>
          <p className="text-[#89364a]/80 text-sm font-medium">{t('sections.occasionsSub')}</p>
        </div>

        {/* Slider Section */}
        <div className="relative w-full flex items-center gap-4">
          {/* Right Arrow (Previous) */}
          <button 
            onClick={handlePrev}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2"
            aria-label="Previous"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto py-4 scroll-smooth hide-scrollbar snap-x snap-mandatory min-w-0" 
          >
            <div className="flex gap-4 sm:gap-6 pb-4 w-full">
              {displayItems.map((item, i) => (
                <div key={`${item.id}-${i}`} className="snap-start w-[calc(50%-8px)] min-w-[calc(50%-8px)] sm:min-w-[240px] sm:w-[240px] lg:min-w-[calc(25%-18px)] lg:w-[calc(25%-18px)] shrink-0 group">
                  
                  {/* Card Design */}
                  <Link to={`/products?category=${item.id}`} className="bg-white rounded-[20px] sm:rounded-[24px] p-2 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#f5ebeb]/50 flex flex-col transition-transform duration-300 group-hover:-translate-y-1 cursor-pointer block h-full">
                    <div className="w-full aspect-[4/3] rounded-[16px] sm:rounded-[20px] overflow-hidden mb-2 sm:mb-4 relative">
                      <img 
                        src={item.image} 
                        onError={(e) => { e.currentTarget.src = getFallbackImage(item.id) }}
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-1 sm:px-2 pb-2 sm:pb-4 text-center">
                      <h3 className="font-bold text-[#3a1c22] text-sm sm:text-lg mb-1 truncate">{item.title}</h3>
                      <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[#89364a]/70 font-medium truncate">
                        <span className="opacity-50 text-[8px] sm:text-[10px]">✤</span>
                        <span className="truncate">{item.subtitle}</span>
                        <span className="opacity-50 text-[8px] sm:text-[10px]">✤</span>
                      </div>
                    </div>
                  </Link>

                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow (Next) */}
          <button 
            onClick={handleNext}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2"
            aria-label="Next"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-4 lg:hidden">
          {occasions.map((_, dotIndex) => (
            <button 
              key={dotIndex}
              onClick={() => scrollToIndex(dotIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                (activeIndex % occasions.length) === dotIndex ? "w-6 bg-[#d96677]" : "w-1.5 bg-[#d96677]/30"
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
