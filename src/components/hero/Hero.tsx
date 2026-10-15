import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ShieldCheck, Truck, Gift, Leaf, Package } from 'lucide-react';
import { categoriesService } from '../../api/services';
import type { ApiCategory } from '../../api/types';
import HeroPreloader from './HeroPreloader';
import { heroFrameManager, HERO_FRAME_COUNT, type FramePreloadProgress } from './HeroFrameManager';

const FRAME_COUNT = HERO_FRAME_COUNT;

const getIcon = (name: string) => {
  const className = "w-6 h-6 md:w-8 md:h-8 text-[#d96677] mb-3";
  switch (name) {
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Gift': return <Gift className={className} />;
    case 'GiftBox': return <Package className={className} />;
    case 'Leaf': return <Leaf className={className} />;
    default: return <Gift className={className} />;
  }
};

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    let isMounted = true;
    categoriesService.getCategories()
      .then((data) => {
        if (isMounted) setCategories(data || []);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [i18n.language]);

  const featuresList = [
    { id: '1', title: t('features.paymentTitle', 'دفع آمن'), subtitle: t('features.paymentSubtitle', 'بكل سهولة'), icon: 'ShieldCheck' },
    { id: '2', title: t('features.shippingTitle', 'شحن سريع'), subtitle: t('features.shippingSubtitle', 'لجميع المحافظات'), icon: 'Truck' },
    { id: '3', title: t('features.details1Title', 'تفاصيل مميزة'), subtitle: t('features.details1Subtitle', 'بكل حب وإتقان'), icon: 'Gift' },
    { id: '4', title: t('features.materialsTitle', 'خامات طبيعية وآمنة'), subtitle: t('features.materialsSubtitle', 'صديقة للبيئة'), icon: 'Leaf' },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [preloadProgress, setPreloadProgress] = useState<FramePreloadProgress>(
    heroFrameManager.getProgress()
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Master Timeline mapping 1200vh to 100 frames smoothly
  const frameIndex = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.20, 0.35, 0.40, 0.55, 0.60, 0.75, 0.80, 1],
    [0, 16,   34,   47,   65,   74,   87,   94,   97,  FRAME_COUNT - 1]
  );

  useEffect(() => {
    // 1. Subscribe to progress and start managed preloading
    const unsubscribe = heroFrameManager.onProgress(setPreloadProgress);
    heroFrameManager.startPreload();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentRenderedIndex = -1;
    let animationFrameId: number;

    const renderFrame = (index: number) => {
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      const img = heroFrameManager.getFrame(safeIndex);
      
      if (img && img.naturalWidth > 0) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
           drawWidth = canvas.width;
           drawHeight = canvas.width / imgRatio;
           offsetX = 0;
           offsetY = (canvas.height - drawHeight) / 2;
        } else {
           drawHeight = canvas.height;
           drawWidth = canvas.height * imgRatio;
           offsetX = (canvas.width - drawWidth) / 2;
           offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        currentRenderedIndex = safeIndex;
      }
    };

    // Render initial frame as soon as frame 0 is available
    renderFrame(0);

    const updateCanvas = () => {
      // Only advance scroll-driven animation when the sequence is ready
      const targetIndex = preloadProgress.isReady 
        ? Math.floor(frameIndex.get()) 
        : 0;

      if (targetIndex !== currentRenderedIndex) {
        renderFrame(targetIndex);
      }
      animationFrameId = requestAnimationFrame(updateCanvas);
    };

    animationFrameId = requestAnimationFrame(updateCanvas);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(preloadProgress.isReady ? Math.floor(frameIndex.get()) : 0);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [frameIndex, preloadProgress.isReady]);

  const op1 = useTransform(scrollYProgress, [0, 0.03, 0.12, 0.15], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.03, 0.12, 0.15], [40, 0, 0, -40]);
  const pe1 = useTransform(op1, v => v > 0.5 ? "auto" : "none");

  const op2 = useTransform(scrollYProgress, [0.18, 0.22, 0.33, 0.37], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.18, 0.22, 0.33, 0.37], [40, 0, 0, -40]);
  const pe2 = useTransform(op2, v => v > 0.5 ? "auto" : "none");

  const op3 = useTransform(scrollYProgress, [0.38, 0.42, 0.53, 0.57], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.38, 0.42, 0.53, 0.57], [40, 0, 0, -40]);
  const pe3 = useTransform(op3, v => v > 0.5 ? "auto" : "none");

  const op4 = useTransform(scrollYProgress, [0.58, 0.62, 0.73, 0.77], [0, 1, 1, 0]);
  const y4 = useTransform(scrollYProgress, [0.58, 0.62, 0.73, 0.77], [40, 0, 0, -40]);
  const pe4 = useTransform(op4, v => v > 0.5 ? "auto" : "none");

  const op5 = useTransform(scrollYProgress, [0.78, 0.82, 1, 1], [0, 1, 1, 1]);
  const y5 = useTransform(scrollYProgress, [0.78, 0.82, 1, 1], [40, 0, 0, 0]);
  const pe5 = useTransform(op5, v => v > 0.5 ? "auto" : "none");

  return (
    <>
      <HeroPreloader 
        progress={preloadProgress.percent} 
        loadedCount={preloadProgress.loaded}
        totalCount={preloadProgress.total}
        isReady={preloadProgress.isReady} 
        onSkip={() => heroFrameManager.forceReady(true)}
      />
      <section ref={containerRef} className="relative h-[1200vh] bg-[#1a0a13]">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" />
        
        {/* Cinematic Dark Gradient to make right-side text readable */}
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-transparent via-black/20 to-black/80 z-10 pointer-events-none" />

        {/* Master Container - Aligning text to the Right (End) */}
        <div className="absolute inset-0 z-20 max-w-[1500px] mx-auto w-full px-8 md:px-16 pointer-events-none flex items-center justify-end">
          
          <div className="w-full lg:w-[45%] h-full relative flex items-center rtl:text-right ltr:text-left text-start">
            
            {/* Scene 1: Introduction */}
            <motion.div className="absolute w-full flex flex-col" style={{ opacity: op1, y: y1, pointerEvents: pe1 }}>
              <span className="text-xl font-medium tracking-[0.2em] text-[#d96677] uppercase mb-4 drop-shadow-md">
                {t('hero.story')}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight font-arabic drop-shadow-2xl text-white mb-4">
                {t('hero.titleLine1')}
                <br />
                <span className="text-4xl md:text-5xl font-light text-white/90 block mt-2">
                  {t('hero.titleLine2')}
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-white/80 leading-relaxed drop-shadow-lg font-medium whitespace-pre-line mb-10 max-w-lg">
                {t('hero.subtitle')}
              </p>
              <div className="flex items-center gap-6">
                <Link to="/products" className="inline-flex items-center justify-center px-10 py-4 bg-[#c25a6a] text-white rounded-full text-lg font-bold hover:bg-[#a64958] transition-all shadow-xl hover:-translate-y-1 transform duration-300">
                  {t('hero.cta')}
                </Link>
                <button onClick={() => window.scrollTo({ top: window.innerHeight * 4.8, behavior: 'smooth' })} className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
                  <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white transition-colors">
                    <svg className="w-4 h-4 rtl:mr-1 ltr:ml-1 fill-current rtl:rotate-180" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <span className="text-sm font-medium tracking-wider uppercase">{t('hero.watchVideo')}</span>
                </button>
              </div>
            </motion.div>

            {/* Scene 2: Features (Cinematic Version) */}
            <motion.div className="absolute w-full flex flex-col" style={{ opacity: op2, y: y2, pointerEvents: pe2 }}>
              <h2 className="text-4xl md:text-6xl font-bold font-arabic drop-shadow-xl text-white mb-10">
                {t('collections.whyTitle', 'Why Choose Us?')}
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 max-w-xl mb-12">
                {featuresList.map(f => (
                  <div key={f.id} className="flex flex-col items-start">
                    {getIcon(f.icon)}
                    <h3 className="text-white font-bold text-xl mb-2 drop-shadow-md">{f.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed drop-shadow-sm">{f.subtitle}</p>
                  </div>
                ))}
              </div>
              <div>
                <Link to="/about" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-sm hover:text-[#d96677] transition-colors border-b-2 border-white/30 hover:border-[#d96677] pb-1">
                  {t('about.learnMore', 'Learn More')}
                </Link>
              </div>
            </motion.div>

            {/* Scene 3: Our Story */}
            <motion.div className="absolute w-full flex flex-col" style={{ opacity: op3, y: y3, pointerEvents: pe3 }}>
              <span className="text-lg font-medium tracking-[0.2em] text-[#d96677] uppercase mb-4 drop-shadow-md">
                {t('storyBanner.title', 'Our Story')}
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-arabic drop-shadow-xl text-white mb-6 leading-tight">
                {t('storyBanner.heading1')}
                <br />
                <span className="text-white/90 font-light">{t('storyBanner.heading2')}</span>
              </h2>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-lg">
                {t('storyBanner.description')}
              </p>
              <div>
                <Link to="/about" className="inline-flex items-center justify-center px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-lg font-medium hover:bg-white/20 transition-all shadow-lg hover:-translate-y-1 transform duration-300">
                  {t('storyBanner.cta', 'Discover our story')}
                </Link>
              </div>
            </motion.div>

            {/* Scene 4: Categories / Pills from Live API */}
            <motion.div className="absolute w-full flex flex-col" style={{ opacity: op4, y: y4, pointerEvents: pe4 }}>
              <h2 className="text-4xl md:text-6xl font-bold font-arabic drop-shadow-xl text-white mb-4">
                {t('sections.categoriesTitle')}
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-lg">
                {t('sections.categoriesDesc')}
              </p>
              <div className="flex flex-wrap gap-3 mb-10 max-w-lg">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/products?category=${cat.slug}`}
                      className="px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-white/90 hover:text-white text-sm font-medium shadow-sm hover:bg-white/20 transition-all hover:scale-105"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  [1, 2, 3, 4].map((n) => (
                    <span 
                      key={n} 
                      className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-sm animate-pulse"
                    >
                      ...
                    </span>
                  ))
                )}
              </div>
              <div className="flex items-center gap-6">
                <Link to="/products" className="inline-flex items-center justify-center px-10 py-4 bg-[#c25a6a] text-white rounded-full text-lg font-bold hover:bg-[#a64958] transition-all shadow-xl hover:-translate-y-1 transform duration-300">
                  {t('hero.cta', 'Explore Collections')}
                </Link>
              </div>
            </motion.div>

            {/* Scene 5: Final CTA */}
            <motion.div className="absolute w-full flex flex-col" style={{ opacity: op5, y: y5, pointerEvents: pe5 }}>
              <div className="w-16 h-1 bg-[#d96677] mb-8" />
              <h2 className="text-5xl md:text-7xl font-bold font-arabic drop-shadow-xl text-white mb-6 leading-tight">
                {t('newsletter.exclusiveOffers', 'Stay Inspired')}
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                {t('newsletter.exclusiveDesc', 'Be the first to know about new arrivals, special offers, and more handmade goodness.')}
              </p>
              <form 
                className="w-full max-w-md flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const btn = e.currentTarget.querySelector('button');
                  if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = 'Subscribed!';
                    btn.classList.add('bg-green-500', 'text-white');
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.classList.remove('bg-green-500', 'text-white');
                      (e.target as HTMLFormElement).reset();
                    }, 3000);
                  }
                }}
              >
                <input 
                  type="email" 
                  required
                  placeholder={t('newsletter.emailPlaceholder', 'Your Email Address')}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                />
                <button type="submit" className="w-full py-4 bg-white text-[#1a0a13] rounded-full text-lg font-bold hover:bg-[#f8f8f8] transition-all shadow-xl">
                  {t('newsletter.subscribeBtn', 'Subscribe')}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  </>
);
}
