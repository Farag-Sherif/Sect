import { useRef, useState } from 'react';
import { useMockData } from '../../data/mockData';
import { ArrowLeft, ArrowRight, Heart, Gift, Package, Flower, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { StaggerContainer, StaggerItem } from '../ui/Stagger';

const getPillIcon = (iconName: string) => {
  const className = "w-4 h-4 text-brand-pink";
  switch (iconName) {
    case 'Heart': return <img src="/images/decorations/heart.png" className="w-4 h-4 object-contain mix-blend-normal opacity-90" alt="" />;
    case 'Gift': return <Gift className={className} />;
    case 'Package': return <Package className={className} />;
    case 'Flower': return <Flower className={className} />;
    case 'Sun': return <Sun className={className} />;
    default: return <Heart className={className} />;
  }
};

export default function CategoriesSection() {
  const { categories, categoryPills } = useMockData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePill, setActivePill] = useState(categoryPills[0].id);
   // Since categories don't have matching fields with pills, we just shuffle them or highlight

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      // Calculate card width exactly based on current DOM element if possible, or use percentage logic
      // In our CSS, lg card is calc(25% - 18px) plus 24px gap.
      const container = scrollRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (!firstChild) return;
      
      const cardWidth = firstChild.offsetWidth + 24; // width + gap-6
      const isRTL = getComputedStyle(container).direction === 'rtl';
      const scrollPos = isRTL ? -(index * cardWidth) : (index * cardWidth);
      
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    // In RTL, "Next" (moving left visually) means advancing the index
    const nextIndex = activeIndex < categories.length - 4 ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    // In RTL, "Prev" (moving right visually)
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : categories.length - 4;
    scrollToIndex(prevIndex);
  };

  return (
    <section className="py-24 relative mb-20 overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img src="/images/backgrounds/categories-bg.png" alt="" className="w-full h-full object-cover max-w-[1600px] mx-auto opacity-90 rtl:-scale-x-100" />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-10 items-center justify-between w-full">
          
          {/* Content (Text & Pills - Moved to Left in RTL via row-reverse) */}
          <div className="w-full lg:w-[40%] flex flex-col items-start">
            <div className="mb-4 inline-flex items-center justify-start text-brand-pink/70 text-sm font-medium w-full">
              <span className="w-6 h-[1px] bg-brand-pink/50 rtl:ml-3 ltr:mr-3"></span>
              {t('sections.categoriesSub')}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-arabic text-brand-brown flex items-center gap-2">
              <span>{t('sections.categoriesTitle')}</span>
              <img src="/images/decorations/heart.png" alt="heart" className="w-6 h-6 object-contain mix-blend-normal opacity-90 mt-1 shrink-0" />
            </h2>
            
            <p className="text-brand-brown/70 mb-10 leading-relaxed max-w-sm text-base text-start">
              {t('sections.categoriesDesc')}
            </p>
            
            {/* Pills Grid */}
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg">
              {categoryPills.map((pill) => (
                <StaggerItem key={pill.id}>
                  <button onClick={() => { setActivePill(pill.id); navigate(`/products?category=${pill.id}`); }}
                    className={`flex items-center justify-between px-3 xl:px-4 py-3 ${activePill === pill.id ? 'bg-[#fdf2f4] border-brand-pink/30' : 'bg-white'} rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full border border-gray-50 group`}
                  >
                    <span className={`text-xs xl:text-sm font-bold mr-1 group-hover:text-brand-pink transition-colors ${activePill === pill.id ? 'text-brand-pink' : 'text-brand-brown'}`}>{pill.name}</span>
                    {getPillIcon(pill.icon)}
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Left Content (Cards Carousel) */}
          <div className="w-full lg:w-[60%] relative mt-12 lg:mt-0">
            {/* Carousel Prev Button (Right side in RTL) */}
            <button 
              onClick={handlePrev}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-pink shadow-md hover:scale-110 transition-transform z-20 hidden lg:flex"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <StaggerContainer
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 md:gap-6 hide-scrollbar relative w-full px-2 pb-8 pt-4 snap-x snap-mandatory"
            >
              {categories.map((card) => (
                <StaggerItem 
                  key={card.id} 
                  className="min-w-[200px] w-[200px] sm:min-w-[220px] sm:w-[220px] lg:min-w-[calc(25%-18px)] lg:w-[calc(25%-18px)] snap-start shrink-0 bg-white rounded-[24px] p-2 pb-5 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col cursor-pointer"
                  onClick={() => navigate(`/products?category=${card.id}`)}
                >
                  {/* Heart icon top right inside card */}
                  <div className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full border border-white/50 flex items-center justify-center bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors">
                     <Heart className="w-3 h-3 text-white group-hover:text-brand-pink fill-transparent" />
                  </div>
                  
                  <div className="aspect-[4/5] rounded-[20px] overflow-hidden bg-brand-gray relative">
                    <img 
                      src={card.image}
                      alt={card.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    
                    {/* Wavy bottom overlay over the image */}
                    <div className="absolute bottom-0 left-0 w-full leading-none translate-y-[1px]">
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-8">
                         <path d="M0,20 C 30,0 70,0 100,20 L 100,20 L 0,20 Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2 px-2 bg-white relative z-10">
                    <h3 className="font-bold text-base md:text-lg text-brand-brown mb-1 truncate">{card.name}</h3>
                    <p className="text-xs md:text-sm text-brand-brown/70 truncate">{card.subtitle}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            {/* Carousel Next Button (Left side in RTL) */}
            <button 
              onClick={handleNext}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-pink shadow-md hover:scale-110 transition-transform z-20 hidden lg:flex"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
               {[0, 1, 2].map((idx) => (
                 <button 
                   key={idx}
                   onClick={() => scrollToIndex(idx)}
                   className={`w-2 h-2 rounded-full transition-colors ${activeIndex === idx ? 'bg-brand-pink' : 'bg-brand-pink/30'}`}
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
