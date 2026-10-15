import Layout from '../../components/layout/Layout';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import ProductImage from '../../components/ui/ProductImage';

export default function Favorites() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // @ts-ignore
  const isRTL = i18n.dir() === 'rtl';
  
  const favoriteProducts = useStore(state => state.favorites);
  const removeFromFavorites = useStore(state => state.removeFromFavorites);
  const addToCart = useStore(state => state.addToCart);

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="relative min-h-[300px] md:min-h-[350px] flex items-center overflow-hidden bg-[#fffaf8]">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/backgrounds/products-hero.webp" 
            alt="Favorites Background"
            className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </div>

        {/* Content */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t('favoritesPage.subtitle') || 'Your Loved Items'}
              </span>
              <h1 className="text-4xl md:text-5xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-3 drop-shadow-sm whitespace-pre-line flex items-center gap-4">
                <Heart className="w-10 h-10 md:w-12 md:h-12 text-[#a0525f] fill-[#a0525f]/20" />
                {t('favoritesPage.title') || 'Favorites'}
              </h1>
              <p className="text-[#4a1c24]/80 text-[15px] leading-relaxed max-w-md font-medium mb-8 mt-4">
                {t('favoritesPage.desc') || 'Discover your personal collection of pieces made with love and care. Here you will find everything that caught your eye.'}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              More than just <br/>
                <span className="text-2xl">♡</span> Handmade..
            </div>
        </div>
          
        <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-[#fff9f6]">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
            <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
          </svg>
        </div>
      </div>

      <div className="bg-[#fff9f6] min-h-[500px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
          
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {favoriteProducts.map((product) => (
                  <motion.div 
                    key={String(product.id)}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8dcd8] flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-50 relative group">
                        <Link to={product.slug ? `/products/${product.slug}` : `/products/${product.id}`} className="block w-full h-full">
                          <ProductImage 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                            label={product.name}
                          />
                        </Link>
                      </div>
                      <Link to={product.slug ? `/products/${product.slug}` : `/products/${product.id}`}>
                        <h3 className="font-bold text-[#4a1c24] text-lg mb-2 hover:text-[#a0525f] transition-colors truncate">{product.name}</h3>
                      </Link>
                      <p className="text-[#a0525f] font-bold mb-4">{t('common.egp', 'EGP')} {product.price}</p>
                      <div className="mt-auto flex gap-2">
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-[#a0525f] text-white py-2 rounded-xl font-bold hover:bg-[#8e4551] transition-colors text-sm cursor-pointer shadow-sm"
                        >
                          {t('productsPage.addToCart', isRTL ? 'أضف للسلة' : 'Add to Cart')}
                        </button>
                        <button 
                          onClick={() => removeFromFavorites(product.id)}
                          className="px-3 border border-[#e8dcd8] text-[#4a1c24] py-2 rounded-xl font-bold hover:bg-[#fcf8f9] hover:border-[#a0525f]/40 hover:text-[#a0525f] transition-colors text-sm cursor-pointer"
                        >
                          {t('common.remove', isRTL ? 'إزالة' : 'Remove')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="w-24 h-24 text-[#e8dcd8] mb-6 stroke-[1]" />
              <h2 className="text-2xl font-bold text-[#4a1c24] mb-3">{t('favoritesPage.empty') || 'No items in your favorites yet.'}</h2>
              <button onClick={() => navigate('/products')} className="mt-4 px-8 py-3 bg-[#a0525f] text-white rounded-full font-bold hover:bg-[#8e4551] transition-colors shadow-md">
                {t('favoritesPage.explore') || 'Explore Products'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
