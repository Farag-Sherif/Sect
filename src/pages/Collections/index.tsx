import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';
import CustomSelect from '../../components/ui/CustomSelect';
import { ArrowRight, ChevronDown, Grid, ShoppingBag, Home, Gem, Star, Key, Square, Gift, Sun, Heart, Loader2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';
import { categoriesService } from '../../api/services';
import type { ApiCategory } from '../../api/types';

const getCategoryIcon = (iconName?: string | null) => {
  switch (iconName?.toLowerCase()) {
    case 'bag':
    case 'bags':
      return ShoppingBag;
    case 'home':
      return Home;
    case 'gem':
    case 'accessories':
      return Gem;
    case 'star':
    case 'toys':
      return Star;
    case 'key':
    case 'keychains':
      return Key;
    case 'moon':
    case 'blankets':
      return Square;
    case 'gift':
    case 'gifts':
      return Gift;
    case 'sun':
    case 'seasonal':
      return Sun;
    default:
      return Gift;
  }
};

import ProductImage from '../../components/ui/ProductImage';

export default function Collections() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    categoriesService.getCategories()
      .then(data => {
        if (isMounted) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [i18n.language]);

  const filteredCategories = categories.filter(item => {
    if (activeCat === 'all') return true;
    return item.slug === activeCat;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (currentSort === 'count_desc') {
      return (b.products_count || 0) - (a.products_count || 0);
    }
    if (currentSort === 'count_asc') {
      return (a.products_count || 0) - (b.products_count || 0);
    }
    if (currentSort === 'name_asc') {
      return a.name.localeCompare(b.name, i18n.language);
    }
    if (currentSort === 'name_desc') {
      return b.name.localeCompare(a.name, i18n.language);
    }
    return a.id - b.id;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-[76px] md:pt-[92px]">
        {/* Hero Section */}
        <div className="relative min-h-[450px] md:min-h-[500px] flex items-center overflow-hidden bg-[#fffaf8]">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/backgrounds/products-hero.webp" 
              alt="Background"
              className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block ltr:ml-1 rtl:mr-1">
                {t('collections.heroSubtitle')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm">
                {t('collections.heroTitle')}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('collections.heroScript')}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('collections.heroDesc')}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              Handmade <br/> 
              with love <br/>
              <Heart className="w-6 h-6 inline-block mt-2 opacity-90 fill-current" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-white">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Navigation / Filter Bar */}
        <div className="border-b border-[#EACBD0]/40 bg-white sticky top-[76px] md:top-[92px] z-30 shadow-xs">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-4 flex items-center gap-4 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set('category', 'all');
                return next;
              })}
              className={`flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] p-4 rounded-xl transition-all cursor-pointer ${activeCat === 'all' ? 'bg-[#9A3B50] text-white shadow-md' : 'hover:bg-[#FDF5F6] text-text-light hover:text-primary'}`}
            >
              <Grid className={`w-6 h-6 mb-2 ${activeCat === 'all' ? 'text-white' : 'text-[#9A3B50]'}`} strokeWidth={1.5} />
              <span className={`text-xs md:text-sm font-bold text-center ${activeCat === 'all' ? 'text-white' : 'text-text-dark'}`}>
                {isRTL ? 'الكل' : 'All'}
              </span>
            </button>

            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              const isActive = activeCat === cat.slug;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.set('category', cat.slug);
                    return next;
                  })}
                  className={`flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] p-4 rounded-xl transition-all cursor-pointer ${isActive ? 'bg-[#9A3B50] text-white shadow-md' : 'hover:bg-[#FDF5F6] text-text-light hover:text-primary'}`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-[#9A3B50]'}`} strokeWidth={1.5} />
                  <span className={`text-xs md:text-sm font-bold text-center truncate max-w-[100px] ${isActive ? 'text-white' : 'text-text-dark'}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collections Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-dark mb-2">{t('collections.allCollectionsTitle')}</h2>
                <p className="text-text-light">{t('collections.allCollectionsDesc')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-light shrink-0">{t('collections.sortBy') || 'Sort by:'}</span>
                <div className="w-[180px]">
                  <CustomSelect
                    value={currentSort}
                    onChange={(val) => setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      next.set('sort', val);
                      return next;
                    })}
                    options={[
                      { value: 'featured', label: t('collections.sortFeatured') || 'Featured' },
                      { value: 'count_desc', label: t('collections.sortCountDesc') || 'Most Products' },
                      { value: 'count_asc', label: t('collections.sortCountAsc') || 'Least Products' },
                      { value: 'name_asc', label: t('collections.sortNameAsc') || 'Name: A to Z' },
                      { value: 'name_desc', label: t('collections.sortNameDesc') || 'Name: Z to A' },
                    ]}
                    size="sm"
                    variant="subtle"
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#9A3B50]">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-sm font-bold">{isRTL ? 'جاري تحميل المجموعات...' : 'Loading collections...'}</p>
              </div>
            ) : (
              <StaggerContainer key={`${activeCat}-${currentSort}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedCategories.map((item) => {
                  const Icon = getCategoryIcon(item.icon);

                  return (
                    <StaggerItem 
                      key={item.id} 
                      className="group cursor-pointer"
                      onClick={() => navigate(`/products?category=${item.slug}`)}
                    >
                      <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3] mb-4 bg-[#fdf5f6]">
                        <ProductImage 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          icon="sparkles"
                          label={item.name}
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                      </div>
                      
                      <div className="relative -mt-10 mx-4 bg-white rounded-xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#FCF8F9] flex items-center justify-center text-[#9A3B50]">
                             <Icon className="w-5 h-5" strokeWidth={1.5} />
                           </div>
                           <div>
                             <h3 className="font-bold text-text-dark text-sm truncate max-w-[130px]">{item.name}</h3>
                             <p className="text-xs text-text-light">{item.products_count ?? 0} {t('collections.productsCount')}</p>
                           </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] group-hover:bg-[#9A3B50] group-hover:text-white transition-colors shrink-0">
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}

          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-20 relative bg-[#FDF5F6] border-y border-[#f5ebeb] mt-16 overflow-hidden">
           <div className="absolute top-0 ltr:left-0 rtl:right-0 w-64 h-64 pointer-events-none opacity-40">
             <img src="/images/decorations/floral.webp" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} alt="" />
           </div>
           
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative z-10">
             <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 justify-between">
                 
                 <div className="lg:w-1/2">
                   <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4a1c24] mb-6 leading-tight whitespace-pre-line text-center lg:ltr:text-left lg:rtl:text-right">
                     {t('collections.promoTitle')} <span className="font-handwriting text-[#913b4c] inline-block rtl:mr-3 ltr:ml-3 text-4xl">{isRTL ? "♡" : "♡"}</span>
                   </h2>
                   <p className="text-[#4a1c24]/70 mb-8 leading-relaxed text-sm md:text-base text-center lg:ltr:text-left lg:rtl:text-right">
                     {t('collections.promoDesc')}
                   </p>
                   <div className="flex justify-center lg:justify-start">
                     <button onClick={() => navigate('/products')} className="bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer">
                       {t('collections.promoBtn', isRTL ? 'استكشف منتجاتنا' : 'Explore Our Products')}
                       <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                     </button>
                   </div>
                 </div>

                 <div className="lg:w-1/2 flex justify-center">
                   <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                     <img 
                       src="/images/backgrounds/collections-hero.jpg" 
                       alt="Handmade collection gift" 
                       className="w-full h-full object-cover"
                     />
                   </div>
                 </div>

             </div>
           </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
