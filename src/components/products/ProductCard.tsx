import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import ProductImage from '../ui/ProductImage';

export interface ProductCardData {
  id: string | number;
  name: string;
  price: number;
  compare_at_price?: number | null;
  discounted_price?: number;
  discount_percent?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  primary_image?: string | null;
  badge?: string;
  category?: string | any;
  slug?: string;
}

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useStore(state => state.addToCart);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const isLiked = useStore(state => state.favorites.some(p => String(p.id) === String(product.id)));
  
  // Format price and compare price
  const activePrice = product.discounted_price || product.price;
  const comparePrice = product.compare_at_price || (product.discount_percent ? Math.floor(product.price * 1.15) : null);

  const rawImage = product.primary_image || product.image;
  const categoryName = typeof product.category === 'object' && product.category !== null 
    ? product.category.name 
    : (product.category || '');

  const productTarget = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;
  const displayRating = product.rating ?? 5;
  const displayReviews = product.reviews ?? 0;

  return (
    <div className="group bg-[#fdfcfb] rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#e8dcd8] flex flex-col h-full overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-gray/20">
        {(product.badge || (product.discount_percent ? `${product.discount_percent}% OFF` : null)) && (
          <span className="absolute top-2 start-2 sm:top-3 sm:start-3 z-10 bg-[#a0525f]/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            {product.badge || `${product.discount_percent}% OFF`}
          </span>
        )}
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            toggleFavorite({
              id: product.id,
              name: product.name,
              price: activePrice,
              image: rawImage || '',
              category: categoryName,
              slug: product.slug
            }); 
          }} 
          className={`absolute top-2 end-2 sm:top-3 sm:end-3 z-10 p-1.5 sm:p-2 bg-white rounded-full ${isLiked ? 'text-[#e07584]' : 'text-[#4a1c24]/70 hover:text-[#e07584]'} shadow-sm transition-colors`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
        </button>
        <Link to={productTarget} className="block w-full h-full">
          <ProductImage 
            src={rawImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            label={categoryName || product.name}
          />
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col p-2.5 sm:p-4">
        {categoryName && (
          <span className="text-[10px] sm:text-xs text-[#4a1c24]/60 mb-0.5 sm:mb-1 block text-start truncate">
            {categoryName}
          </span>
        )}
        <Link to={productTarget} className="block mb-1.5 sm:mb-2 text-start">
          <h3 className="font-bold text-[#4a1c24] text-xs sm:text-base leading-tight hover:text-[#a0525f] transition-colors truncate">{product.name}</h3>
        </Link>
        
        <div className="flex items-center text-amber-500 mb-2 sm:mb-4 justify-start">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${i < Math.floor(displayRating) ? 'fill-current' : 'text-gray-300'}`} />
          ))}
          {displayReviews > 0 && (
            <span className="text-[10px] sm:text-xs text-[#4a1c24]/50 ms-1 font-medium">({displayReviews})</span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-4 justify-start flex-wrap">
          <span className="font-extrabold text-xs sm:text-base text-black">
            {t('productsPage.egp') || 'EGP'} {Number(activePrice).toFixed(0)}
          </span>
          {comparePrice && comparePrice > activePrice && (
            <span className="text-[10px] sm:text-sm text-[#4a1c24]/40 line-through">
              {t('productsPage.egp') || 'EGP'} {Number(comparePrice).toFixed(0)}
            </span>
          )}
        </div>
        
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            addToCart({
              id: product.id,
              name: product.name,
              price: activePrice,
              image: rawImage || '',
              category: categoryName,
              slug: product.slug
            }, 1); 
            setIsAdded(true); 
            setTimeout(() => setIsAdded(false), 2000); 
          }} 
          className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#a0525f] text-white flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:bg-[#8b3d4b] transition-colors mt-auto whitespace-nowrap cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="truncate">{isAdded ? (t('productsPage.addedToCart') || 'Added') : (t('productsPage.addToCart') || 'Add to Cart')}</span>
        </button>
      </div>
    </div>
  );
}
