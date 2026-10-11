import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, Share2, Volume2, VolumeX, Play, Pause, ShoppingBag, Check, Music2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

interface ProductReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
  };
  videoSrc?: string;
}

export default function ProductReelModal({
  isOpen,
  onClose,
  product,
  videoSrc = '/videos/crafting-reel.mp4'
}: ProductReelModalProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { addToCart } = useStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1248);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  // Close on Escape & Lock Body Scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Autoplay when opened
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 700);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(prev => !prev);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Sect Handmade Craft',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      addToCart(product as any, 1);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2200);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-300 p-0 sm:p-4 md:p-6"
      onClick={onClose}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Phone Mockup Frame Container */}
      <div
        className="w-full h-full sm:h-[94vh] sm:max-h-[840px] sm:max-w-[420px] bg-black sm:rounded-[36px] overflow-hidden relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] sm:border-[5px] sm:border-white/15 flex flex-col select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone Top Notch / Speaker (Visible on tablet/desktop) */}
        <div className="hidden sm:flex absolute top-3 inset-x-0 justify-center z-40 pointer-events-none">
          <div className="w-24 h-4 bg-black/70 rounded-full border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-8 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Video Element */}
        <div 
          className="relative flex-1 w-full h-full bg-neutral-950 cursor-pointer overflow-hidden"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            loop
            autoPlay
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover"
          />

          {/* Flash Play/Pause Indicator Animation */}
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-opacity duration-300">
              <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-110 shadow-2xl border border-white/20">
                {isPlaying ? <Play className="w-10 h-10 fill-current translate-x-0.5" /> : <Pause className="w-10 h-10 fill-current" />}
              </div>
            </div>
          )}

          {/* Video Gradient Overlays for Readability */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-20" />

          {/* Top Bar Controls */}
          <div className="absolute top-4 sm:top-6 inset-x-0 px-4 sm:px-5 flex items-center justify-between z-30 pointer-events-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-lg"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reels Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#d96677] animate-pulse" />
              <span>{isAr ? 'حرفة يدوية' : 'Crafting Reel'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-lg"
              title={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : (isAr ? 'كتم الصوت' : 'Mute')}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white/80" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
          </div>

          {/* Right Floating Actions (Reels Style) */}
          <div className="absolute end-3 sm:end-4 bottom-32 z-30 flex flex-col items-center gap-4 pointer-events-auto">
            {/* Artisan Avatar */}
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#d96677] to-[#ab4458] shadow-lg">
                <img
                  src="/images/backgrounds/products-hero.png"
                  alt="Sect Artisan"
                  className="w-full h-full rounded-full object-cover border border-black"
                />
              </div>
              <div className="absolute -bottom-1.5 inset-x-0 flex justify-center">
                <div className="w-4 h-4 rounded-full bg-[#d96677] text-white flex items-center justify-center text-[10px] font-bold shadow">
                  +
                </div>
              </div>
            </div>

            {/* Like Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleLike}
                className={`w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 active:scale-125 shadow-lg ${
                  isLiked ? 'text-red-500 bg-red-500/20 border-red-500/40' : 'text-white hover:bg-black/60'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current stroke-current scale-110' : 'stroke-[2]'}`} />
              </button>
              <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">
                {likeCount.toLocaleString()}
              </span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center relative">
              <button
                onClick={handleShare}
                className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all border border-white/20 active:scale-110 shadow-lg"
                title={isAr ? 'مشاركة' : 'Share'}
              >
                <Share2 className="w-5 h-5 stroke-[2]" />
              </button>
              <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">
                {isAr ? 'مشاركة' : 'Share'}
              </span>

              {/* Copied Tooltip */}
              {isCopied && (
                <div className="absolute -top-8 end-0 whitespace-nowrap bg-white text-[#4a1c24] text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-xl animate-bounce">
                  {isAr ? 'تم النسخ! ✓' : 'Copied! ✓'}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info & Product CTA Card */}
          <div className="absolute inset-x-0 bottom-4 px-4 sm:px-5 z-30 flex flex-col gap-3 pointer-events-auto">
            {/* Creator & Caption */}
            <div className="space-y-1.5 pe-14">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm drop-shadow-md">@sect.handmade</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                  {isAr ? 'استوديو سكت' : 'Sect Studio'}
                </span>
              </div>
              <p className="text-xs text-white/95 leading-relaxed line-clamp-2 drop-shadow-md font-normal">
                {isAr
                  ? `شاهد مراحل صنع ${product?.name || 'القطعة'} يدويًا بغرز الكروشيه وخيوط القطن الطبيعية الفاخرة ✨`
                  : `Watch the step-by-step crafting of ${product?.name || 'this piece'}, delicately crocheted with 100% natural cotton ✨`}
              </p>
              
              {/* Music Marquee */}
              <div className="flex items-center gap-2 text-white/80 text-[11px]">
                <Music2 className="w-3.5 h-3.5 text-[#d96677] shrink-0 animate-bounce" />
                <span className="truncate">
                  {isAr ? 'الصوت الأصلي - ألحان استوديو سكت للحرفيات' : 'Original Sound - Sect Artisans Studio'}
                </span>
              </div>
            </div>

            {/* Quick Add To Cart Pill Bar */}
            {product && (
              <div className="bg-white/15 hover:bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-2xl transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={product.image || '/images/products/placeholder.jpg'}
                    alt={product.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/30 shadow-md"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-white font-bold text-xs truncate">
                      {product.name}
                    </span>
                    <span className="text-white/90 font-extrabold text-xs">
                      ${product.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleQuickAdd}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-lg active:scale-95 ${
                    isAddedToCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#d96677] hover:bg-[#c25565] text-white'
                  }`}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isAr ? 'تمت الإضافة' : 'Added!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Instagram-Style Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/25 z-40">
            <div
              className="h-full bg-[#d96677] transition-all duration-100 ease-linear rounded-r-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
