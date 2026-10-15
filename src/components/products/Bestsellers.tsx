import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import ProductCard from './ProductCard';
import { useTranslation } from 'react-i18next';
import { homepageService } from '../../api/services';
import type { ApiProduct } from '../../api/types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Bestsellers() {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [apiBestsellers, setApiBestsellers] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    homepageService.getHomepageData()
      .then(data => {
        if (isMounted) {
          if (data?.best_sellers && data.best_sellers.length > 0) {
            setApiBestsellers(data.best_sellers);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load bestsellers:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [i18n.language]);

  const displayProducts = apiBestsellers;

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
    if (displayProducts.length <= 1) return;
    const maxIndex = displayProducts.length - 2;
    const nextIndex = activeIndex < maxIndex ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    if (displayProducts.length <= 1) return;
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

  if (!loading && displayProducts.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-20 relative bg-white"
      style={{ 
        backgroundImage: "url('/images/backgrounds/bg-bestseller.webp')",
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
        {loading ? (
          <div className="flex gap-4 sm:gap-6 pb-4 w-full overflow-hidden">
            {[1, 2, 3, 4].map((n) => (
              <div 
                key={n} 
                className="w-[calc(50%-8px)] min-w-[calc(50%-8px)] sm:min-w-[200px] sm:w-[200px] lg:min-w-[calc(25%-18px)] lg:w-[calc(25%-18px)] bg-white rounded-[20px] p-2.5 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="w-full aspect-[4/3] rounded-[16px] bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#f5ebeb] p-8 max-w-md mx-auto">
            <p className="text-gray-500 font-medium mb-4">
              {i18n.language === 'ar' ? 'لا توجد منتجات مسجلة في الأكثر مبيعاً حالياً' : 'No bestsellers available currently'}
            </p>
            <Link to="/products" className="inline-block px-6 py-2.5 bg-[#a0525f] text-white rounded-xl text-sm font-bold">
              {i18n.language === 'ar' ? 'تصفح كل المنتجات' : 'Browse All Products'}
            </Link>
          </div>
        ) : (
          <div className="relative w-full flex items-center gap-3">
            {/* Right Arrow (Previous) */}
            <button 
              onClick={handlePrev}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#89364a] transition-colors z-20 shrink-0 border border-gray-100 hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 cursor-pointer"
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
                    <ProductCard 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        compare_at_price: product.compare_at_price,
                        discounted_price: product.discounted_price,
                        discount_percent: product.discount_percent,
                        rating: product.rating_avg || 5,
                        reviews: product.rating_count || 0,
                        primary_image: product.primary_image,
                        slug: product.slug,
                        category: product.category,
                        badge: product.discount_percent ? `${product.discount_percent}% OFF` : undefined
                      }} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Left Arrow (Next) */}
            <button 
              onClick={handleNext}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#89364a] transition-colors z-20 shrink-0 border border-gray-100 hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Next"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-2 lg:hidden">
          {displayProducts.slice(0, 5).map((_, dotIndex) => (
            <button 
              key={dotIndex}
              onClick={() => scrollToIndex(dotIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                (activeIndex % Math.min(5, displayProducts.length)) === dotIndex ? "w-6 bg-[#89364a]" : "w-1.5 bg-gray-300"
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
