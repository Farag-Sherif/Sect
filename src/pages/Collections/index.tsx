import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';
import { ArrowRight, ChevronDown, Grid, ShoppingBag, Home, Watch, Smile, Key, Square, Gift, Heart, ShieldCheck, Truck, Star } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';

const collections = [
  { id: 1, titleKey: "catBags", img: "/images/backgrounds/collections-hero.jpg", count: 24, icon: ShoppingBag },
  { id: 2, titleKey: "catHome", img: "/images/backgrounds/about-hero.jpg", count: 18, icon: Home },
  { id: 3, titleKey: "catAccessories", img: "/images/backgrounds/cart-hero.jpg", count: 32, icon: Watch },
  { id: 4, titleKey: "catToys", img: "/images/backgrounds/collections-hero.jpg", count: 16, icon: Smile },
  { id: 5, titleKey: "catKeychains", img: "/images/backgrounds/about-hero.jpg", count: 12, icon: Key },
  { id: 6, titleKey: "catBlankets", img: "/images/backgrounds/cart-hero.jpg", count: 10, icon: Square },
  { id: 7, titleKey: "catGiftSets", img: "/images/backgrounds/collections-hero.jpg", count: 8, icon: Gift },
  { id: 8, titleKey: "catAll", img: "/images/backgrounds/about-hero.jpg", count: 14, icon: Star, overrideTitle: "Seasonal" },
];

const categories = [
  { id: "all", titleKey: "catAll", icon: Grid },
  { id: "bags", titleKey: "catBags", icon: ShoppingBag },
  { id: "home", titleKey: "catHome", icon: Home },
  { id: "accessories", titleKey: "catAccessories", icon: Watch },
  { id: "toys", titleKey: "catToys", icon: Smile },
  { id: "keychains", titleKey: "catKeychains", icon: Key },
  { id: "blankets", titleKey: "catBlankets", icon: Square },
  { id: "gifts", titleKey: "catGiftSets", icon: Gift },
];

export default function Collections() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';

  const filteredCollections = collections.filter(item => {
    if (activeCat === 'all') return true;
    return item.titleKey.toLowerCase().includes(activeCat.toLowerCase());
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (currentSort === 'count_desc') {
      return b.count - a.count;
    }
    if (currentSort === 'count_asc') {
      return a.count - b.count;
    }
    if (currentSort === 'name_asc') {
      const nameA = a.overrideTitle || t(`collections.${a.titleKey}`).replace('\n', ' ');
      const nameB = b.overrideTitle || t(`collections.${b.titleKey}`).replace('\n', ' ');
      return nameA.localeCompare(nameB, i18n.language);
    }
    if (currentSort === 'name_desc') {
      const nameA = a.overrideTitle || t(`collections.${a.titleKey}`).replace('\n', ' ');
      const nameB = b.overrideTitle || t(`collections.${b.titleKey}`).replace('\n', ' ');
      return nameB.localeCompare(nameA, i18n.language);
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
              src="/images/backgrounds/products-hero.png" 
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
              <svg className="w-6 h-6 inline-block mt-2 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-white">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="relative -mt-16 z-50 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 mb-16">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 md:p-6 flex items-center justify-between overflow-x-auto gap-4 hide-scrollbar">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.set('category', cat.id);
                    return next;
                  })}
                  className={`flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] p-4 rounded-xl transition-all ${isActive ? 'bg-[#9A3B50] text-white shadow-md' : 'hover:bg-[#FDF5F6] text-text-light hover:text-primary'}`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-[#9A3B50]'}`} strokeWidth={1.5} />
                  <span className={`text-xs md:text-sm font-bold text-center whitespace-pre-line ${isActive ? 'text-white' : 'text-text-dark'}`}>{t(`collections.${cat.titleKey}`)}</span>
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
                <span className="text-sm text-text-light">{t('collections.sortBy') || 'Sort by:'}</span>
                <div className="relative">
                  <select
                    value={currentSort}
                    onChange={(e) => setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      next.set('sort', e.target.value);
                      return next;
                    })}
                    className="appearance-none bg-[#FCF8F9] px-4 py-2 rounded-lg text-sm font-bold text-text-dark hover:bg-[#FDF5F6] transition-colors border border-[#EACBD0]/60 outline-none focus:border-[#9A3B50] cursor-pointer shadow-sm ltr:pr-9 rtl:pl-9 ltr:pl-4 rtl:pr-4 min-w-[150px]"
                  >
                    <option value="featured">{t('collections.sortFeatured') || 'Featured'}</option>
                    <option value="count_desc">{t('collections.sortCountDesc') || 'Most Products'}</option>
                    <option value="count_asc">{t('collections.sortCountAsc') || 'Least Products'}</option>
                    <option value="name_asc">{t('collections.sortNameAsc') || 'Name: A to Z'}</option>
                    <option value="name_desc">{t('collections.sortNameDesc') || 'Name: Z to A'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-dark absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            <StaggerContainer key={`${activeCat}-${currentSort}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedCollections.map((item) => {
                const categorySlug = item.titleKey === 'catAll' ? 'season' : item.titleKey.replace('cat', '').toLowerCase();
                return (
                  <StaggerItem 
                    key={item.id} 
                    className="group cursor-pointer"
                    onClick={() => navigate(`/products?category=${categorySlug}`)}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3] mb-4">
                      <img src={item.img} alt="Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    
                    <div className={`relative -mt-10 mx-4 bg-white rounded-xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:-translate-y-1 transition-transform duration-300`}>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#FCF8F9] flex items-center justify-center text-[#9A3B50]">
                           <item.icon className="w-5 h-5" strokeWidth={1.5} />
                         </div>
                         <div>
                           <h3 className="font-bold text-text-dark text-sm">{item.overrideTitle || t(`collections.${item.titleKey}`).replace('\n', ' ')}</h3>
                           <p className="text-xs text-text-light">{item.count} {t('collections.productsCount')}</p>
                         </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] group-hover:bg-[#9A3B50] group-hover:text-white transition-colors">
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-20 relative bg-[#FDF5F6] border-y border-[#f5ebeb] mt-16 overflow-hidden">
           {/* Background decorations */}
           <div className="absolute top-0 ltr:left-0 rtl:right-0 w-64 h-64 pointer-events-none opacity-40">
             <img src="/images/decorations/floral.png" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} alt="" />
           </div>
           
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative z-10">
             <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 justify-between">
                 
                 {/* Text Content */}
                 <div className="lg:w-1/2">
                   <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4a1c24] mb-6 leading-tight whitespace-pre-line text-center lg:ltr:text-left lg:rtl:text-right">
                     {t('collections.promoTitle')} <span className="font-handwriting text-[#913b4c] inline-block rtl:mr-3 ltr:ml-3 text-4xl">{isRTL ? "؟" : "?"}</span>
                   </h2>
                   <p className="text-[#4a1c24]/70 text-[15px] leading-relaxed mb-8 max-w-md font-medium text-center lg:ltr:text-left lg:rtl:text-right mx-auto lg:mx-0">
                     {t('collections.promoDesc')}
                   </p>
                   <button className="bg-[#913b4c] hover:bg-[#7a3140] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all flex items-center justify-center gap-2 mx-auto lg:mx-0 w-max">
                     {t('collections.exploreStory')}
                     <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
  
                 {/* Images Collage */}
                 <div className="lg:w-1/2 relative flex justify-center lg:ltr:justify-end lg:rtl:justify-start mt-12 lg:mt-0">
                   <div className="relative w-full max-w-[400px]">
                     {/* Big Image */}
                     <img src="/images/backgrounds/collections-hero.jpg" alt="Promo Bag" className="w-full h-auto rounded-[2rem] shadow-xl object-cover relative z-10" />
                     
                     {/* Polaroid Overlapping */}
                     <div className={`absolute top-1/2 -translate-y-1/2 ltr:-right-16 rtl:-left-16 w-52 bg-white p-3 pb-8 shadow-2xl rounded-sm transform transition-transform ${isRTL ? '-rotate-[6deg]' : 'rotate-[6deg]'} hover:rotate-0 z-20 border border-gray-100`}>
                       {/* Tape */}
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#d1bfae]/60 transform -rotate-3 backdrop-blur-sm z-30"></div>
                       
                       <img src="/images/backgrounds/collections-hero.jpg" alt="Artisans" className="w-full h-36 object-cover mb-4" />
                       
                       <div className="text-center flex flex-col items-center">
                         <span className="font-handwriting text-[#d96677] text-2xl leading-none mb-2">{isRTL ? 'أيادي مبدعة' : 'Real hands'}</span>
                         <span className="font-handwriting text-[#913b4c] text-lg flex items-center justify-center gap-1">{isRTL ? 'وقصص حقيقية' : 'Real stories'} <span>{isRTL ? "؟" : "?"}</span></span>
                       </div>
                     </div>
                   </div>
                 </div>
  
               </div>
             </div>
          </section>

        {/* Features Footer */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              <div className="lg:w-1/4">
                <h2 className="text-3xl font-serif font-bold text-text-dark mb-3 whitespace-pre-line">
                  {t('collections.whyTitle')}
                </h2>
                <p className="text-text-light text-sm">
                  {t('collections.whyDesc')}
                </p>
              </div>

              <div className="lg:w-3/4 grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FCF8F9] flex items-center justify-center text-[#9A3B50]">
                    <Heart className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">{t('collections.why1Title')}</h4>
                    <p className="text-xs text-text-light leading-relaxed">{t('collections.why1Desc')}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FCF8F9] flex items-center justify-center text-[#9A3B50]">
                    <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">{t('collections.why2Title')}</h4>
                    <p className="text-xs text-text-light leading-relaxed">{t('collections.why2Desc')}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FCF8F9] flex items-center justify-center text-[#9A3B50]">
                    <Truck className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">{t('collections.why3Title')}</h4>
                    <p className="text-xs text-text-light leading-relaxed">{t('collections.why3Desc')}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FCF8F9] flex items-center justify-center text-[#9A3B50]">
                    <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">{t('collections.why4Title')}</h4>
                    <p className="text-xs text-text-light leading-relaxed">{t('collections.why4Desc')}</p>
                  </div>
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

