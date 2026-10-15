import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { categoriesService } from '../../api/services';
import type { ApiCategory } from '../../api/types';
import ProductImage from '../ui/ProductImage';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function OccasionsSection() {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    categoriesService.getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories for occasions section:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [i18n.language]);

  // Use categories from API or duplicate if fewer items for carousel
  const displayItems = categories.length > 0 
    ? (categories.length < 5 ? [...categories, ...categories] : categories)
    : [];

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
    if (displayItems.length <= 1) return;
    const maxIndex = displayItems.length - 2;
    const nextIndex = activeIndex < maxIndex ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    if (displayItems.length <= 1) return;
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

  return (
    <section className="py-20 relative overflow-hidden bg-[#fffdfb]">
      {/* Floral Decorations */}
      <img 
        src="/images/decorations/floral.webp" 
        alt="" 
        className="absolute rtl:-left-10 ltr:-right-10 top-0 h-full opacity-40 object-contain w-48 pointer-events-none" 
      />
      <img 
        src="/images/decorations/floral.webp" 
        alt="" 
        className="absolute rtl:-right-10 ltr:-left-10 top-0 h-full opacity-40 object-contain w-48 pointer-events-none" 
        style={{ transform: 'scaleX(-1)' }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-start mb-12 flex flex-col items-start">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#d96677] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('sections.occasionsSub', i18n.language === 'ar' ? 'مجموعات مختارة' : 'Shop by occasion')}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold font-arabic text-brand-brown">
            {t('sections.occasionsTitle', i18n.language === 'ar' ? 'تسوق حسب المناسبة والمجموعة' : 'Shop for every occasion')}
          </h2>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="flex gap-4 sm:gap-6 pb-4 w-full overflow-hidden">
            {[1, 2, 3, 4].map((n) => (
              <div 
                key={n} 
                className="w-[calc(50%-8px)] min-w-[calc(50%-8px)] sm:min-w-[240px] sm:w-[240px] lg:min-w-[calc(25%-18px)] lg:w-[calc(25%-18px)] bg-white rounded-[24px] p-2.5 shadow-sm border border-[#f5ebeb]/50 animate-pulse"
              >
                <div className="w-full aspect-[4/3] rounded-[20px] bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          /* Empty Placeholder */
          <div className="text-center py-12 bg-white rounded-3xl border border-[#f5ebeb] p-8 max-w-md mx-auto">
            <p className="text-gray-500 font-medium mb-4">
              {i18n.language === 'ar' ? 'لا توجد مجموعات متاحة حالياً في الـ API' : 'No collections available in API currently'}
            </p>
            <Link to="/products" className="inline-block px-6 py-2.5 bg-[#a0525f] text-white rounded-xl text-sm font-bold">
              {i18n.language === 'ar' ? 'تصفح كل المنتجات' : 'Browse All Products'}
            </Link>
          </div>
        ) : (
          /* Slider Section */
          <div className="relative w-full flex items-center gap-4">
            {/* Right Arrow (Previous) */}
            <button 
              onClick={handlePrev}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 cursor-pointer"
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
                    
                    {/* Card Design Connected to Live API */}
                    <Link 
                      to={`/products?category=${item.slug}`} 
                      className="bg-white rounded-[20px] sm:rounded-[24px] p-2 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#f5ebeb]/50 flex flex-col transition-transform duration-300 group-hover:-translate-y-1 cursor-pointer block h-full"
                    >
                      <div className="w-full aspect-[4/3] rounded-[16px] sm:rounded-[20px] overflow-hidden mb-2 sm:mb-4 relative bg-[#fdf5f6]">
                        <ProductImage 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          icon="sparkles"
                          label={item.name}
                        />
                      </div>
                      <div className="px-1 sm:px-2 pb-2 sm:pb-4 text-center">
                        <h3 className="font-bold text-[#3a1c22] text-sm sm:text-lg mb-1 truncate">{item.name}</h3>
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[#89364a]/70 font-medium truncate">
                          <span className="opacity-50 text-[8px] sm:text-[10px]">✤</span>
                          <span className="truncate">
                            {item.description || (item.products_count !== undefined 
                              ? (i18n.language === 'ar' 
                                  ? `${item.products_count} ${t('common.products', 'منتج')}` 
                                  : `${item.products_count} ${item.products_count === 1 ? t('common.product', 'Product') : t('common.products', 'Products')}`) 
                              : (i18n.language === 'ar' 
                                  ? t('auth.handmade', 'صنع يدوي') 
                                  : t('auth.handmade', 'Handmade')))}
                          </span>
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
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Next"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {displayItems.length > 0 && (
          <div className="flex justify-center items-center gap-1.5 mt-4 lg:hidden">
            {displayItems.slice(0, 4).map((_, dotIndex) => (
              <button 
                key={dotIndex}
                onClick={() => scrollToIndex(dotIndex)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  (activeIndex % 4) === dotIndex ? "w-6 bg-[#d96677]" : "w-1.5 bg-[#d96677]/30"
                )}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}

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
