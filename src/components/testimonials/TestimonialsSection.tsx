import { useRef, useState } from 'react';
import { useMockData } from '../../data/mockData';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../ui/Stagger';
import clsx from 'clsx';
// @ts-ignore
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function TestimonialsSection() {
  const { testimonials } = useMockData();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Duplicate for slider effect
  const displayItems = [...testimonials, ...testimonials];

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
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
    const nextIndex = activeIndex < displayItems.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : displayItems.length - 1;
    scrollToIndex(prevIndex);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const gap = window.innerWidth < 640 ? 16 : 24;
    const cardWidth = firstChild.offsetWidth + gap;
    if (cardWidth <= 0) return;

    const index = Math.round(Math.abs(container.scrollLeft) / cardWidth);
    setActiveIndex(Math.min(displayItems.length - 1, Math.max(0, index)));
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-r from-[#fffcfd] to-[#fff5f7]">
      {/* Floral Decorations */}
      <img 
        src="/images/decorations/floral.png" 
        alt="" 
        className="absolute rtl:-right-24 ltr:-left-24 top-0 h-[120%] opacity-20 object-contain w-72 pointer-events-none" 
      />
      <img 
        src="/images/decorations/floral.png" 
        alt="" 
        className="absolute rtl:-left-24 ltr:-right-24 bottom-0 h-[120%] opacity-20 object-contain w-72 pointer-events-none" 
        style={{ transform: 'scaleX(-1)' }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10 w-full">
        
        {/* Right Arrow (Previous) - Absolute positioned to the container */}
        <button 
          onClick={handlePrev}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2"
          aria-label="Previous"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Left Arrow (Next) */}
        <button 
          onClick={handleNext}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2"
          aria-label="Next"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          
          {/* Text Container (Right Side in RTL) */}
          <div className="lg:w-[25%] text-start flex flex-col items-start shrink-0 pt-4 lg:pt-0">
            <span className="text-[#d96677]/80 text-sm font-bold mb-2">{t('sections.testimonialsSub')}</span>
            <h2 className="text-4xl md:text-[42px] font-bold font-arabic text-[#a52639] mb-4 leading-tight">
              {t('sections.testimonialsTitle')}
            </h2>
            <p className="text-[#89364a]/80 font-medium">{t('sections.testimonialsDesc')}</p>
          </div>

          {/* Slider Container (Left Side in RTL) */}
          <div className="lg:w-[75%] w-full relative min-w-0">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-4 sm:gap-6 py-6 snap-x snap-mandatory hide-scrollbar w-full" 
            >
              {displayItems.map((testimonial, i) => (
                <div key={`${testimonial.id}-${i}`} className="snap-center sm:snap-start w-full min-w-full sm:min-w-[280px] sm:w-[280px] lg:min-w-[calc(33.333%-16px)] lg:w-[calc(33.333%-16px)] shrink-0">
                  
                  {/* Card Design */}
                  <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f5ebeb]/60 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                    
                    {/* Header: Avatar & Name */}
                    <div className="flex items-center justify-end gap-3 mb-5">
                      <div className="text-right">
                        <h4 className="font-bold text-[#3a1c22] text-base">{testimonial.name}</h4>
                        <p className="text-xs text-gray-400">{testimonial.role}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-50">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=fdf5f6&color=d96677&font-size=0.4`} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Date & Stars */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-0.5 text-[#ffb547]">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[#89364a]/50 text-xs font-medium">{t('sections.timeAgo')}</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-[#3a1c22]/80 text-sm text-center font-medium leading-relaxed mt-auto px-2">
                      {testimonial.text} <span className="text-[#d96677] text-xs inline-block ml-1">♡</span>
                    </p>

                  </div>

                </div>
              ))}
            </div>
            
            {/* Pagination Dots (Mobile) */}
            <div className="flex justify-center items-center gap-2 mt-2 lg:hidden">
              {testimonials.map((_, dotIndex) => (
                <button 
                  key={dotIndex}
                  onClick={() => scrollToIndex(dotIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    (activeIndex % testimonials.length) === dotIndex ? "w-6 bg-[#d96677]" : "w-1.5 bg-[#d96677]/30"
                  )}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>

          </div>

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
