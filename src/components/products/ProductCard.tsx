import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
    category?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useStore(state => state.addToCart);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const isFavorite = useStore(state => state.isFavorite);
  const isLiked = isFavorite(product.id);
  
  // Calculate mock old price for visual matching
  const oldPrice = Math.floor(product.price * 1.15);

  return (
    <div className="group bg-[#fdfcfb] rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#e8dcd8] flex flex-col h-full overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-gray/20">
        {product.badge && (
          <span className="absolute top-2 start-2 sm:top-3 sm:start-3 z-10 bg-[#a0525f]/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            {product.badge}
          </span>
        )}
        <button onClick={(e) => { e.preventDefault(); toggleFavorite(product as any); }} className={`absolute top-2 end-2 sm:top-3 sm:end-3 z-10 p-1.5 sm:p-2 bg-white rounded-full ${isLiked ? 'text-[#e07584]' : 'text-[#4a1c24]/70 hover:text-[#e07584]'} shadow-sm transition-colors`}>
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
        </button>
        <img 
          src={product.image || '/images/products/placeholder.jpg'}
          onError={(e) => { e.currentTarget.src = '/images/products/placeholder.jpg' }}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-1 flex flex-col p-2.5 sm:p-4">
        {product.category && (
          <span className="text-[10px] sm:text-xs text-[#4a1c24]/60 mb-0.5 sm:mb-1 block text-start truncate">
            {product.category}
          </span>
        )}
        <Link to={`/products/${product.id}`} className="block mb-1.5 sm:mb-2 text-start">
          <h3 className="font-bold text-[#4a1c24] text-xs sm:text-base leading-tight hover:text-[#a0525f] transition-colors truncate">{product.name}</h3>
        </Link>
        
        <div className="flex items-center text-amber-500 mb-2 sm:mb-4 justify-start">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
          ))}
          <span className="text-[10px] sm:text-xs text-[#4a1c24]/50 ms-1 font-medium">({product.reviews})</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-4 justify-start flex-wrap">
          <span className="font-extrabold text-xs sm:text-base text-black">
            {t('productsPage.egp') || 'EGP'} {product.price.toFixed(0)}
          </span>
          <span className="text-[10px] sm:text-sm text-[#4a1c24]/40 line-through">
            {t('productsPage.egp') || 'EGP'} {oldPrice.toFixed(0)}
          </span>
        </div>
        
        <button onClick={(e) => { e.preventDefault(); addToCart(product as any, 1); setIsAdded(true); setTimeout(() => setIsAdded(false), 2000); }} className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#a0525f] text-white flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:bg-[#8b3d4b] transition-colors mt-auto whitespace-nowrap">
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
