import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/products/ProductCard';
import { useMockData } from '../../data/mockData';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { StaggerContainer, StaggerItem } from '../../components/ui/Stagger';
import { useStore } from '../../store/useStore';

export default function Favorites() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // @ts-ignore
const isRTL = i18n.dir() === 'rtl';
  
  // Just use a few products as mock favorites
  const { favorites, toggleFavorite, addToCart } = useStore();
  const favoriteProducts = favorites;

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="relative min-h-[300px] md:min-h-[350px] flex items-center overflow-hidden bg-[#fffaf8]">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/backgrounds/products-hero.png" 
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
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product, idx) => (
                <StaggerItem key={product.id + idx}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8dcd8] flex flex-col h-full">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                    <h3 className="font-bold text-[#4a1c24] text-lg mb-2">{product.name}</h3>
                    <p className="text-[#a0525f] font-bold mb-4">EGP {product.price}</p>
                    <div className="mt-auto flex gap-2">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-[#a0525f] text-white py-2 rounded-xl font-bold hover:bg-[#8e4551] transition-colors text-sm"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => toggleFavorite(product)}
                        className="px-3 border border-[#e8dcd8] text-[#4a1c24] py-2 rounded-xl font-bold hover:bg-[#fcf8f9] transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
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
