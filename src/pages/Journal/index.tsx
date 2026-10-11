import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';
import { Home, ChevronRight, ChevronLeft, ChevronDown, Calendar, Clock, Heart, BookOpen, Camera, Gift, ShieldCheck, Mail, Search, ArrowRight } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';

const blogPosts = [
  { id: 1, tag: "Tips & Tricks", title: "How to Choose the Right Yarn for Your Crochet Projects", desc: "Learn how to pick the best yarn for your projects, based on texture, durability and seasonal use.", date: "May 12, 2025", read: "5", img: "/images/backgrounds/about-hero.jpg" },
  { id: 2, tag: "Tutorials", title: "Step by Step: Crochet Flower Keychain", desc: "A simple and fun tutorial to create your own crochet flower keychain. Perfect for beginners!", date: "May 8, 2025", read: "6", img: "/images/backgrounds/journal-hero.jpg" },
  { id: 3, tag: "Behind the Scenes", title: "A Day in Our Handmade Studio", desc: "Take a look behind the scenes and see how each piece is made with love, patience and care.", date: "May 3, 2025", read: "4", img: "/images/backgrounds/contact-hero.jpg" },
  { id: 4, tag: "Gift Ideas", title: "Best Crochet Gifts for Every Occasion", desc: "From birthdays to holidays, explore our favorite handmade gift ideas that bring joy to every moment.", date: "April 28, 2025", read: "5", img: "/images/backgrounds/cart-hero.jpg" },
  { id: 5, tag: "Care Guide", title: "How to Care for Your Crochet Items", desc: "Keep your handmade pieces looking beautiful for years with these simple care tips.", date: "April 22, 2025", read: "4", img: "/images/backgrounds/collections-hero.jpg" },
  { id: 6, tag: "Inspiration", title: "The Story Behind Our Crochet Bunny", desc: "A little story about how our most loved bunny design came to life ? and what it means to us.", date: "April 16, 2025", read: "5", img: "/images/backgrounds/about-hero.jpg" },
];

const categories = [
  { id: "all", titleKey: "catAll", count: 12, icon: Home },
  { id: "tips", titleKey: "catTips", count: 4, icon: Heart },
  { id: "tutorials", titleKey: "catTutorials", count: 3, icon: BookOpen },
  { id: "behind", titleKey: "catBehind", count: 2, icon: Camera },
  { id: "gift", titleKey: "catGift", count: 2, icon: Gift },
  { id: "care", titleKey: "catCare", count: 1, icon: ShieldCheck },
];

export default function Journal() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const currentSort = searchParams.get('sort') || 'newest';

  const setActiveCategory = (cat: string) => {
    setSearchParams(prev => { prev.set('category', cat); prev.set('page', '1'); return prev; });
  };
  const setSearchQuery = (q: string) => {
    setSearchParams(prev => { if (q) prev.set('search', q); else prev.delete('search'); prev.set('page', '1'); return prev; });
  };
  const setCurrentPage = (page: number) => {
    setSearchParams(prev => { prev.set('page', page.toString()); return prev; });
  };

  const filteredPosts = blogPosts.filter(post => {
    const catMap = { tips: 'Tips', tutorials: 'Tutorials', behind: 'Behind', gift: 'Gift', care: 'Care' } as any;
    const matchesCategory = activeCategory === 'all' || (catMap[activeCategory] && post.tag.includes(catMap[activeCategory]));
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage) || 1; /* eslint-disable-line */
  const currentPosts = sortedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className="min-h-screen bg-[#FDF5F6] flex flex-col font-sans">
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
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block">
                {t('journal.heroSubtitle') || 'يومياتنا'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm whitespace-pre-line">
                {t('journal.heroTitle') || 'قصص وإلهام'}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('journal.heroScript') || 'أفكار ونصائح وحكايات من عالم الحرفيات'}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('journal.heroDesc') || 'اكتشف مقالاتنا حول الحرف اليدوية، العناية بالمنتجات، وكل ما يخص عالمنا.'}
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

        {/* Blog Content */}
        <section className="py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              
              {/* Left Column: Articles List */}
              <div className="lg:w-[70%] xl:w-[75%]">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-[#EACBD0]/40 pb-6">
                  <div className="flex items-center gap-3">
                    <LeafIcon />
                    <h2 className="text-2xl font-serif font-bold text-text-dark">{t('journal.latest')}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-light">{t('journal.sortBy') || 'Sort by:'}</span>
                    <div className="relative">
                      <select
                        value={currentSort}
                        onChange={(e) => setSearchParams(prev => {
                          const next = new URLSearchParams(prev);
                          next.set('sort', e.target.value);
                          next.set('page', '1');
                          return next;
                        })}
                        className="appearance-none bg-white border border-[#EACBD0]/40 rounded-lg py-2 ltr:pl-4 rtl:pr-4 ltr:pr-10 rtl:pl-10 text-sm font-bold text-text-dark outline-none focus:border-[#9A3B50] min-w-[140px] cursor-pointer shadow-sm hover:border-[#9A3B50] transition-colors"
                      >
                        <option value="newest">{t('journal.sortNewest') || 'Newest'}</option>
                        <option value="oldest">{t('journal.sortOldest') || 'Oldest'}</option>
                        <option value="popular">{t('journal.sortPopular') || 'Most Read'}</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-text-dark absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Grid */}
                <StaggerContainer key={searchParams.toString()} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPosts.map((post) => (
                    <StaggerItem key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EACBD0]/30 group flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-[#9A3B50] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
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
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.read} {t('journal.minRead')}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link to="#" className="inline-flex items-center gap-2 text-sm font-bold text-[#9A3B50] hover:text-[#833244] transition-colors">
                            {t('journal.readMore')} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                          </Link>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-16 relative py-4">
                  {/* Decorative floras */}
                  <div className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 hidden sm:block">
                    <img 
                      src="/images/decorations/floral.png" 
                      alt="" 
                      className="w-16 opacity-70 ltr:scale-x-[-1]" 
                      style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                    />
                  </div>
                  <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 hidden sm:block">
                    <img 
                      src="/images/decorations/floral.png" 
                      alt="" 
                      className="w-16 opacity-70 rtl:scale-x-[-1]" 
                      style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
                    />
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-11 h-11 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#b08992] hover:text-[#9A3B50] transition-colors shadow-sm">
                      <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-11 h-11 rounded-full bg-[#9A3B50] text-white font-bold flex items-center justify-center shadow-md">1</button>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-11 h-11 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#4a1c24] hover:text-[#9A3B50] hover:border-[#9A3B50]/30 transition-colors shadow-sm font-bold">2</button>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-11 h-11 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#4a1c24] hover:text-[#9A3B50] hover:border-[#9A3B50]/30 transition-colors shadow-sm font-bold">3</button>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-11 h-11 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#b08992] hover:text-[#9A3B50] transition-colors shadow-sm">
                      <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:w-[30%] xl:w-[25%] space-y-8">
                
                {/* Search */}
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search blog posts..." className="w-full bg-white border border-[#EACBD0]/60 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-primary shadow-sm transition-colors text-sm" />
                  <Search className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-text-light" />
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EACBD0]/30">
                  <div className="flex items-center gap-2 mb-6">
                    <LeafIcon className="w-5 h-5 text-[#9A3B50]" />
                    <h3 className="font-serif font-bold text-xl text-text-dark">{t('journal.categoriesTitle')}</h3>
                  </div>
                  <div className="space-y-4">
                                        {categories.map((cat, idx) => (
                      <div key={cat.id} className="group">
                        <button onClick={() => setActiveCategory(cat.id)} className="w-full flex justify-between items-center text-sm">
                          <div className={`flex items-center gap-3 ${activeCategory === cat.id ? 'text-[#9A3B50] font-bold' : 'text-text-light group-hover:text-primary transition-colors'}`}>
                            <cat.icon className="w-4 h-4" strokeWidth={1.5} />
                            <span>{t(`journal.${cat.titleKey}`)}</span>
                          </div>
                          <span className={`text-xs ${activeCategory === cat.id ? 'text-[#9A3B50] font-bold' : 'text-text-light/60'}`}>({cat.count})</span>
                        </button>
                        {idx < categories.length - 1 && <div className="border-t border-[#EACBD0]/30 mt-4"></div>}
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Stay Inspired Newsletter */}
                <div className="bg-[#FCF8F9] rounded-2xl p-6 text-center border border-[#EACBD0]/40 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-40 mix-blend-multiply">
                    <img src="/images/decorations/floral.png" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" />
                  </div>
                  
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-4 relative z-10 border border-[#EACBD0]/30">
                    <Mail className="w-5 h-5 text-[#9A3B50]" />
                    <div className="absolute -top-1 -right-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A3B50" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                  </div>
                  
                  <h3 className="font-serif font-bold text-xl text-text-dark mb-2 relative z-10">{t('journal.stayInspired')}</h3>
                  <p className="text-xs text-text-light mb-6 relative z-10 leading-relaxed">{t('journal.stayInspiredDesc')}</p>
                  
                  <form className="relative z-10 space-y-3">
                    <input type="email" placeholder="Your email address" className="w-full bg-white border border-[#EACBD0]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-center" />
                    <button type="button" className="w-full bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm">
                      <Heart className="w-3.5 h-3.5" />
                      {t('journal.subscribe')}
                    </button>
                  </form>

                  <div className="mt-6 font-handwriting text-[#9A3B50] text-sm transform -rotate-2 relative z-10">
                    "Crochet is not just a craft...<br/>it's a way to spread happiness<br/>?"
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










