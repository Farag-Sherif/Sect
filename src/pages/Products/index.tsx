import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/products/ProductCard';
import { Leaf, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';
import CustomSelect from '../../components/ui/CustomSelect';
import { productsService, categoriesService } from '../../api/services';
import type { ApiProduct, ApiCategory } from '../../api/types';

export default function Products() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activePriceRange = searchParams.get('price');
  const searchQuery = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const productsPerPage = 9;

  // Load categories
  useEffect(() => {
    let isMounted = true;
    categoriesService.getCategories()
      .then(data => {
        if (isMounted) setCategories(data);
      })
      .catch(err => console.error('Failed to load categories:', err));
    return () => { isMounted = false; };
  }, [i18n.language]);

  // Load products whenever query params change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    let min_price: number | undefined;
    let max_price: number | undefined;

    if (activePriceRange) {
      if (activePriceRange === 'EGP 0 - 200') { min_price = 0; max_price = 200; }
      else if (activePriceRange === 'EGP 201 - 400') { min_price = 201; max_price = 400; }
      else if (activePriceRange === 'EGP 401 - 600') { min_price = 401; max_price = 600; }
      else if (activePriceRange === 'EGP 601+') { min_price = 601; }
    }

    let sort = 'created_at';
    let order: 'asc' | 'desc' = 'desc';

    if (currentSort === 'price_asc') {
      sort = 'price';
      order = 'asc';
    } else if (currentSort === 'price_desc') {
      sort = 'price';
      order = 'desc';
    } else if (currentSort === 'rating') {
      sort = 'rating';
      order = 'desc';
    } else if (currentSort === 'popular') {
      sort = 'rating';
      order = 'desc';
    }

    const selectedCategory = categories.find(c => c.slug === activeCategory || String(c.id) === activeCategory);

    productsService.getProducts({
      category: activeCategory || undefined,
      category_id: selectedCategory?.id,
      search: searchQuery || undefined,
      page: currentPage,
      per_page: productsPerPage,
      sort,
      order,
      min_price,
      max_price,
    })
      .then(({ products: data, meta }) => {
        if (isMounted) {
          setProducts(data);
          if (meta) {
            setTotalCount(meta.total || data.length);
            setTotalPages(meta.last_page || 1);
          } else {
            setTotalCount(data.length);
            setTotalPages(Math.ceil(data.length / productsPerPage) || 1);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeCategory, categories, activePriceRange, searchQuery, currentSort, currentPage, i18n.language]);

  const setActiveCategory = (cat: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (cat) next.set('category', cat);
      else next.delete('category');
      next.set('page', '1');
      return next;
    });
  };

  const setActivePriceRange = (price: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (price) next.set('price', price);
      else next.delete('price');
      next.set('page', '1');
      return next;
    });
  };

  const setCurrentPage = (pageUpdater: number | ((p: number) => number)) => {
    const newPage = typeof pageUpdater === 'function' ? pageUpdater(currentPage) : pageUpdater;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

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
            src="/images/backgrounds/products-hero.webp" 
            alt="Products Background"
            className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </div>

        {/* Content */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block">
                {t('productsPage.heroTag')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm whitespace-pre-line">
                {t('productsPage.heroTitle')}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('productsPage.heroSubtitle')}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('productsPage.heroDesc')}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              More than just <br/>
                <span className="text-2xl">{isRTL ? "♡" : "♡"}</span> Handmade..
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
                <Leaf className="absolute -top-4 -left-4 w-16 h-16 text-[#a54a5c]/5 rotate-45" />
                
                <div className="flex items-center justify-between mb-8 relative z-10 border-b border-[#e8dcd8]/60 pb-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-[#9e4758]" />
                    <h3 className="font-bold text-[#4a1c24] text-lg">{t('productsPage.filterProducts') || 'Filter Products'}</h3>
                  </div>
                  <button onClick={() => { setSearchParams(new URLSearchParams()); }} className="text-[11px] text-[#9e4758] font-medium hover:underline cursor-pointer">
                    {t('productsPage.clearAll') || 'Clear All'}
                  </button>
                </div>
                
                {/* Category List */}
                <div className="mb-8 relative z-10">
                  <h4 className="font-bold text-[#7a3440] mb-4 text-sm">{t('productsPage.category') || 'Category'}</h4>
                  <div className="space-y-3">
                    <label 
                      className="flex items-center justify-between cursor-pointer group" 
                      onClick={() => setActiveCategory(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeCategory === null ? 'border-[#9e4758] bg-white' : 'border-[#d4c5c1] bg-white'}`}>
                          {activeCategory === null && <div className="w-2 h-2 rounded-full bg-[#9e4758]" />}
                        </div>
                        <span className={`text-[13px] ${activeCategory === null ? 'text-[#4a1c24] font-bold' : 'text-[#4a1c24]/70 group-hover:text-[#4a1c24]'}`}>
                          {t('productsPage.allProducts') || 'All Products'}
                        </span>
                      </div>
                    </label>

                    {categories.map((cat) => (
                      <label 
                        key={cat.id} 
                        className="flex items-center justify-between cursor-pointer group" 
                        onClick={() => setActiveCategory(cat.slug)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${cat.slug === activeCategory ? 'border-[#9e4758] bg-white' : 'border-[#d4c5c1] bg-white'}`}>
                            {cat.slug === activeCategory && <div className="w-2 h-2 rounded-full bg-[#9e4758]" />}
                          </div>
                          <span className={`text-[13px] ${cat.slug === activeCategory ? 'text-[#4a1c24] font-bold' : 'text-[#4a1c24]/70 group-hover:text-[#4a1c24]'}`}>
                            {cat.name}
                          </span>
                        </div>
                        {cat.products_count !== undefined && (
                          <span className="text-[11px] text-[#4a1c24]/40">({cat.products_count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8 relative z-10">
                  <h4 className="font-bold text-[#7a3440] mb-4 text-sm">{t('productsPage.priceRange') || 'Price Range'}</h4>
                  <div className="space-y-3">
                    {/* All Prices Option */}
                    <label 
                      className="flex items-center gap-3 cursor-pointer group" 
                      onClick={() => setActivePriceRange(null)}
                    >
                      <div className={`w-4 h-4 rounded-full border ${!activePriceRange ? 'border-[#9e4758] bg-white' : 'border-[#d4c5c1] bg-white'} flex items-center justify-center transition-colors`}>
                        {!activePriceRange && <div className="w-2 h-2 rounded-full bg-[#9e4758]" />}
                      </div>
                      <span className={`text-[13px] ${!activePriceRange ? 'text-[#4a1c24] font-bold' : 'text-[#4a1c24]/70 group-hover:text-[#4a1c24]'}`}>
                        {t('productsPage.allPrices') || 'All Prices'}
                      </span>
                    </label>

                    {priceRanges.map((range, idx) => {
                      const isSelected = activePriceRange === range;
                      return (
                        <label 
                          key={idx} 
                          className="flex items-center gap-3 cursor-pointer group" 
                          onClick={() => setActivePriceRange(isSelected ? null : range)}
                        >
                          <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-[#9e4758] bg-white' : 'border-[#d4c5c1] bg-white'} flex items-center justify-center transition-colors`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#9e4758]" />}
                          </div>
                          <span className={`text-[13px] ${isSelected ? 'text-[#4a1c24] font-bold' : 'text-[#4a1c24]/70 group-hover:text-[#4a1c24]'}`}>
                            {range}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Promo Banner */}
              <div className="bg-[#fcf7f4] rounded-xl p-6 shadow-sm border border-[#e8dcd8] relative overflow-hidden flex flex-col items-center text-center">
                <img src="/images/decorations/floral.webp" alt="" className="absolute top-0 left-0 w-full opacity-10 rotate-180" />
                <img src="/images/decorations/floral.webp" alt="" className="absolute bottom-0 left-0 w-full opacity-10" />
                
                <h3 className="font-handwriting text-3xl text-[#9e4758] mb-2 leading-tight mt-4 relative z-10">
                  {t('productsPage.promoTitle') || 'Perfect Gifts for Every Moment'}
                </h3>
                
                <button onClick={() => { setActiveCategory(null); }} className="mt-4 px-6 py-2 bg-[#9e4758] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#8b3d4b] transition-colors relative z-10 flex items-center gap-2 cursor-pointer">
                  {t('productsPage.shopNow') || 'Shop Now'} <span className="text-[10px]">♡</span>
                </button>

                <img 
                  src="/images/backgrounds/cart-hero.jpg" 
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
                    {t('productsPage.showingProducts', { 
                      start: totalCount ? (currentPage - 1) * productsPerPage + 1 : 0, 
                      end: Math.min(currentPage * productsPerPage, totalCount), 
                      total: totalCount 
                    }) || `Showing ${totalCount ? (currentPage - 1) * productsPerPage + 1 : 0}-${Math.min(currentPage * productsPerPage, totalCount)} of ${totalCount} products`}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[#4a1c24]/60 shrink-0">{t('productsPage.sortBy') || 'Sort by'}</span>
                  <div className="w-[180px]">
                    <CustomSelect 
                      value={currentSort}
                      onChange={(val) => setSearchParams(prev => { 
                        const next = new URLSearchParams(prev);
                        next.set('sort', val); 
                        next.set('page', '1'); 
                        return next; 
                      })}
                      options={[
                        { value: 'popular', label: t('productsPage.mostPopular') || 'Most Popular' },
                        { value: 'price_asc', label: t('productsPage.priceAsc') || 'Price: Low to High' },
                        { value: 'price_desc', label: t('productsPage.priceDesc') || 'Price: High to Low' },
                        { value: 'rating', label: t('productsPage.topRated') || 'Top Rated' },
                      ]}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Grid Loading or Results */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-28 text-[#9e4758]">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="text-base font-bold">{isRTL ? 'جاري تحميل المنتجات...' : 'Loading products...'}</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <StaggerContainer key={searchParams.toString()} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <StaggerItem key={product.id}>
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
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-20 mb-12 relative py-8">
                      <div className="absolute ltr:left-12 rtl:right-12 top-1/2 -translate-y-1/2 hidden md:block">
                        <img 
                          src="/images/decorations/floral.webp" 
                          alt="" 
                          className="w-24 opacity-70 ltr:scale-x-[-1]" 
                          style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                        />
                      </div>
                      <div className="absolute ltr:right-12 rtl:left-12 top-1/2 -translate-y-1/2 hidden md:block">
                        <img 
                          src="/images/decorations/floral.webp" 
                          alt="" 
                          className="w-24 opacity-70 rtl:scale-x-[-1]" 
                          style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <button 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                          disabled={currentPage === 1} 
                          className="w-11 h-11 rounded-full bg-white border border-[#e8dcd8] flex items-center justify-center text-[#4a1c24]/60 hover:text-[#9e4758] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)} 
                            className={`w-11 h-11 rounded-full ${currentPage === i + 1 ? 'bg-[#9e4758] text-white' : 'bg-white text-[#4a1c24] hover:text-[#9e4758]'} border border-[#e8dcd8] flex items-center justify-center shadow-md font-bold transition-colors text-[15px] cursor-pointer`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                          disabled={currentPage === totalPages} 
                          className="w-11 h-11 rounded-full bg-white border border-[#e8dcd8] flex items-center justify-center text-[#4a1c24]/60 hover:text-[#9e4758] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <h3 className="text-2xl font-serif font-bold text-[#4a1c24] mb-4">{t('productsPage.noProductsFound') || 'No products found'}</h3>
                  <p className="text-[#4a1c24]/60 mb-6">{t('productsPage.noProductsDesc') || "Try adjusting your search or filters to find what you're looking for."}</p>
                  <button onClick={() => setSearchParams(new URLSearchParams())} className="px-6 py-2 bg-[#9e4758] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#8b3d4b] transition-colors cursor-pointer">
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
