import { useState } from 'react';
import { useSearchParams } from 'react-router';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/products/ProductCard';
import { useMockData } from '../../data/mockData';
import { Leaf, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';

export default function Products() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { products, bestsellers } = useMockData();
  const allProducts = [...products, ...bestsellers, ...products]; // Duplicating to show more grid items like screenshot
  
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activePriceRange = searchParams.get('price');
  const searchQuery = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const setActiveCategory = (cat: string | null) => {
    setSearchParams(prev => {
      if (cat) prev.set('category', cat);
      else prev.delete('category');
      prev.set('page', '1');
      return prev;
    });
  };

  const setActivePriceRange = (price: string | null) => {
    setSearchParams(prev => {
      if (price) prev.set('price', price);
      else prev.delete('price');
      prev.set('page', '1');
      return prev;
    });
  };

  const setCurrentPage = (pageUpdater: number | ((p: number) => number)) => {
    const newPage = typeof pageUpdater === 'function' ? pageUpdater(currentPage) : pageUpdater;
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };
  
  let result = [...allProducts];

  if (searchQuery) {
    result = result.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (activeCategory) {
    const catMap: Record<string, string[]> = {
      'flower': ['decor'],
      'gift': ['gifts', 'kids'],
      'handmade': ['accessories', 'bags'],
      'home': ['home', 'decor'],
      'special': ['winter'],
      'myself': ['accessories', 'bags'],
      'occasions': ['gifts'],
      'offices': ['decor', 'home'],
      'decor': ['decor', 'home'],
      'season': ['winter'],
      'giveaways': ['gifts', 'kids'],
      'bags': ['bags'],
      'accessories': ['accessories'],
      'toys': ['kids'],
      'keychains': ['accessories', 'gifts'],
      'blankets': ['home', 'winter'],
      'gifts': ['gifts']
    };
    const targetCats = catMap[activeCategory] || [activeCategory];
    result = result.filter(p => targetCats.includes(p.category || ''));
  }
  
  if (activePriceRange) {
    result = result.filter(p => {
      if (activePriceRange === 'EGP 0 - 200') return p.price <= 200;
      if (activePriceRange === 'EGP 201 - 400') return p.price > 200 && p.price <= 400;
      if (activePriceRange === 'EGP 401 - 600') return p.price > 400 && p.price <= 600;
      if (activePriceRange === 'EGP 601+') return p.price > 600;
      return true;
    });
  }

  if (currentSort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (currentSort === 'name_asc') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || '', i18n.language));
  } else if (currentSort === 'popular') {
    result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  const totalProducts = result.length;
  const productsPerPage = 9;
  const totalPages = Math.ceil(totalProducts / productsPerPage) || 1;
  const filteredProducts = result.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // Mock filters data
  const filterCategories = [
    { id: null, name: t('productsPage.allProducts') || 'All Products', count: 128 },
    { id: 'flower', name: t('productsPage.flowerArrangements') || 'Flower Arrangements', count: 42 },
    { id: 'gift', name: t('productsPage.giftBaskets') || 'Gift Baskets', count: 34 },
    { id: 'handmade', name: t('productsPage.handmadeAccessories') || 'Handmade Accessories', count: 28 },
    { id: 'home', name: t('productsPage.homeDecor') || 'Home Decor', count: 17 },
    { id: 'special', name: t('productsPage.specialOccasions') || 'Special Occasions', count: 10 },
  ];

  const priceRanges = [
    'EGP 0 - 200',
    'EGP 201 - 400',
    'EGP 401 - 600',
    'EGP 601+'
  ];

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="relative min-h-[450px] md:min-h-[500px] flex items-center overflow-hidden bg-[#fffaf8]">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/backgrounds/products-hero.png" 
            alt="Products Background"
            className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </div>

        {/* Content */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block">
                {t('productsPage.heroTag') || 'مجموعاتنا'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm whitespace-pre-line">
                {t('productsPage.heroTitle') || 'تسوق منتجاتنا'}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('productsPage.heroSubtitle') || 'إبداع في كل قطعة.. ؟'}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('productsPage.heroDesc') || 'اكتشف مجموعتنا المختارة من المشغولات اليدوية التي صنعت بحب وعناية لتناسب جميع أذواقكم.'}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              More than just <br/>
                <span className="text-2xl">{isRTL ? "؟" : "?"}</span> Handmade..
            </div>
        </div>
          
        <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-[#fff9f6]">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
            <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
          </svg>
        </div>
      </div>

      <div className="bg-[#fff9f6] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
          
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0">
              
              {/* Filter Box */}
              <div className="bg-[#fcf7f4] rounded-xl p-6 shadow-sm border border-[#e8dcd8] relative overflow-hidden mb-8">
                {/* Decorative leaf top left */}
                <Leaf className="absolute -top-4 -left-4 w-16 h-16 text-[#a54a5c]/5 rotate-45" />
                
                <div className="flex items-center justify-between mb-8 relative z-10 border-b border-[#e8dcd8]/60 pb-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-[#9e4758]" />
                    <h3 className="font-bold text-[#4a1c24] text-lg">{t('productsPage.filterProducts') || 'Filter Products'}</h3>
                  </div>
                  <button onClick={() => { setSearchParams(new URLSearchParams()); }} className="text-[11px] text-[#9e4758] font-medium hover:underline">
                    {t('productsPage.clearAll') || 'Clear All'}
                  </button>
                </div>
                
                {/* Category List */}
                <div className="mb-8 relative z-10">
                  <h4 className="font-bold text-[#7a3440] mb-4 text-sm">{t('productsPage.category') || 'Category'}</h4>
                  <div className="space-y-3">
                    {filterCategories.map((cat, idx) => (
                      <label key={idx} className="flex items-center justify-between cursor-pointer group" onClick={() => setActiveCategory(cat.id)}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${cat.id === activeCategory ? 'border-[#9e4758] bg-white' : 'border-[#d4c5c1] bg-white'}`}>
                            {cat.id === activeCategory && <div className="w-2 h-2 rounded-full bg-[#9e4758]" />}
                          </div>
                          <span className={`text-[13px] ${cat.id === activeCategory ? 'text-[#4a1c24] font-bold' : 'text-[#4a1c24]/70 group-hover:text-[#4a1c24]'}`}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#4a1c24]/40">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8 relative z-10">
                  <h4 className="font-bold text-[#7a3440] mb-4 text-sm">{t('productsPage.priceRange') || 'Price Range'}</h4>
                  <div className="space-y-3">
                    {priceRanges.map((range, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => setActivePriceRange(range)}>
                        <div className={`w-4 h-4 rounded-full border ${activePriceRange === range ? 'border-[#9e4758] bg-white' : 'border-[#d4c5c1] bg-white'} flex items-center justify-center transition-colors`}>
                          {activePriceRange === range && <div className="w-2 h-2 rounded-full bg-[#9e4758]" />}
                        </div>
                        <span className={`text-[13px] ${activePriceRange === range ? 'text-[#4a1c24] font-bold' : 'text-[#4a1c24]/70 group-hover:text-[#4a1c24]'}`}>
                          {range}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="relative z-10 pt-4">
                  {/* Floral decor behind button */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] opacity-20 pointer-events-none -z-10">
                    <img src="/images/decorations/floral.png" alt="" className="w-full object-contain" />
                  </div>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full py-3 bg-[#9e4758] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#8b3d4b] transition-colors relative z-10">
                    {t('productsPage.applyFilters') || 'Apply Filters'}
                  </button>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-[#fcf7f4] rounded-xl p-6 shadow-sm border border-[#e8dcd8] relative overflow-hidden flex flex-col items-center text-center">
                {/* Decorative border elements */}
                <img src="/images/decorations/floral.png" alt="" className="absolute top-0 left-0 w-full opacity-10 rotate-180" />
                <img src="/images/decorations/floral.png" alt="" className="absolute bottom-0 left-0 w-full opacity-10" />
                
                <h3 className="font-handwriting text-3xl text-[#9e4758] mb-2 leading-tight mt-4 relative z-10">
                  {t('productsPage.promoTitle') || 'Perfect Gifts for Every Moment'}
                </h3>
                
                <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-4 px-6 py-2 bg-[#9e4758] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#8b3d4b] transition-colors relative z-10 flex items-center gap-2">
                  {t('productsPage.shopNow') || 'Shop Now'} <span className="text-[10px]">{isRTL ? "؟" : "?"}</span>
                </button>

                <img 
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300" 
                  alt="Promo Gift"
                  className="w-40 h-32 object-cover rounded-lg mt-8 shadow-sm relative z-10 rotate-2 hover:rotate-0 transition-transform"
                />
              </div>

            </aside>

            {/* Main Content Grid */}
            <main className="flex-1">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#e8dcd8] pb-4">
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="w-6 h-6 text-[#9e4758]" />
                    <h2 className="text-2xl font-serif font-bold text-[#4a1c24]">{t('productsPage.allProductsHeader') || 'All Products'}</h2>
                  </div>
                  {searchQuery && (
                    <p className="text-[14px] font-medium text-[#9e4758] mb-1">
                      {t('productsPage.showingResultsFor') || 'Showing results for: '} "{searchQuery}"
                    </p>
                  )}
                  <p className="text-[13px] text-[#4a1c24]/60">
                    {t('productsPage.showingProducts', { start: totalProducts ? (currentPage - 1) * productsPerPage + 1 : 0, end: Math.min(currentPage * productsPerPage, totalProducts), total: totalProducts }) || `Showing ${totalProducts ? (currentPage - 1) * productsPerPage + 1 : 0}-${Math.min(currentPage * productsPerPage, totalProducts)} of ${totalProducts} products`}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[#4a1c24]/60">{t('productsPage.sortBy') || 'Sort by'}</span>
                  <div className="relative">
                    <select 
                      value={currentSort}
                      onChange={(e) => setSearchParams(prev => { 
                        const next = new URLSearchParams(prev);
                        next.set('sort', e.target.value); 
                        next.set('page', '1'); 
                        return next; 
                      })}
                      className="appearance-none bg-white border border-[#e8dcd8] rounded-md py-2 ltr:pl-4 rtl:pr-4 ltr:pr-10 rtl:pl-10 text-[13px] text-[#4a1c24] font-medium outline-none focus:border-[#9e4758] min-w-[150px] cursor-pointer shadow-sm">
                      <option value="popular">{t('productsPage.mostPopular') || 'Most Popular'}</option>
                      <option value="price_asc">{t('productsPage.priceAsc') || 'Price: Low to High'}</option>
                      <option value="price_desc">{t('productsPage.priceDesc') || 'Price: High to Low'}</option>
                      <option value="rating">{t('productsPage.topRated') || 'Top Rated'}</option>
                      <option value="name_asc">{t('productsPage.nameAsc') || 'Name: A to Z'}</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#4a1c24]/60 absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </div>

              
              {/* Grid */}
              {filteredProducts.length > 0 ? (
                <>
                  <StaggerContainer key={searchParams.toString()} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, idx) => {
                      const enrichedProduct = {
                        ...product,
                        price: product.price * 10,
                        badge: idx % 3 === 0 ? '10% OFF' : idx % 5 === 0 ? '15% OFF' : undefined,
                        category: idx % 2 === 0 ? t('productsPage.flowerArrangements') || 'Flower Arrangements' : t('productsPage.giftBaskets') || 'Gift Baskets'
                      };
                      return <StaggerItem key={product.id + idx}><ProductCard product={enrichedProduct} /></StaggerItem>;
                    })}
                  </StaggerContainer>
                  {/* Pagination */}
                  <div className="flex justify-center items-center mt-20 mb-12 relative py-8">
                    <div className="absolute ltr:left-12 rtl:right-12 top-1/2 -translate-y-1/2 hidden md:block">
                      <img 
                        src="/images/decorations/floral.png" 
                        alt="" 
                        className="w-24 opacity-70 ltr:scale-x-[-1]" 
                        style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                      />
                    </div>
                    <div className="absolute ltr:right-12 rtl:left-12 top-1/2 -translate-y-1/2 hidden md:block">
                      <img 
                        src="/images/decorations/floral.png" 
                        alt="" 
                        className="w-24 opacity-70 rtl:scale-x-[-1]" 
                        style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-11 h-11 rounded-full bg-white border border-[#e8dcd8] flex items-center justify-center text-[#4a1c24]/60 hover:text-[#9e4758] transition-colors shadow-sm disabled:opacity-50">
                        <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-11 h-11 rounded-full ${currentPage === i + 1 ? 'bg-[#9e4758] text-white' : 'bg-white text-[#4a1c24] hover:text-[#9e4758]'} border border-[#e8dcd8] flex items-center justify-center shadow-md font-bold transition-colors text-[15px]`}>{i + 1}</button>
                      ))}
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-11 h-11 rounded-full bg-white border border-[#e8dcd8] flex items-center justify-center text-[#4a1c24]/60 hover:text-[#9e4758] transition-colors shadow-sm disabled:opacity-50">
                        <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <h3 className="text-2xl font-serif font-bold text-[#4a1c24] mb-4">{t('productsPage.noProductsFound') || 'No products found'}</h3>
                  <p className="text-[#4a1c24]/60 mb-6">{t('productsPage.noProductsDesc') || "Try adjusting your search or filters to find what you're looking for."}</p>
                  <button onClick={() => setSearchParams(new URLSearchParams())} className="px-6 py-2 bg-[#9e4758] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#8b3d4b] transition-colors">
                    {t('productsPage.clearFilters') || 'Clear Filters'}
                  </button>
                </div>
              )}


            </main>

          </div>
        </div>
      </div>
    </Layout>
  );
}


