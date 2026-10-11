import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../store/useStore';
import { useMockData } from '../../data/mockData';
import { Star, Heart, ShoppingBag, Minus, Plus, Truck, ShieldCheck, ChevronRight, ChevronLeft, Check, Play, Shield, Home } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import ProductReelModal from '../../components/products/ProductReelModal';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, bestsellers } = useMockData();
  const allProducts = [...products, ...bestsellers];
  const product = allProducts.find((p) => p.id === id);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const { addToCart, toggleFavorite, isFavorite } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('bg-[#a0525f]');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [activeImage, setActiveImage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReelOpen, setIsReelOpen] = useState(searchParams.get('reel') === 'true' || searchParams.get('reel') === '1');

  useEffect(() => {
    if (searchParams.get('reel') === 'true' || searchParams.get('reel') === '1') {
      setIsReelOpen(true);
    }
  }, [searchParams]);

  const handleCloseReel = () => {
    setIsReelOpen(false);
    if (searchParams.get('reel')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('reel');
      setSearchParams(newParams, { replace: true });
    }
  };

  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  if (!product) {
    return (
      <Layout>
        <div className="bg-[#fdfaf8] min-h-[60vh] flex items-center justify-center font-sans">
          <h1 className="text-2xl font-bold text-[#4a1c24]">{'Product not found'}</h1>
        </div>
      </Layout>
    );
  }


  const colors = ['bg-[#f4dcc6]', 'bg-[#f5b8a5]', 'bg-[#5b6e40]', 'bg-[#4a1c24]'];
  const sizes = isAr ? ['ØµØºÙŠØ±', 'ÙˆØ³Ø·', 'ÙƒØ¨ÙŠØ±'] : ['Small', 'Medium', 'Large'];
  
  const images = [
    'https://images.unsplash.com/photo-1606822832549-b68e983226db?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584988755018-ba205ebf369d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584988755018-ba205ebf369d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1606822832549-b68e983226db?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <Layout>
      <div className="bg-[#fdfaf8] min-h-screen pb-20 font-sans relative overflow-hidden">
        
        {/* Background Florals for Top Section */}
        <img src="/images/decorations/floral.png" alt="" className="absolute top-0 end-0 w-64 opacity-20 pointer-events-none rotate-180" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />
        <img src="/images/decorations/floral.png" alt="" className="absolute top-[400px] start-0 w-64 opacity-20 pointer-events-none -scale-x-100 rtl:scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />

        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 pb-3 sm:pb-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-[#a0525f]">
            <Home className="w-3.5 h-3.5" />
            <Link to="/" className="hover:underline">{'Home'}</Link>
            <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180" />
            <Link to="/products" className="hover:underline">{'Shop'}</Link>
            <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180" />
            <Link to="/products" className="hover:underline">{'Handmade Gifts'}</Link>
            <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180" />
            <span className="text-gray-500">{'Flower Basket'}</span>
          </div>
        </div>

        {/* Top Product Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left: Images */}
            <div className="w-full lg:w-[55%] flex flex-col gap-4">
              {/* Main Image */}
              <div className="w-full relative aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] lg:h-[580px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm bg-white group">
                <img 
                  src={images[activeImage]} 
                  alt="Product Main" 
                  className="w-full h-full object-cover transition-opacity duration-300" 
                  onError={(e) => { e.currentTarget.src = '/images/products/placeholder.jpg' }} 
                />
                <button 
                  onClick={() => toggleFavorite(product)} 
                  className={`absolute top-4 sm:top-6 end-4 sm:end-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center ${isFavorite(product.id) ? 'text-[#a0525f]' : 'text-gray-400 hover:text-[#a0525f]'} shadow-md transition-colors z-10`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute bottom-4 sm:bottom-6 start-4 sm:start-6 flex items-center gap-2 z-10">
                  <button 
                    onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)} 
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#4a1c24] hover:text-[#a0525f] shadow-md transition-transform active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)} 
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#4a1c24] hover:text-[#a0525f] shadow-md transition-transform active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </div>
                <div className="absolute bottom-4 sm:bottom-6 end-4 sm:end-6 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-md z-10 text-xs sm:text-sm font-bold text-[#4a1c24]">
                  {activeImage + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnails - Underneath the Big Image horizontally */}
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
                      onError={(e) => { e.currentTarget.src = '/images/products/placeholder.jpg' }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:w-[45%] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#a0525f] text-sm font-medium mb-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.5 2.5c-4 0-7.5 2-9.5 5C6 5.5 3 6.5 2 9c0 2.5 2 4.5 4.5 5 1 2.5 3.5 4.5 6 4.5 4 0 7.5-2 9.5-5 2-2 2.5-5 1.5-7.5C22.5 4 19.5 2.5 17.5 2.5z"/></svg>
                {'Handmade Gift'}
              </div>
              <h1 className={`text-4xl lg:text-[42px] font-bold ${'font-serif'} text-[#4a1c24] leading-tight mb-3`}>
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center text-[#e5a044]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-gray-500 font-medium">({'24 reviews'})</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[32px] font-bold text-[#4a1c24]">{product.price}</span>
                <span className="text-xl text-gray-400 line-through font-medium">EGP 600</span>
                <span className="bg-[#a0525f] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                  {'30% OFF'}
                </span>
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-8 max-w-[90%]">
                {isAr 
                  ? 'Ø³Ù„Ø© Ø²Ù‡ÙˆØ± ÙƒØ±ÙˆØ´ÙŠÙ‡ Ù…ØµÙ†ÙˆØ¹Ø© ÙŠØ¯ÙˆÙŠØ§Ù‹ Ø¨Ø¹Ù†Ø§ÙŠØ© ÙˆØ­Ø¨ Ù„Øªï¿½?Ø§ØµÙŠÙ„Ù‡Ø§. Ù…Ø«Ø§Ù„ÙŠØ© ÙƒÙ‡Ø¯ÙŠØ©ØŒ Ø£Ùˆ ÙƒÙ‚Ø·Ø¹Ø© Ø¯ÙŠÙƒÙˆØ± ØªØ¶ÙŠï¿½? Ù„Ù…Ø³Ø© Ø·Ø¨ÙŠØ¹ÙŠØ© Ø³Ø§Ø­Ø±Ø© Ù„Ù…Ø³Ø§Ø­ØªÙƒ.'
                  : 'A beautifully handcrafted crochet flower basket, made with love and attention to detail. Perfect for gifting, home decor, or adding a touch of natural charm to your space.'}
              </p>

              <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4a1c24]"><ShieldCheck className="w-6 h-6 stroke-[1.5]" /></div>
                  <span className="text-xs font-bold text-gray-700 leading-tight w-20">{'100% Handmade'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4a1c24]"><Shield className="w-6 h-6 stroke-[1.5]" /></div>
                  <span className="text-xs font-bold text-gray-700 leading-tight w-16">{'Premium Quality'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4a1c24]"><Truck className="w-6 h-6 stroke-[1.5]" /></div>
                  <span className="text-xs font-bold text-gray-700 leading-tight w-24">{'Free Shipping On Orders 550+'}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#4a1c24] mb-3">{'Colors'}</h4>
                <div className="flex items-center gap-3">
                  {colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-[#a0525f]' : ''} transition-all shadow-inner border border-black/5`} />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-[#4a1c24] mb-3">{'Size'}</h4>
                <div className="flex items-center gap-3">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${selectedSize === size ? 'border-[#a0525f] text-[#a0525f] bg-[#a0525f]/5' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{size}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 h-[54px]">
                  <div className="flex items-center justify-between px-4 h-full w-[140px] rounded-full border border-gray-200 bg-white">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#a0525f]"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold text-[#4a1c24]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-[#a0525f]"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => { addToCart(product, quantity, selectedColor, selectedSize); setIsAdded(true); setTimeout(() => setIsAdded(false), 2000); }} className="flex-1 h-full bg-[#a0525f] hover:bg-[#8e4551] text-white rounded-full flex items-center justify-center gap-2 font-bold transition-colors shadow-md active:scale-[0.98]">
                      <ShoppingBag className="w-5 h-5" /> {isAdded ? ('Added to Cart') : ('Add to Cart')}
                    </button>
                </div>
                <button onClick={() => toggleFavorite(product)} className="w-full h-[54px] bg-transparent border border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors">
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-[#a0525f] text-[#a0525f]' : ''}`} /> {isFavorite(product.id) ? ('Added to Wishlist') : ('Add to Wishlist')}
                  </button>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-500">
                <span className="w-2 h-2 rounded-full bg-[#a0525f]"></span>
                {'Only 5 items left in stock'}
              </div>
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="relative mt-20 mb-20 bg-[#fef5f3] py-12 w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full leading-none rotate-180 -translate-y-[99%] text-[#fef5f3]">
            <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full leading-none translate-y-[99%] text-[#fef5f3] z-10">
            <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
            </svg>
          </div>
          <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-wrap lg:flex-nowrap justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><Heart className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[100px]">{'Handmade with Love'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><ShieldCheck className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[100px]">{'Premium Quality'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><Truck className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[120px]">{'Free Shipping On Orders 550+'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a0525f]/20 flex items-center justify-center text-[#a0525f]"><Shield className="w-6 h-6 stroke-[1.5]" /></div>
              <span className="font-bold text-[#4a1c24] text-sm leading-tight max-w-[100px]">{'Secure Payments'}</span>
            </div>
          </div>
          <img src="/images/decorations/floral.png" alt="" className="absolute top-1/2 start-0 -translate-y-1/2 w-48 opacity-[0.15] pointer-events-none -scale-x-100 rtl:scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />
          <img src="/images/decorations/floral.png" alt="" className="absolute top-1/2 end-0 -translate-y-1/2 w-48 opacity-[0.15] pointer-events-none rtl:-scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />
        </div>

        {/* Tabs & Details Section */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 relative z-10">
          <div className="flex items-center gap-10 border-b border-gray-200 mb-10 overflow-x-auto pb-4">
            <button onClick={() => setActiveTab('details')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors ${activeTab === 'details' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{'Product Details'}</button>
            <button onClick={() => setActiveTab('shipping')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors ${activeTab === 'shipping' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{'Shipping & Returns'}</button>
            <button onClick={() => setActiveTab('care')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors ${activeTab === 'care' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{'Care Instructions'}</button>
            <button onClick={() => setActiveTab('reviews')} className={`font-bold text-[15px] pb-3 whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'text-[#a0525f] border-b-2 border-[#a0525f]' : 'text-gray-500 hover:text-[#4a1c24]'}`}>{'Reviews (24)'}</button>
          </div>

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch animate-fade-in">
              <div className="flex flex-col justify-center order-2 lg:order-none">
                <h3 className={`text-xl font-bold ${'font-serif'} text-[#4a1c24] mb-4`}>{'About This Product'}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-8">
                  {isAr 
                    ? 'Ù‡Ø°Ù‡ Ø§Ù„Ø³Ù„Ø© Ù‡ÙŠ Ù‚Ø·Ø¹Ø© ï¿½?Ø±ÙŠØ¯Ø© Ù…ØµÙ†ÙˆØ¹Ø© ÙŠØ¯ÙˆÙŠØ§Ù‹ Ø¨Ø¹Ù†Ø§ÙŠØ© ï¿½?Ø§Ø¦Ù‚Ø©. ÙƒÙ„ Ø²Ù‡Ø±Ø© Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† Ø®ÙŠÙˆØ· Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø© Ù„ØªØ¯ÙˆÙ… Ø·ÙˆÙŠÙ„Ø§Ù‹ØŒ Ø¥Ù†Ù‡Ø§ Ø£ÙƒØ«Ø± Ù…Ù† Ù…Ø¬Ø±Ø¯ Ø³Ù„Ø© Ø¨Ù„ Ù‚Ø·Ø¹Ø© ï¿½?Ù†ÙŠØ© Ù…Ù„ÙŠØ¦Ø© Ø¨Ø§Ù„Ø­Ø¨.' 
                    : 'This crochet flower basket is a unique piece, carefully handcrafted by skilled artisans. Each flower is made with high-quality yarn, creating a beautiful and long-lasting design. It\'s more than just a basket â€” it\'s a piece of art filled with love.'}
                </p>
                <ul className="space-y-4">
                  {(isAr ? [
                    'Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† Ø®ÙŠÙˆØ· Ù‚Ø·Ù† Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø©',
                    'Øªï¿½?Ø§ØµÙŠÙ„ Ø¯Ù‚ÙŠÙ‚Ø© Ù„Ù„Ø²Ù‡ÙˆØ± ÙˆØ§Ù„Ø£ÙˆØ±Ø§Ù‚',
                    'Ù‡ÙŠÙƒÙ„ Ù…ØªÙŠÙ† ÙˆÙ‚ÙˆÙŠ',
                    'Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ù‡Ø¯Ø§ÙŠØ§ ÙˆØ§Ù„Ø¯ÙŠÙƒÙˆØ±'
                  ] : [
                    'Handmade with high-quality cotton yarn',
                    'Detailed crochet flowers and leaves',
                    'Sturdy and durable structure',
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
                    {<>A Touch of<br/>Nature & Love</>}
                  </h3>
                  <p className="text-[13px] text-gray-600 font-medium max-w-[200px] relative z-10">{'Handcrafted to bring warmth and beauty to your everyday life.'}</p>
                  <img src="/images/decorations/floral.png" alt="" className="absolute -bottom-6 -end-6 w-32 opacity-40 rtl:-scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} />
                </div>
              </div>
              
              <div className="h-full min-h-[320px] order-3 lg:order-none w-full">
                <div 
                  onClick={() => setIsReelOpen(true)}
                  className="w-full h-full bg-black rounded-[32px] relative overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsReelOpen(true); }}
                  aria-label="Watch Crafting Reel"
                >
                  <img src="https://images.unsplash.com/photo-1622295627685-61011504ee84?auto=format&fit=crop&q=80&w=800" onError={(e) => { e.currentTarget.src = '/images/products/placeholder.jpg' }} alt="Video thumbnail" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                    <div className="flex items-center gap-4 backdrop-blur-md bg-black/50 px-6 py-4 rounded-full border border-white/30 text-white group-hover:bg-[#a0525f] group-hover:border-[#a0525f] group-hover:scale-105 transition-all shadow-xl">
                      <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center rtl:pr-1 ltr:pl-1 group-hover:bg-white group-hover:text-[#a0525f] transition-colors shadow"><Play className="w-4 h-4 fill-current" /></div>
                      <div className="flex flex-col items-start text-start">
                        <span className="font-bold text-sm">{isAr ? 'شاهد خطوات الصنع' : 'Watch Crafting Process'}</span>
                        <span className="text-xs text-white/80">2:45 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="py-8 animate-fade-in max-w-3xl">
              <h3 className={`text-xl font-bold ${'font-serif'} text-[#4a1c24] mb-4`}>{'Shipping & Returns Policy'}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{'We offer fast shipping to all governates within 3-5 business days. Shipping costs vary by region. Orders over 550 EGP qualify for free shipping.'}</p>
              <h4 className="font-bold text-[#4a1c24] mb-2">{'Returns and Exchanges'}</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{'You can return or exchange the product within 14 days of receipt, provided it is in its original condition and packaging.'}</p>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="py-8 animate-fade-in max-w-3xl">
              <h3 className={`text-xl font-bold ${'font-serif'} text-[#4a1c24] mb-4`}>{'Care Instructions'}</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#a0525f]" />{'Hand wash in cold water with mild detergent to preserve colors.'}</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#a0525f]" />{'Do not bleach or use strong detergents.'}</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#a0525f]" />{'Dry flat in shade away from direct sunlight.'}</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#a0525f]" />{'Avoid vigorous rubbing or wringing to prevent distortion.'}</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="py-8 animate-fade-in max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-bold text-[#4a1c24]">4.8</div>
                <div>
                  <div className="flex items-center text-[#e5a044] mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-sm text-gray-500">{'Based on 24 reviews'}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{'No written reviews yet. Be the first to review this product!'}</p>
            </div>
          )}
        </div>

        {/* You Might Also Like Section */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-[#a0525f] mb-2">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.5 2.5c-4 0-7.5 2-9.5 5C6 5.5 3 6.5 2 9c0 2.5 2 4.5 4.5 5 1 2.5 3.5 4.5 6 4.5 4 0 7.5-2 9.5-5 2-2 2.5-5 1.5-7.5C22.5 4 19.5 2.5 17.5 2.5z"/></svg>
                <h2 className={`text-2xl font-bold ${'font-serif'} text-[#4a1c24]`}>{'You Might Also Like'}</h2>
              </div>
              <p className="text-gray-500 text-sm font-medium">{'More handmade treasures, just for you.'}</p>
            </div>
            <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-[#4a1c24] hover:text-[#a0525f] transition-colors">
              {'View All Products'}
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
                1280: { slidesPerView: 5 },
              }}
              dir={'ltr'}
              className="pb-12"
            >
              {allProducts.slice(0, 8).map(p => (
                <SwiperSlide key={p.id} className="h-auto">
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="related-pagination flex justify-center items-center gap-2 mt-8 pb-8"></div>
            
            {/* Custom Pagination Styles */}
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

        {/* Product Crafting Reel Modal */}
        <ProductReelModal
          isOpen={isReelOpen}
          onClose={handleCloseReel}
          product={product}
          videoSrc="/videos/crafting-reel.mp4"
        />
      </div>
    </Layout>
  );
}


