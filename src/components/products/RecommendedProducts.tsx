import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, ShoppingCart, Star } from 'lucide-react';
import { useMockData } from '../../data/mockData';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router';
import { useStore } from '../../store/useStore';
import { StaggerContainer, StaggerItem } from '../ui/Stagger';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80',
  'https://images.unsplash.com/photo-1581022295087-35e593704911?w=500&q=80',
  'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&q=80',
  'https://images.unsplash.com/photo-1620189507195-68309c04c4d0?w=500&q=80'
];

export default function RecommendedProducts() {
  const { products, bestsellers } = useMockData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine products and bestsellers to have 8 items for scrolling
  const displayProducts = [...products, ...bestsellers];

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
    <section className="py-6 sm:py-8 bg-white overflow-hidden w-full">
      <div 
        className="w-full py-8 sm:py-12 px-4 sm:px-8 lg:px-12 rounded-[24px] sm:rounded-[40px] relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10 font-arabic max-w-[1400px] mx-auto shadow-sm"
        style={{ 
          backgroundImage: "url('/images/backgrounds/bg-recommended.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        
        {/* Text Section (Right side in RTL) */}
        <div className="w-full lg:w-[28%] text-start z-10 flex flex-col items-start lg:items-start px-2 shrink-0">
          <span className="text-[#89364a] font-medium text-sm mb-2 opacity-80 block">{t('sections.recommendedSub')} <span className="inline-block text-lg rotate-12 relative -top-1 ml-1">*</span></span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#33151b] mb-4">{t('sections.recommendedTitle')}</h2>
          <p className="text-gray-500 text-sm lg:text-base mb-6 sm:mb-8 leading-relaxed max-w-sm">
            {t('sections.recommendedDesc')}
          </p>
          <button onClick={() => navigate('/products')} className="bg-[#89364a] hover:bg-[#722a3a] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors font-bold text-sm sm:text-base shadow-md whitespace-nowrap">
            <span>{t('sections.recommendedBtn')}</span>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rtl:-scale-x-100" />
          </button>
        </div>

        {/* Slider Section (Left side in RTL) */}
        <div className="w-full lg:w-[72%] relative z-10 flex flex-col items-center min-w-0">
          <div className="flex items-center gap-3 w-full">
            
            {/* Right Arrow (appears on the right between text and slider in RTL) */}
            <button 
              onClick={handlePrev}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#89364a] transition-colors z-20 shrink-0 border border-gray-100 hidden lg:flex"
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
              <StaggerContainer className="flex gap-4 sm:gap-6 pb-2 w-full">
                {displayProducts.map((product, i) => (
                  <StaggerItem key={`${product.id}-${i}`} className="snap-start w-[calc(50%-8px)] min-w-[calc(50%-8px)] sm:min-w-[200px] sm:w-[200px] lg:min-w-[calc(25%-18px)] lg:w-[calc(25%-18px)] bg-white rounded-[20px] sm:rounded-[24px] p-2 sm:p-2.5 shadow-sm shrink-0 flex flex-col group hover:shadow-lg transition-all duration-300 border border-gray-50 relative">
                    <div className="relative aspect-[4/5] rounded-[14px] sm:rounded-[18px] overflow-hidden mb-2 sm:mb-3 bg-gray-100 block">
                      <Link to={`/products/${product.id}`} className="block w-full h-full">
                        <img src={fallbackImages[i % fallbackImages.length]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </Link>
                      <button onClick={(e) => { e.preventDefault(); useStore.getState().toggleFavorite(product as any); }} className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white ${useStore.getState().isFavorite(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors z-10 shadow-sm`}>
                        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${useStore.getState().isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#d96677] text-white text-[9px] sm:text-[10px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium z-10 shadow-sm pointer-events-none">
                        {product.badge || t('sections.newBadge')}
                      </div>
                    </div>
                    
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-center font-bold text-[#33151b] text-xs sm:text-[15px] mb-1 sm:mb-2 hover:text-[#d96677] transition-colors truncate">{product.name}</h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mt-auto px-0.5 sm:px-1 pb-0.5 sm:pb-1 flex-row-reverse">
                      <div className="flex flex-col gap-0.5 items-start" dir="ltr">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <div className="flex" dir="ltr">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", star <= Math.floor(product.rating) ? "fill-[#ffc107] text-[#ffc107]" : "fill-transparent text-gray-300")} />
                            ))}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-gray-400 ml-0.5">({product.reviews})</span>
                        </div>
                        <span className="font-bold text-[#33151b] text-xs sm:text-[15px]">${product.price.toFixed(2)}</span>
                      </div>
                      
                      <button onClick={(e) => { e.preventDefault(); useStore.getState().addToCart(product as any, 1); }} className="p-1.5 sm:p-2.5 text-[#d96677] hover:bg-[#d96677] hover:text-white rounded-full transition-colors self-end">
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Left Arrow (appears on the far left in RTL) */}
            <button 
              onClick={handleNext}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#89364a] transition-colors z-20 shrink-0 border border-gray-100 hidden lg:flex"
              aria-label="Next"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-2 lg:hidden">
            {products.map((_, dotIndex) => (
              <button 
                key={dotIndex}
                onClick={() => scrollToIndex(dotIndex)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  (activeIndex % products.length) === dotIndex ? "w-6 bg-[#89364a]" : "w-1.5 bg-gray-300"
                )}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
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
