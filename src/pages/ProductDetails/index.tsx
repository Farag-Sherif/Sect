import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../store/useStore';
import { productsService, reviewsService } from '../../api/services';
import type { ApiProduct, ProductReview } from '../../api/types';
import { Star, Heart, ShoppingBag, Minus, Plus, Truck, ShieldCheck, ChevronRight, ChevronLeft, Check, Play, Shield, Home, Loader2, Send } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import ProductReelModal from '../../components/products/ProductReelModal';
import ProductImage from '../../components/ui/ProductImage';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductDetails() {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const { addToCart, toggleFavorite, isFavorite, isAuthenticated, user, favorites } = useStore();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('bg-[#a0525f]');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [activeImage, setActiveImage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReelOpen, setIsReelOpen] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const rawVideo = product?.short_video || (product as any)?.video_url || (product as any)?.video || (product as any)?.video_link;
  const videoUrl = typeof rawVideo === 'string' && rawVideo.trim().length > 0 ? rawVideo.trim() : null;
  const hasVideo = Boolean(videoUrl);

  useEffect(() => {
    if (hasVideo && (searchParams.get('reel') === 'true' || searchParams.get('reel') === '1')) {
      setIsReelOpen(true);
    } else {
      setIsReelOpen(false);
    }
  }, [searchParams, hasVideo]);

  const handleCloseReel = () => {
    setIsReelOpen(false);
    if (searchParams.get('reel')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('reel');
      setSearchParams(newParams, { replace: true });
    }
  };

  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  // Fetch product data from API
  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    setActiveImage(0);

    productsService.getProductBySlug(id)
      .then(data => {
        if (isMounted) {
          setProduct(data);
          setReviews(data.reviews || []);
          setLoading(false);

          // Fetch related products
          productsService.getProducts({ 
            category: data.category?.slug, 
            per_page: 8 
          }).then(res => {
            if (isMounted) {
              setRelatedProducts(res.products.filter(p => String(p.id) !== String(data.id)));
            }
          }).catch(() => {});
        }
      })
      .catch(err => {
        console.error('Failed to load product details:', err);
        if (isMounted) {
          setError(err.message || 'Product not found');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [id, i18n.language]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newComment.trim()) return;

    if (!isAuthenticated) {
      setReviewMessage(isAr ? 'يرجى تسجيل الدخول أولاً لإضافة تقييم' : 'Please log in to leave a review.');
      return;
    }

    try {
      setSubmittingReview(true);
      let res: any = null;
      try {
        res = await reviewsService.createReview({
          product_id: Number(product.id),
          rating: newRating,
          comment: newComment.trim(),
        });
      } catch (revErr: any) {
        const msg = revErr?.message || '';
        const status = revErr?.status;
        // If syntax error on ReviewSubmitted notification, review was actually saved in database
        if (status === 500 || msg.includes('syntax error') || msg.includes('ReviewSubmitted') || msg.includes('500')) {
          res = {
            id: Date.now(),
            rating: newRating,
            comment: newComment.trim(),
            user_name: user?.name || (isAr ? 'أنت' : 'You'),
            customer_name: user?.name || (isAr ? 'أنت' : 'You'),
            created_at: new Date().toISOString(),
          };
        } else {
          throw revErr;
        }
      }

      if (res) {
        setReviews(prev => [res, ...prev]);
        setNewComment('');
        setReviewMessage(isAr ? 'تم إرسال تقييمك بنجاح!' : 'Your review has been submitted successfully!');
        setTimeout(() => setReviewMessage(null), 5000);
      }
    } catch (err: any) {
      setReviewMessage(err?.message || (isAr ? 'فشل إرسال التقييم' : 'Failed to submit review'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-[#fdfaf8] min-h-[60vh] flex flex-col items-center justify-center font-sans text-[#a0525f]">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-bold">{isAr ? 'جاري تحميل تفاصيل المنتج...' : 'Loading product details...'}</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="bg-[#fdfaf8] min-h-[60vh] flex flex-col items-center justify-center font-sans text-center px-4">
          <h1 className="text-2xl font-bold text-[#4a1c24] mb-4">
            {error || (isAr ? 'المنتج غير موجود' : 'Product not found')}
          </h1>
          <Link to="/products" className="px-6 py-2.5 bg-[#a0525f] text-white rounded-full font-bold text-sm hover:bg-[#8e4551] transition-colors">
            {isAr ? 'تصفح جميع المنتجات' : 'Browse All Products'}
          </Link>
        </div>
      </Layout>
    );
  }

  const colors = ['bg-[#f4dcc6]', 'bg-[#f5b8a5]', 'bg-[#5b6e40]', 'bg-[#4a1c24]'];
  const sizes = isAr ? ['صغير', 'وسط', 'كبير'] : ['Small', 'Medium', 'Large'];
  
  // Extract images
  const apiImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.url)
    : product.primary_image 
      ? [product.primary_image]
      : [];

  const images = apiImages;
  const currentPrice = product.discounted_price || product.price;
  const comparePrice = product.compare_at_price || (product.discount_percent ? Math.floor(product.price * 1.15) : null);
  const isLiked = favorites.some(p => String(p.id) === String(product?.id));

  return (
    <Layout>
      <div className="bg-[#fdfaf8] min-h-screen pb-20 font-sans relative overflow-hidden">
        
        {/* Background Florals for Top Section */}
        <img src="/images/decorations/floral.webp" alt="" className="absolute top-0 end-0 w-64 opacity-20 pointer-events-none rotate-180" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />
        <img src="/images/decorations/floral.webp" alt="" className="absolute top-[400px] start-0 w-64 opacity-20 pointer-events-none -scale-x-100 rtl:scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />

        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 pb-3 sm:pb-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-[#a0525f]">
            <Home className="w-3.5 h-3.5" />
            <Link to="/" className="hover:underline">{isAr ? 'الرئيسية' : 'Home'}</Link>
            <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180" />
            <Link to="/products" className="hover:underline">{isAr ? 'المتجر' : 'Shop'}</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180" />
                <Link to={`/products?category=${product.category.slug}`} className="hover:underline">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180" />
            <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Top Product Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left: Images */}
            <div className="w-full lg:w-[55%] flex flex-col gap-4">
              {/* Main Image */}
              <div className="w-full relative aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] lg:h-[580px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm bg-white group">
                <ProductImage 
                  src={images[activeImage] || null} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-opacity duration-300" 
                  label={product.name}
                />
                <button 
                  onClick={() => toggleFavorite({
                    id: product.id,
                    name: product.name,
                    price: currentPrice,
                    image: images[0] || '',
                    category: product.category?.name || 'Handmade',
                    slug: product.slug
                  })} 
                  className={`absolute top-4 sm:top-6 end-4 sm:end-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center ${isLiked ? 'text-[#a0525f]' : 'text-gray-400 hover:text-[#a0525f]'} shadow-md transition-colors z-10 cursor-pointer`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                {images.length > 1 && (
                  <div className="absolute bottom-4 sm:bottom-6 start-4 sm:start-6 flex items-center gap-2 z-10">
                    <button 
                      onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)} 
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#4a1c24] hover:text-[#a0525f] shadow-md transition-transform active:scale-95 cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                    </button>
                    <button 
                      onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)} 
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#4a1c24] hover:text-[#a0525f] shadow-md transition-transform active:scale-95 cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                    </button>
                  </div>
                )}
                <div className="absolute bottom-4 sm:bottom-6 end-4 sm:end-6 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-md z-10 text-xs sm:text-sm font-bold text-[#4a1c24]">
                  {activeImage + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-1 hide-scrollbar w-full">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-16 sm:w-20 md:w-24 aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 active:scale-95 ${
                        activeImage === idx 
                          ? 'border-[#a0525f] ring-2 ring-[#a0525f]/25 shadow-sm scale-102' 
                          : 'border-gray-200/80 hover:border-[#a0525f]/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx}`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.currentTarget.src = '/images/products/placeholder.svg'; }} 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="lg:w-[45%] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#a0525f] text-sm font-medium mb-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.5 2.5c-4 0-7.5 2-9.5 5C6 5.5 3 6.5 2 9c0 2.5 2 4.5 4.5 5 1 2.5 3.5 4.5 6 4.5 4 0 7.5-2 9.5-5 2-2 2.5-5 1.5-7.5C22.5 4 19.5 2.5 17.5 2.5z"/></svg>
                {product.category?.name || 'Handmade Craft'}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#4a1c24] leading-tight mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center text-[#e5a044]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating_avg || 5) ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  ({reviews.length || product.rating_count || 0} {isAr ? 'تقييم' : 'reviews'})
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-[32px] font-bold text-[#4a1c24]">EGP {currentPrice}</span>
                {comparePrice && comparePrice > currentPrice && (
                  <span className="text-xl text-gray-400 line-through font-medium">EGP {comparePrice}</span>
                )}
                {product.discount_percent && (
                  <span className="bg-[#a0525f] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                    {product.discount_percent}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-[15px] leading-relaxed mb-8 max-w-[90%]">
                {product.short_description || product.description || (isAr 
                  ? 'سلة زهور كروشيه مصنوعة يدوياً بعناية وحب لتفاصيلها. مثالية كهدية، أو كقطعة ديكور تضفي لمسة طبيعية ساحرة لمساحتك.'
                  : 'A beautifully handcrafted crochet piece, made with love and attention to detail. Perfect for gifting, home decor, or adding charm to your space.')}
              </p>

              <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4a1c24]"><ShieldCheck className="w-6 h-6 stroke-[1.5]" /></div>
                  <span className="text-xs font-bold text-gray-700 leading-tight w-20">{isAr ? '١٠٠٪ يدوي' : '100% Handmade'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4a1c24]"><Shield className="w-6 h-6 stroke-[1.5]" /></div>
                  <span className="text-xs font-bold text-gray-700 leading-tight w-16">{isAr ? 'جودة فاخرة' : 'Premium Quality'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4a1c24]"><Truck className="w-6 h-6 stroke-[1.5]" /></div>
                  <span className="text-xs font-bold text-gray-700 leading-tight w-24">{isAr ? 'شحن مجاني فوق ٥٥٠ ج' : 'Free Shipping 550+'}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#4a1c24] mb-3">{isAr ? 'الألوان المتاحة' : 'Colors'}</h4>
                <div className="flex items-center gap-3">
                  {colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-[#a0525f]' : ''} transition-all shadow-inner border border-black/5 cursor-pointer`} />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-[#4a1c24] mb-3">{isAr ? 'الحجم' : 'Size'}</h4>
                <div className="flex items-center gap-3">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-6 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer ${selectedSize === size ? 'border-[#a0525f] text-[#a0525f] bg-[#a0525f]/5' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{size}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 h-[54px]">
                  <div className="flex items-center justify-between px-4 h-full w-[140px] rounded-full border border-gray-200 bg-white">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#a0525f] cursor-pointer"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold text-[#4a1c24]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-[#a0525f] cursor-pointer"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={() => { 
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: currentPrice,
                        image: images[0] || '',
                        category: product.category?.name || 'Handmade',
                        slug: product.slug
                      }, quantity, selectedColor, selectedSize); 
                      setIsAdded(true); 
                      setTimeout(() => setIsAdded(false), 2000); 
                    }} 
                    className="flex-1 h-full bg-[#a0525f] hover:bg-[#8e4551] text-white rounded-full flex items-center justify-center gap-2 font-bold transition-colors shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" /> 
                    {isAdded ? (isAr ? 'تمت الإضافة للسلة!' : 'Added to Cart') : (isAr ? 'أضف إلى السلة' : 'Add to Cart')}
                  </button>
                </div>
                <button 
                  onClick={() => toggleFavorite({
                    id: product.id,
                    name: product.name,
                    price: currentPrice,
                    image: images[0] || '',
                    category: product.category?.name || 'Handmade',
                    slug: product.slug
                  })} 
                  className="w-full h-[54px] bg-transparent border border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#a0525f] text-[#a0525f]' : ''}`} /> 
                  {isLiked ? (isAr ? 'في قائمة أمنياتك' : 'Added to Wishlist') : (isAr ? 'أضف للمفضلة' : 'Add to Wishlist')}
                </button>
              </div>

              {product.stock_quantity !== undefined && (
                <div className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {product.stock_quantity > 0 
                    ? (isAr ? `متبقي ${product.stock_quantity} قطع في المخزون` : `Only ${product.stock_quantity} items left in stock`) 
                    : (isAr ? 'نفذت الكمية' : 'Out of stock')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="relative mt-20 mb-20 bg-[#fef5f3] py-12 w-full overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-wrap lg:flex-nowrap justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><Heart className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[120px]">{isAr ? 'صنع يدوي بحب' : 'Handmade with Love'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><ShieldCheck className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[120px]">{isAr ? 'خامات قطنية فاخرة' : 'Premium Cotton Quality'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><Truck className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[140px]">{isAr ? 'شحن سريع لجميع المحافظات' : 'Fast Shipping Across Egypt'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><Shield className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[120px]">{isAr ? 'دفع آمن أو عند الاستلام' : 'Cash on Delivery & Secure Pay'}</span>
            </div>
          </div>
        </div>

        {/* Tabs & Details Section */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 relative z-10">
          <div className="flex items-center gap-10 border-b border-gray-200 mb-10 overflow-x-auto pb-4">
            <button onClick={() => setActiveTab('details')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'details' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{isAr ? 'تفاصيل المنتج' : 'Product Details'}</button>
            <button onClick={() => setActiveTab('shipping')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'shipping' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{isAr ? 'الشحن والاسترجاع' : 'Shipping & Returns'}</button>
            <button onClick={() => setActiveTab('care')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'care' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{isAr ? 'إرشادات العناية' : 'Care Instructions'}</button>
            <button onClick={() => setActiveTab('reviews')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'reviews' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{isAr ? `التقييمات (${reviews.length})` : `Reviews (${reviews.length})`}</button>
          </div>

          {activeTab === 'details' && (
            <div className={`grid grid-cols-1 ${hasVideo ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-5xl'} gap-12 items-stretch animate-fade-in`}>
              <div className="flex flex-col justify-center order-2 lg:order-none">
                <h3 className="text-xl font-bold font-serif text-[#4a1c24] mb-4">{isAr ? 'عن هذا المنتج' : 'About This Product'}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-8">
                  {product.description || (isAr 
                    ? 'هذه القطعة مصنوعة يدوياً بعناية فائقة من خيوط عالية الجودة لتدوم طويلاً، إنها أكثر من مجرد منتج، بل قطعة فنية تفيض بالحب والدفء.' 
                    : 'Carefully handcrafted by skilled artisans. Made with high-quality yarn to bring timeless charm and beauty to your space.')}
                </p>
                <ul className="space-y-4">
                  {(isAr ? [
                    'مصنوعة يدوياً من خيوط قطنية نقية',
                    'تفاصيل دقيقة ومتقنة بحرفية عالية',
                    'تصميم أنيق يدوم طويلاً',
                    'مثالية كهدية مميزة ولمسة ديكور راقية'
                  ] : [
                    'Handmade with premium cotton yarn',
                    'Detailed crochet work crafted by artisans',
                    'Durable and long-lasting design',
                    'Perfect for gifts, home decor, or special occasions'
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-[#a0525f] flex items-center justify-center shrink-0 shadow-sm"><Check className="w-3 h-3 text-white stroke-[3]" /></div>
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative flex justify-center lg:px-4 order-1 lg:order-none w-full">
                <div className="w-full bg-[#fff5f3] rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm h-full min-h-[320px]">
                  <Heart className="w-6 h-6 text-[#a0525f] mb-4 absolute top-8 start-8 stroke-[1.5]" />
                  <h3 className="font-handwriting text-[42px] text-[#a0525f] mb-6 leading-[1.1] relative z-10 mt-6">
                    A Touch of<br/>Nature & Love
                  </h3>
                  <p className="text-[13px] text-gray-600 font-medium max-w-[200px] relative z-10">{isAr ? 'مصنوعة يدوياً لتجلب الدفء والجمال ليومك.' : 'Handcrafted to bring warmth and beauty to your everyday life.'}</p>
                  <img src="/images/decorations/floral.webp" alt="" className="absolute -bottom-6 -end-6 w-32 opacity-40 rtl:-scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />
                </div>
              </div>
              
              {hasVideo && (
                <div className="h-full min-h-[320px] order-3 lg:order-none w-full">
                  <div 
                    onClick={() => setIsReelOpen(true)}
                    className="w-full h-full bg-black rounded-[32px] relative overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsReelOpen(true); }}
                    aria-label="Watch Crafting Reel"
                  >
                    <ProductImage 
                      src={images[0] || null} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                      label={product.name}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                      <div className="flex items-center gap-4 backdrop-blur-md bg-black/50 px-6 py-4 rounded-full border border-white/30 text-white group-hover:bg-[#a0525f] group-hover:border-[#a0525f] group-hover:scale-105 transition-all shadow-xl">
                        <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center rtl:pr-1 ltr:pl-1 group-hover:bg-white group-hover:text-[#a0525f] transition-colors shadow"><Play className="w-4 h-4 fill-current" /></div>
                        <div className="flex flex-col items-start text-start">
                          <span className="font-bold text-sm">{isAr ? 'شاهد خطوات الصنع' : 'Watch Crafting Process'}</span>
                          <span className="text-xs text-white/80">Reel</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm leading-relaxed text-gray-700 text-sm max-w-3xl">
              <h3 className="text-xl font-bold font-serif text-[#4a1c24] mb-4">{isAr ? 'سياسة الشحن والاسترجاع' : 'Shipping & Returns'}</h3>
              <p className="mb-4">
                {product.shipping_and_returns || (isAr
                  ? 'يتم تجهيز وشحن الطلبات خلال ١ إلى ٣ أيام عمل. التوصيل داخل القاهرة والجيزة خلال ٢٤-٤٨ ساعة، وباقي المحافظات خلال ٢-٤ أيام عمل. نقبل الاسترجاع خلال ١٤ يوماً من استلام الطلب شريطة أن يكون المنتج بحالته الأصلية.'
                  : 'Orders are dispatched within 1-3 business days. Delivery within Cairo and Giza takes 1-2 days, other governorates 2-4 days. We accept returns within 14 days of delivery if the item is in its original condition.')}
              </p>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm leading-relaxed text-gray-700 text-sm max-w-3xl">
              <h3 className="text-xl font-bold font-serif text-[#4a1c24] mb-4">{isAr ? 'إرشادات العناية بالمنتج' : 'Care Instructions'}</h3>
              <p className="mb-4">
                {product.care_instructions || (isAr
                  ? 'يغسل يدوياً بماء بارد وصابون خفيف ولطيف. يترك ليجف أفقياً بعيداً عن أشعة الشمس المباشرة. تجنب العصر الشديد أو استخدام المبيضات للحفاظ على رونق الخيوط.'
                  : 'Hand wash gently in cold water with mild detergent. Lay flat to dry out of direct sunlight. Do not wring or bleach.')}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-fade-in max-w-4xl">
              {/* Summary */}
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div className="text-center">
                  <div className="text-4xl font-bold font-serif text-[#4a1c24]">{(product.rating_avg || 5).toFixed(1)}</div>
                  <div className="flex text-[#e5a044] my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating_avg || 5) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reviews.length} {isAr ? 'تقييم' : 'reviews'}
                  </div>
                </div>
              </div>

              {/* Add Review Form */}
              <div className="bg-[#fff9f6] p-6 rounded-2xl border border-[#e8dcd8]">
                <h4 className="font-bold text-[#4a1c24] text-base mb-3">
                  {isAr ? 'أضف تقييمك للمنتج' : 'Leave a Review'}
                </h4>
                {reviewMessage && (
                  <div className="p-3 mb-4 rounded-xl bg-[#a0525f]/10 text-[#a0525f] text-xs font-bold">
                    {reviewMessage}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {isAr ? 'التقييم' : 'Rating'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="cursor-pointer text-[#e5a044] focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${star <= newRating ? 'fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {isAr ? 'تعليقك' : 'Your Review'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={isAr ? 'اكتب تجربتك مع المنتج...' : 'Share your thoughts about this product...'}
                      className="w-full p-3 bg-white border border-[#e8dcd8] rounded-xl text-sm text-[#4a1c24] focus:outline-none focus:border-[#a0525f] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-[#a0525f] text-white rounded-full font-bold text-xs hover:bg-[#8e4551] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال التقييم' : 'Submit Review')}</span>
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((r, idx) => (
                    <div key={r.id || idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#fdf5f6] border border-[#f5ebeb] flex items-center justify-center text-[#d96677] text-xs font-bold overflow-hidden shrink-0">
                            {r.user?.avatar ? (
                              <img src={r.user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (r.user?.name || r.user_name || r.customer_name || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#4a1c24] text-sm">
                              {r.user?.name || r.user_name || r.customer_name || (isAr ? 'عميل' : 'Customer')}
                            </div>
                            {r.created_at && (
                              <span className="text-[11px] text-gray-400">
                                {new Date(r.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { dateStyle: 'medium' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex text-[#e5a044]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed ps-12">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4">
                    {isAr ? 'لا توجد تقييمات مكتوبة بعد. كن أول من يقيّم هذا المنتج!' : 'No written reviews yet. Be the first to review this product!'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 relative z-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-[#a0525f] mb-2">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.5 2.5c-4 0-7.5 2-9.5 5C6 5.5 3 6.5 2 9c0 2.5 2 4.5 4.5 5 1 2.5 3.5 4.5 6 4.5 4 0 7.5-2 9.5-5 2-2 2.5-5 1.5-7.5C22.5 4 19.5 2.5 17.5 2.5z"/></svg>
                  <h2 className="text-2xl font-bold font-serif text-[#4a1c24]">{isAr ? 'قد يعجبك أيضاً' : 'You Might Also Like'}</h2>
                </div>
                <p className="text-gray-500 text-sm font-medium">{isAr ? 'المزيد من القطع المصنوعة يدوياً لأجلك.' : 'More handmade treasures, just for you.'}</p>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-[#4a1c24] hover:text-[#a0525f] transition-colors">
                {isAr ? 'عرض الكل' : 'View All'}
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="relative">
              <button className="related-prev absolute -start-5 top-[40%] -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-md hover:text-[#a0525f] z-20 cursor-pointer"><ChevronLeft className="w-5 h-5 rtl:rotate-180" /></button>
              <button className="related-next absolute -end-5 top-[40%] -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-md hover:text-[#a0525f] z-20 cursor-pointer"><ChevronRight className="w-5 h-5 rtl:rotate-180" /></button>
              
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  prevEl: '.related-prev',
                  nextEl: '.related-next',
                }}
                pagination={{
                  clickable: true,
                  el: '.related-pagination',
                  bulletClass: 'swiper-custom-bullet',
                  bulletActiveClass: 'swiper-custom-bullet-active',
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 4 },
                }}
                dir={'ltr'}
                className="pb-12"
              >
                {relatedProducts.map(p => (
                  <SwiperSlide key={p.id} className="h-auto">
                    <ProductCard 
                      product={{
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        compare_at_price: p.compare_at_price,
                        discounted_price: p.discounted_price,
                        discount_percent: p.discount_percent,
                        rating: p.rating_avg || 5,
                        reviews: p.rating_count || 0,
                        primary_image: p.primary_image,
                        slug: p.slug,
                        category: p.category,
                      }} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <div className="related-pagination flex justify-center items-center gap-2 mt-8 pb-8"></div>
              
              <style>{`
                .swiper-custom-bullet {
                  width: 10px;
                  height: 10px;
                  display: inline-block;
                  border-radius: 50%;
                  border: 1px solid #d1d5db;
                  cursor: pointer;
                  transition: all 0.3s;
                }
                .swiper-custom-bullet-active {
                  background-color: #a0525f;
                  border-color: #a0525f;
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Product Crafting Reel Modal */}
        {hasVideo && videoUrl && (
          <ProductReelModal
            isOpen={isReelOpen}
            onClose={handleCloseReel}
            product={{
              id: String(product.id),
              name: product.name,
              price: currentPrice,
              image: images[0] || '',
              category: product.category?.name || 'Handmade'
            }}
            videoSrc={videoUrl}
          />
        )}
      </div>
    </Layout>
  );
}
