import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';
import CustomSelect from '../../components/ui/CustomSelect';
import { Home, ChevronRight, ChevronLeft, ChevronDown, Calendar, Clock, Heart, BookOpen, Camera, Gift, ShieldCheck, Mail, Search, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';
import { blogService, contactService } from '../../api/services';
import type { ApiBlogPost, ApiBlogCategory } from '../../api/types';
import ProductImage from '../../components/ui/ProductImage';

export default function Journal() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'newest';

  const [apiPosts, setApiPosts] = useState<ApiBlogPost[]>([]);
  const [apiCategories, setApiCategories] = useState<ApiBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      blogService.getCategories(),
      blogService.getPosts({ 
        category: activeCategory !== 'all' ? activeCategory : undefined,
        page: currentPage,
        per_page: 12
      })
    ]).then(([catsResult, postsResult]) => {
      if (!isMounted) return;

      if (catsResult.status === 'fulfilled' && catsResult.value) {
        setApiCategories(catsResult.value);
      }
      if (postsResult.status === 'fulfilled' && postsResult.value?.posts) {
        setApiPosts(postsResult.value.posts);
      } else {
        setApiPosts([]);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [activeCategory, currentPage, i18n.language]);

  const setActiveCategory = (cat: string) => {
    setSearchParams(prev => { 
      const next = new URLSearchParams(prev);
      next.set('category', cat); 
      next.set('page', '1'); 
      return next; 
    });
  };

  const setSearchQuery = (q: string) => {
    setSearchParams(prev => { 
      const next = new URLSearchParams(prev);
      if (q) next.set('search', q); 
      else next.delete('search'); 
      next.set('page', '1'); 
      return next; 
    });
  };

  const setCurrentPage = (page: number) => {
    setSearchParams(prev => { 
      const next = new URLSearchParams(prev);
      next.set('page', page.toString()); 
      return next; 
    });
  };

  // Strictly map posts coming from API
  const formattedPosts = apiPosts.map(p => ({
    id: p.id,
    tag: p.category?.name || (isRTL ? 'مقال' : 'Article'),
    categorySlug: p.category?.slug || '',
    title: p.title,
    desc: p.excerpt || (p.content ? p.content.replace(/<[^>]*>?/gm, '').slice(0, 130) + '...' : ''),
    date: p.created_at 
      ? new Date(p.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    read: String(p.read_time || '5'),
    img: p.image || null,
    slug: p.slug
  }));

  // Client filtering for fast search feedback
  const filteredPosts = formattedPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.categorySlug === activeCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (currentSort === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (currentSort === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (currentSort === 'popular') {
      return parseInt(b.read, 10) - parseInt(a.read, 10);
    }
    return 0;
  });

  const postsPerPage = 6;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage) || 1;
  const currentPosts = sortedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // Dynamic Categories from API
  const categoryIcons = [Heart, BookOpen, Camera, Gift, ShieldCheck];
  const dynamicCategories = apiCategories.length > 0 
    ? apiCategories.map((c, idx) => ({
        id: c.slug,
        name: c.name,
        count: c.posts_count ?? apiPosts.filter(p => p.category?.slug === c.slug).length,
        icon: categoryIcons[idx % categoryIcons.length]
      }))
    : Array.from(new Map(apiPosts.filter(p => p.category).map(p => [p.category!.slug, p.category!])).values()).map((c, idx) => ({
        id: c.slug,
        name: c.name,
        count: apiPosts.filter(p => p.category?.slug === c.slug).length,
        icon: categoryIcons[idx % categoryIcons.length]
      }));

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await contactService.subscribeNewsletter(newsletterEmail.trim());
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setNewsletterEmail('');
    } catch {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF5F6] flex flex-col font-sans">
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
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block">
                {t('journal.heroSubtitle')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm whitespace-pre-line">
                {t('journal.heroTitle')}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('journal.heroScript')}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('journal.heroDesc')}
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
          
          <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-[#FDF5F6]">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Blog Content Section */}
        <section className="py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              
              {/* Left Column: Articles List */}
              <div className="lg:w-[70%] xl:w-[75%] min-w-0">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#EACBD0]/40 pb-6">
                  <div className="flex items-center gap-3">
                    <LeafIcon />
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">{t('journal.latest')}</h2>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-sm text-text-light shrink-0">{t('journal.sortBy') || 'Sort by:'}</span>
                    <div className="w-[170px]">
                      <CustomSelect
                        value={currentSort}
                        onChange={(val) => setSearchParams(prev => {
                          const next = new URLSearchParams(prev);
                          next.set('sort', val);
                          next.set('page', '1');
                          return next;
                        })}
                        options={[
                          { value: 'newest', label: t('journal.sortNewest') || 'Newest' },
                          { value: 'oldest', label: t('journal.sortOldest') || 'Oldest' },
                          { value: 'popular', label: t('journal.sortPopular') || 'Most Read' },
                        ]}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Skeletons while loading */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EACBD0]/30 animate-pulse flex flex-col h-full">
                        <div className="aspect-[4/3] bg-[#fbf2f4] w-full" />
                        <div className="p-5 flex-1 flex flex-col space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-100 rounded w-full" />
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                          <div className="mt-auto pt-4 border-t border-[#EACBD0]/30 flex justify-between">
                            <div className="h-3 bg-gray-100 rounded w-20" />
                            <div className="h-3 bg-gray-100 rounded w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : currentPosts.length === 0 ? (
                  /* Clean Empty State inside same layout */
                  <div className="text-center py-16 bg-white rounded-2xl border border-[#EACBD0]/30 p-8 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-[#fdf5f6] text-[#9A3B50] flex items-center justify-center mx-auto mb-4 border border-[#f5ebeb]">
                      <BookOpen className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h3 className="font-bold text-text-dark text-lg mb-2">
                      {isRTL ? 'لا توجد مقالات مضافة حالياً في الـ API' : 'No articles available in API currently'}
                    </h3>
                    <p className="text-text-light text-sm max-w-sm mx-auto mb-6">
                      {isRTL 
                        ? 'بمجرد إضافة مقالات جديدة من لوحة التحكم، ستظهر هنا فوراً بنفس التصميم الأنيق.' 
                        : 'Articles published from the backend will appear here seamlessly in this layout.'}
                    </p>
                    {activeCategory !== 'all' && (
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="px-5 py-2.5 bg-[#9A3B50] text-white text-xs font-bold rounded-xl hover:bg-[#833244] transition-colors cursor-pointer shadow-sm"
                      >
                        {isRTL ? 'عرض جميع المقالات' : 'View All Articles'}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Grid of Real API Posts */
                  <>
                    <StaggerContainer key={searchParams.toString()} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentPosts.map((post) => (
                        <StaggerItem key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EACBD0]/30 group flex flex-col h-full hover:shadow-md transition-shadow">
                          <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-[#fbf2f4]">
                            <ProductImage 
                              src={post.img} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              label={post.tag}
                              icon="sparkles"
                            />
                            <div className="absolute top-3 start-3 bg-[#78283a] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm z-10 pointer-events-none">
                              {post.tag}
                            </div>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-text-dark text-lg mb-2 leading-tight group-hover:text-[#9A3B50] transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-text-light text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                              {post.desc}
                            </p>
                            <div className="flex items-center justify-between text-xs text-[#b08992] font-medium pt-4 border-t border-[#EACBD0]/30 mt-auto">
                              <div className="flex items-center gap-4">
                                {post.date && (
                                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                )}
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.read} {t('journal.minRead', isRTL ? 'دقائق' : 'min read')}</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link to={post.slug ? `/journal/${post.slug}` : '#'} className="inline-flex items-center gap-2 text-sm font-bold text-[#9A3B50] hover:text-[#833244] transition-colors">
                                {t('journal.readMore', isRTL ? 'اقرأ المزيد' : 'Read More')} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                              </Link>
                            </div>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-16 relative py-4">
                        {/* Decorative floras */}
                        <div className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 hidden sm:block pointer-events-none">
                          <img 
                            src="/images/decorations/floral.webp" 
                            alt="" 
                            className="w-16 opacity-70 ltr:scale-x-[-1]" 
                            style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                          />
                        </div>
                        <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 hidden sm:block pointer-events-none">
                          <img 
                            src="/images/decorations/floral.webp" 
                            alt="" 
                            className="w-16 opacity-70 rtl:scale-x-[-1]" 
                            style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                          />
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                          <button 
                            onClick={() => {
                              const newP = Math.max(1, currentPage - 1);
                              setCurrentPage(newP);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            disabled={currentPage === 1}
                            className="w-11 h-11 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#b08992] hover:text-[#9A3B50] transition-colors shadow-sm disabled:opacity-40 cursor-pointer"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                          </button>
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button 
                              key={i} 
                              onClick={() => {
                                setCurrentPage(i + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-11 h-11 rounded-full font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                                currentPage === i + 1 
                                  ? 'bg-[#9A3B50] text-white shadow-md' 
                                  : 'bg-white border border-[#EACBD0] text-[#4a1c24] hover:text-[#9A3B50] hover:border-[#9A3B50]/30'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button 
                            onClick={() => {
                              const newP = Math.min(totalPages, currentPage + 1);
                              setCurrentPage(newP);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            disabled={currentPage === totalPages}
                            className="w-11 h-11 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#b08992] hover:text-[#9A3B50] transition-colors shadow-sm disabled:opacity-40 cursor-pointer"
                            aria-label="Next page"
                          >
                            <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:w-[30%] xl:w-[25%] space-y-8 shrink-0">
                
                {/* Search Box */}
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                    placeholder={isRTL ? "البحث في المقالات..." : "Search blog posts..."} 
                    className="w-full bg-white border border-[#EACBD0]/60 rounded-xl px-4 py-3 ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 focus:outline-none focus:border-primary shadow-xs transition-colors text-sm text-text-dark" 
                  />
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-4 h-4 text-text-light`} />
                </div>

                {/* Categories Box from API */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EACBD0]/30">
                  <div className="flex items-center gap-2 mb-6">
                    <LeafIcon className="w-5 h-5 text-[#9A3B50]" />
                    <h3 className="font-serif font-bold text-xl text-text-dark">{t('journal.categoriesTitle', isRTL ? 'التصنيفات' : 'Categories')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* All Posts entry */}
                    <div className="group">
                      <button onClick={() => setActiveCategory('all')} className="w-full flex justify-between items-center text-sm cursor-pointer">
                        <div className={`flex items-center gap-3 ${activeCategory === 'all' ? 'text-[#9A3B50] font-bold' : 'text-text-light group-hover:text-primary transition-colors'}`}>
                          <Home className="w-4 h-4" strokeWidth={1.5} />
                          <span>{isRTL ? 'جميع المقالات' : 'All Posts'}</span>
                        </div>
                        <span className={`text-xs ${activeCategory === 'all' ? 'text-[#9A3B50] font-bold' : 'text-text-light/60'}`}>
                          ({apiPosts.length})
                        </span>
                      </button>
                      {dynamicCategories.length > 0 && <div className="border-t border-[#EACBD0]/30 mt-4"></div>}
                    </div>

                    {/* Dynamic Categories from API */}
                    {dynamicCategories.map((cat, idx) => (
                      <div key={cat.id} className="group">
                        <button onClick={() => setActiveCategory(cat.id)} className="w-full flex justify-between items-center text-sm cursor-pointer">
                          <div className={`flex items-center gap-3 ${activeCategory === cat.id ? 'text-[#9A3B50] font-bold' : 'text-text-light group-hover:text-primary transition-colors'}`}>
                            <cat.icon className="w-4 h-4" strokeWidth={1.5} />
                            <span>{cat.name}</span>
                          </div>
                          <span className={`text-xs ${activeCategory === cat.id ? 'text-[#9A3B50] font-bold' : 'text-text-light/60'}`}>
                            ({cat.count})
                          </span>
                        </button>
                        {idx < dynamicCategories.length - 1 && <div className="border-t border-[#EACBD0]/30 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stay Inspired Newsletter */}
                <div className="bg-[#FCF8F9] rounded-2xl p-6 text-center border border-[#EACBD0]/40 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-40 mix-blend-multiply">
                    <img src="/images/decorations/floral.webp" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" />
                  </div>
                  
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-4 relative z-10 border border-[#EACBD0]/30">
                    <Mail className="w-5 h-5 text-[#9A3B50]" />
                    <div className="absolute -top-1 -right-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A3B50" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                  </div>
                  
                  <h3 className="font-serif font-bold text-xl text-text-dark mb-2 relative z-10">{t('journal.stayInspired')}</h3>
                  <p className="text-xs text-text-light mb-6 relative z-10 leading-relaxed">{t('journal.stayInspiredDesc')}</p>
                  
                  <form onSubmit={handleNewsletterSubmit} className="relative z-10 space-y-3">
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={isRTL ? "بريدك الإلكتروني" : "Your email address"} 
                      required
                      className="w-full bg-white border border-[#EACBD0]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-center" 
                    />
                    <button type="submit" className="w-full bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
                      <Heart className="w-3.5 h-3.5" />
                      {newsletterSubscribed ? (isRTL ? "تم الاشتراك!" : "Subscribed!") : t('journal.subscribe')}
                    </button>
                  </form>

                  <div className="mt-6 font-handwriting text-[#9A3B50] text-sm transform -rotate-2 relative z-10">
                    "Crochet is not just a craft...<br/>it's a way to spread happiness<br/>♡"
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

function LeafIcon({ className = "w-6 h-6 text-[#9A3B50]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}
