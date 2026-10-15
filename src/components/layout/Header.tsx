import { Link, useLocation, useNavigate } from 'react-router';
import { Search, User, Heart, ShoppingCart, Globe, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import SidebarCart from './SidebarCart';
import MobileNavDrawer from './MobileNavDrawer';
import { useStore } from '../../store/useStore';
import { settingsService } from '../../api/services';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const navigationLinks = [
    { id: 'home', label: t('nav.home', 'Home'), path: '/' },
    { id: 'store', label: t('nav.store', 'Store'), path: '/products' },
    { id: 'collections', label: t('nav.collections', 'Collections'), path: '/collections' },
    { id: 'journal', label: t('nav.journal', 'Journal'), path: '/journal' },
    { id: 'about', label: t('nav.story', 'About'), path: '/about' },
    { id: 'contact', label: t('nav.contact', 'Contact'), path: '/contact' },
  ];
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cart = useStore(state => state.cart);
  const user = useStore(state => state.user);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const logout = useStore(state => state.logout);
  const settings = useStore(state => state.settings);
  const setSettings = useStore(state => state.setSettings);
  const checkAuth = useStore(state => state.checkAuth);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = useStore(state => state.favorites.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    // Check auth on boot if token exists
    checkAuth().catch(() => {});

    // Fetch site settings if not present
    if (!settings) {
      settingsService.getSettings()
        .then(data => setSettings(data))
        .catch(() => {});
    }

    // Preload shipping governorates from API
    useStore.getState().fetchGovernorates().catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHome ? window.innerHeight * 11.5 : 50;
      setIsScrolled(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const isRTL = i18n.language === 'ar';
  const isTransparent = isHome && !isScrolled;

  return (
    <>
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 py-4 ${
      isTransparent 
        ? 'bg-transparent border-transparent' 
        : 'bg-white/95 backdrop-blur-md border-b border-[#f5ebeb]/60 shadow-sm'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center justify-center relative shrink-0">
            <span className={`text-4xl md:text-5xl font-bold tracking-tight font-serif notranslate transition-colors ${
              isTransparent ? 'text-white drop-shadow-md' : 'text-[#3a1c22]'
            }`}>
              {settings?.site_name || 'Sect'}
            </span>
            <span className={`text-[9px] uppercase tracking-[0.15em] font-bold mt-0 notranslate transition-colors ${
              isTransparent ? 'text-white/80 drop-shadow-sm' : 'text-[#d96677]'
            }`}>
              {settings?.tagline || t('header.subtitle')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`text-[15px] font-bold transition-colors relative pb-1 ${
                    isActive 
                      ? (isTransparent ? 'text-white' : 'text-[#d96677]') 
                      : (isTransparent ? 'text-white/70 hover:text-white' : 'text-[#3a1c22]/80 hover:text-[#d96677]')
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className={`absolute bottom-0 w-full h-[2.5px] rounded-full ${
                      isTransparent ? 'bg-white' : 'bg-[#d96677]'
                    } ${isRTL ? 'right-0' : 'left-0'}`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            
            {/* Search Bar */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }} className={`hidden lg:flex relative ${isRTL ? 'mr-4' : 'ml-4'}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
                className={`w-64 py-2.5 rounded-full text-sm font-medium focus:outline-none focus:ring-1 border border-transparent transition-all ${
                  isTransparent 
                    ? 'bg-white/10 text-white placeholder:text-white/60 focus:ring-white/50 border-white/20' 
                    : 'bg-[#f8f8f8] text-[#3a1c22] placeholder:text-[#3a1c22]/40 focus:ring-[#d96677]'
                } ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
              />
              <button type="submit" className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isTransparent ? 'text-white/60 hover:text-white' : 'text-[#3a1c22]/40 hover:text-[#d96677]'
              } ${isRTL ? 'right-4' : 'left-4'}`}>
                <Search className="w-full h-full" />
              </button>
            </form>

            {/* User Account / Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors ${
                      isTransparent ? 'text-white hover:text-white/80' : 'text-[#3a1c22] hover:text-[#d96677]'
                    }`}
                    aria-label="User Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#d96677]/20 border border-[#d96677]/40 flex items-center justify-center text-xs font-bold text-[#d96677]">
                      {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {isUserMenuOpen && (
                    <div className={`absolute top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#f5ebeb] py-2 z-50 text-start ${
                      isRTL ? 'left-0' : 'right-0'
                    }`}>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2.5 border-b border-[#f5ebeb]/80 hover:bg-[#fcf5f6] transition-colors group"
                      >
                        <p className="text-xs text-[#3a1c22]/60">{isRTL ? 'مرحباً' : 'Welcome,'}</p>
                        <p className="text-sm font-bold text-[#3a1c22] truncate group-hover:text-[#d96677] transition-colors">{user.name}</p>
                        <p className="text-[11px] text-[#3a1c22]/50 truncate">{user.email}</p>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#3a1c22] hover:bg-[#fcf5f6] hover:text-[#d96677] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#d96677]" />
                        <span>{isRTL ? 'الملف الشخصي' : 'My Profile'}</span>
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#3a1c22] hover:bg-[#fcf5f6] hover:text-[#d96677] transition-colors"
                      >
                        <Heart className="w-4 h-4 text-[#d96677]" />
                        <span>{isRTL ? 'المفضلة' : 'Wishlist'}</span>
                      </Link>
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`p-1.5 transition-colors ${
                    isTransparent ? 'text-white hover:text-white/80' : 'text-[#3a1c22] hover:text-[#d96677]'
                  }`}
                  aria-label="Login"
                >
                  <User className="w-[22px] h-[22px] stroke-[1.5]" />
                </Link>
              )}
            </div>
            
            <Link to="/favorites" className={`p-1.5 transition-colors relative ${isTransparent ? 'text-white hover:text-white/80' : 'text-[#3a1c22] hover:text-[#d96677]'}`} aria-label="Favorites">
              <Heart className="w-[22px] h-[22px] stroke-[1.5]" />
              {favoritesCount > 0 && (
                <span className={`absolute top-0 w-[18px] h-[18px] text-[10px] font-bold flex items-center justify-center rounded-full ${
                  isTransparent ? 'bg-white text-black' : 'bg-[#d96677] text-white'
                } ${isRTL ? 'right-0' : 'left-0'}`}>
                  {favoritesCount}
                </span>
              )}
            </Link>
            
            <button onClick={() => setIsCartOpen(true)} className={`p-1.5 transition-colors relative ${isTransparent ? 'text-white hover:text-white/80' : 'text-[#3a1c22] hover:text-[#d96677]'}`}>
              <ShoppingCart className="w-[22px] h-[22px] stroke-[1.5]" />
              {cartCount > 0 && (
                <span className={`absolute top-0 w-[18px] h-[18px] text-[10px] font-bold flex items-center justify-center rounded-full ${
                  isTransparent ? 'bg-white text-black' : 'bg-[#d96677] text-white'
                } ${isRTL ? 'right-0' : 'left-0'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Language Switch Button */}
            <div className={`w-px h-5 mx-1 hidden sm:block ${isTransparent ? 'bg-white/20' : 'bg-[#3a1c22]/10'}`}></div>
            <button 
              onClick={toggleLanguage}
              className={`hidden sm:flex items-center gap-1.5 p-1.5 transition-colors font-medium text-sm cursor-pointer notranslate ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-[#3a1c22]/80 hover:text-[#d96677]'
              }`}
            >
              <Globe className="w-5 h-5 stroke-[1.5]" />
              <span className="mt-1 font-sans">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Mobile Menu Bars Button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className={`flex lg:hidden p-1.5 transition-colors cursor-pointer ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-[#3a1c22] hover:text-[#d96677]'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>

          </div>
        </div>
      </div>
    </header>
    <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    <MobileNavDrawer 
      isOpen={isMobileNavOpen} 
      onClose={() => setIsMobileNavOpen(false)} 
      onOpenCart={() => setIsCartOpen(true)} 
    />
    </>
  );
}
