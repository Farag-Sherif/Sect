import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { X, Search, Heart, ShoppingCart, User, Globe, ChevronRight, Home, Store, Layers, BookOpen, Info, Phone } from 'lucide-react';
import { useMockData } from '../../data/mockData';
import { useStore } from '../../store/useStore';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose, onOpenCart }: MobileNavDrawerProps) {
  const { t, i18n } = useTranslation();
  const { navigationLinks } = useMockData();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useStore(state => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const getLinkIcon = (id: string) => {
    const iconClass = "w-4 h-4";
    switch (id) {
      case 'home': return <Home className={iconClass} />;
      case 'store': return <Store className={iconClass} />;
      case 'collections': return <Layers className={iconClass} />;
      case 'journal': return <BookOpen className={iconClass} />;
      case 'about': return <Info className={iconClass} />;
      case 'contact': return <Phone className={iconClass} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 z-[100] backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-[85%] max-w-[340px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-${isRTL ? 'right' : 'left'} duration-300 font-sans`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#f5ebeb] flex items-center justify-between bg-[#fffaf8]">
          <Link to="/" onClick={onClose} className="flex flex-col">
            <span className="text-3xl font-bold font-serif text-[#3a1c22]">Sect</span>
            <span className="text-[8px] uppercase tracking-[0.18em] font-bold text-[#d96677] -mt-0.5">
              {t('header.subtitle') || 'HANDMADE WITH LOVE'}
            </span>
          </Link>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#f5ebeb] flex items-center justify-center text-[#3a1c22] hover:bg-[#fdf5f6] hover:text-[#d96677] transition-colors shadow-sm"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#f5ebeb]/60">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('header.searchPlaceholder') || 'Search products...'}
              className="w-full py-2.5 px-10 rounded-full text-sm bg-[#f8f8f8] text-[#3a1c22] placeholder:text-[#3a1c22]/40 border border-transparent focus:border-[#d96677] focus:bg-white focus:outline-none transition-all"
            />
            <Search className={`w-4 h-4 text-[#3a1c22]/40 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3a1c22]/40">
            {isRTL ? 'القائمة الرئيسية' : 'Main Menu'}
          </div>
          {navigationLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.id}
                to={link.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-bold transition-all ${
                  isActive 
                    ? 'bg-[#fdf5f6] text-[#d96677] shadow-xs' 
                    : 'text-[#3a1c22] hover:bg-[#fbf7f6] hover:text-[#d96677]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#d96677]' : 'text-[#3a1c22]/60'}`}>
                    {getLinkIcon(link.id)}
                  </span>
                  <span>{link.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-40 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            );
          })}

          <div className="pt-4 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-[#3a1c22]/40 border-t border-[#f5ebeb] mt-3">
            {isRTL ? 'روابط سريعة' : 'Quick Actions'}
          </div>

          <Link
            to="/favorites"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#3a1c22] hover:bg-[#fbf7f6] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-[#d96677]" />
              <span>{isRTL ? 'المفضلة' : 'Favorites'}</span>
            </div>
          </Link>

          <button
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#3a1c22] hover:bg-[#fbf7f6] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 text-[#d96677]" />
              <span>{isRTL ? 'سلة المشتريات' : 'My Cart'}</span>
            </div>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-[#d96677] text-white rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#3a1c22] hover:bg-[#fbf7f6] transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#d96677]" />
              <span>{isRTL ? 'تسجيل الدخول / حسابي' : 'Login / My Account'}</span>
            </div>
          </Link>
        </div>

        {/* Footer Language Toggle */}
        <div className="p-4 border-t border-[#f5ebeb] bg-[#fffaf8]">
          <button
            onClick={toggleLanguage}
            className="w-full py-2.5 px-4 rounded-xl border border-[#e8dcd8] bg-white flex items-center justify-between text-sm font-bold text-[#3a1c22] hover:border-[#d96677] transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d96677]" />
              <span>{isRTL ? 'اللغة الحالية: العربية' : 'Current Language: English'}</span>
            </div>
            <span className="text-xs px-2 py-0.5 bg-[#fdf5f6] text-[#d96677] rounded-md font-extrabold uppercase">
              {i18n.language === 'ar' ? 'English' : 'عربي'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
