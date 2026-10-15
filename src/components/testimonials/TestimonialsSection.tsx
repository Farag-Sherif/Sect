import { useEffect, useRef, useState } from 'react';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { homepageService, productsService } from '../../api/services';
import type { HomepageTestimonial } from '../../api/types';
import clsx from 'clsx';
// @ts-ignore
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function formatRelativeTime(dateString?: string, isAr: boolean = true): string {
  if (!dateString) return isAr ? 'مؤخراً' : 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return isAr ? 'مؤخراً' : 'Recently';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return isAr ? 'الآن' : 'Just now';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return isAr ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return isAr 
        ? (diffInHours === 1 ? 'منذ ساعة' : diffInHours === 2 ? 'منذ ساعتين' : diffInHours <= 10 ? `منذ ${diffInHours} ساعات` : `منذ ${diffInHours} ساعة`)
        : `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return isAr ? 'أمس' : 'Yesterday';
    }
    if (diffInDays < 7) {
      return isAr ? `منذ ${diffInDays} أيام` : `${diffInDays}d ago`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return isAr ? (diffInWeeks === 1 ? 'منذ أسبوع' : diffInWeeks === 2 ? 'منذ أسبوعين' : `منذ ${diffInWeeks} أسابيع`) : `${diffInWeeks}w ago`;
    }
    return date.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isAr ? 'مؤخراً' : 'Recently';
  }
}

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [apiTestimonials, setApiTestimonials] = useState<HomepageTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    homepageService.getHomepageData()
      .then(async (data) => {
        if (!isMounted) return;

        // 1. Fetch real customer reviews from products
        const productReviews: HomepageTestimonial[] = [];
        try {
          const productList = [
            ...(data?.best_sellers || []),
            ...(data?.personalized_suggestions || [])
          ];
          const slugs = Array.from(new Set(productList.map(p => p.slug).filter(Boolean)));

          // Ensure products with known reviews are checked
          if (!slugs.includes('amigurumi-bear')) slugs.push('amigurumi-bear');
          if (!slugs.includes('chunky-throw-blanket')) slugs.push('chunky-throw-blanket');

          const detailResults = await Promise.all(
            slugs.slice(0, 10).map(s => productsService.getProductBySlug(s).catch(() => null))
          );

          detailResults.forEach(prod => {
            if (prod && Array.isArray(prod.reviews)) {
              prod.reviews.forEach(rev => {
                if (rev && rev.comment) {
                  const reviewerName = rev.user?.name || rev.customer_name || rev.user_name || (isAr ? 'عميل موثق' : 'Verified Customer');
                  productReviews.push({
                    id: Number(rev.id) || Date.now(),
                    customer_name: reviewerName,
                    role: isAr ? `تقييم لمنتج ${prod.name}` : `Reviewed ${prod.name}`,
                    avatar: rev.user?.avatar || null,
                    rating: rev.rating || 5,
                    comment: rev.comment,
                    created_at: rev.created_at,
                  });
                }
              });
            }
          });
        } catch (err) {
          console.error('Failed to load product reviews for testimonials:', err);
        }

        // Sort reviews: newest first
        productReviews.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        // Deduplicate identical reviews from the same user to avoid repeating across products
        const seen = new Set<string>();
        const uniqueProductReviews = productReviews.filter(rev => {
          const key = `${rev.customer_name}_${rev.comment.trim().toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // 2. Store testimonials to provide rich variety alongside real product reviews
        const storeTestimonials = (data?.testimonials || []).map(item => ({
          ...item,
          role: isAr 
            ? (item.role?.includes('Cairo') ? 'عميل من القاهرة' : item.role?.includes('Dubai') ? 'عميل من دبي' : item.role?.includes('Riyadh') ? 'عميل من الرياض' : 'عميل موثق')
            : item.role,
        }));

        if (isMounted) {
          // Combine: real customer product reviews first, then general store testimonials
          const combined = [...uniqueProductReviews, ...storeTestimonials];
          setApiTestimonials(combined);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [i18n.language]);

  const items = apiTestimonials.map(item => ({
    id: String(item.id),
    name: item.customer_name,
    role: item.role,
    text: item.comment,
    rating: item.rating,
    avatar: item.avatar,
    created_at: item.created_at,
  }));

  // Only duplicate if fewer than 3 items to allow smooth sliding
  const displayItems = items.length > 0 
    ? (items.length < 3 ? [...items, ...items] : items) 
    : [];

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
    if (displayItems.length <= 1) return;
    const nextIndex = activeIndex < displayItems.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    if (displayItems.length <= 1) return;
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
        src="/images/decorations/floral.webp" 
        alt="" 
        className="absolute rtl:-right-24 ltr:-left-24 top-0 h-[120%] opacity-20 object-contain w-72 pointer-events-none" 
      />
      <img 
        src="/images/decorations/floral.webp" 
        alt="" 
        className="absolute rtl:-left-24 ltr:-right-24 bottom-0 h-[120%] opacity-20 object-contain w-72 pointer-events-none" 
        style={{ transform: 'scaleX(-1)' }} 
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10 w-full">
        
        {/* Navigation Arrows (shown only when reviews exist) */}
        {displayItems.length > 0 && (
          <>
            <button 
              onClick={handlePrev}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Previous"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[#d96677] hover:bg-brand-pink hover:text-white transition-all z-20 shrink-0 hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Next"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="flex flex-col lg:flex-row items-center gap-6">
          
          {/* Text Container (Right Side in RTL) */}
          <div className="lg:w-[25%] text-start flex flex-col items-start shrink-0 pt-4 lg:pt-0">
            <span className="text-[#d96677]/80 text-sm font-bold mb-2">{t('sections.testimonialsSub')}</span>
            <h2 className="text-4xl md:text-[42px] font-bold font-arabic text-[#a52639] mb-4 leading-tight">
              {t('sections.testimonialsTitle')}
            </h2>
            <p className="text-[#89364a]/80 font-medium">{t('sections.testimonialsDesc')}</p>
          </div>

          {/* Slider / Placeholder Container */}
          <div className="lg:w-[75%] w-full relative min-w-0">
            {loading || displayItems.length === 0 ? (
              /* Placeholder / Loader Skeleton when no real API reviews exist */
              <div className="flex flex-col gap-4 py-4 w-full">
                <div className="flex gap-4 sm:gap-6 overflow-hidden w-full">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="w-full sm:w-[280px] lg:w-[calc(33.333%-16px)] shrink-0 bg-white rounded-[24px] p-6 shadow-sm border border-[#f5ebeb]/60 relative overflow-hidden">
                      <div className="flex items-center justify-end gap-3 mb-5">
                        <div className="space-y-2 text-right">
                          <div className="h-4 bg-gray-200/70 rounded w-24 ms-auto animate-pulse" />
                          <div className="h-3 bg-gray-100 rounded w-16 ms-auto animate-pulse" />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#fdf5f6] border border-[#f5ebeb] flex items-center justify-center text-[#d96677]/50 text-xs shrink-0 font-serif">
                          ♡
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-0.5 text-amber-200">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-gray-300 text-xs">...</span>
                      </div>
                      <div className="space-y-2 mt-auto">
                        <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-4/5 mx-auto animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#a0525f] text-xs font-semibold border border-[#f5ebeb] shadow-sm">
                    {i18n.language === 'ar' ? 'بانتظار مشاركة آراء عملائنا الأوائل ♡' : 'Waiting for our first customer reviews ♡'}
                  </span>
                </div>
              </div>
            ) : (
              <>
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
                              src={(testimonial as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=fdf5f6&color=d96677&font-size=0.4`} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Date & Stars */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-0.5 text-[#ffb547]">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} className={`w-3.5 h-3.5 ${idx < testimonial.rating ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-[#89364a]/60 text-xs font-medium">
                            {formatRelativeTime(testimonial.created_at, isAr)}
                          </span>
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
                  {items.map((_, dotIndex) => (
                    <button 
                      key={dotIndex}
                      onClick={() => scrollToIndex(dotIndex)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        (activeIndex % items.length) === dotIndex ? "w-6 bg-[#d96677]" : "w-1.5 bg-[#d96677]/30"
                      )}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

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
