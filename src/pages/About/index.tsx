import { useTranslation } from 'react-i18next';
import { Heart, Leaf, Globe, Users, ArrowRight } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';

export default function About() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-[76px] md:pt-[92px]">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/backgrounds/products-hero.webp" 
              alt="Background"
              className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-24">
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block">
                {t('about.heroSubtitle')}
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm whitespace-pre-line">
                {t('about.heroTitle')}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('about.heroScript')}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('about.heroDesc')}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block z-30">
              More than just <br/>
                <span className="text-2xl">{isRTL ? "؟" : "?"}</span> Handmade..
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-8 md:h-12 z-40 text-[#fcf9f5]">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 relative bg-[#fcf9f5] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              
              {/* Left Images */}
              <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-start">
                <div className="relative w-full max-w-[500px] h-[450px]">
                  {/* Polaroid 1 */}
                  <div className="absolute ltr:left-0 rtl:right-0 top-10 w-[260px] h-[300px] bg-white p-3 pb-12 shadow-xl transform ltr:-rotate-6 rtl:rotate-6 z-10 border border-gray-100 rounded-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d1bfae]/50 transform rotate-3 backdrop-blur-sm z-30"></div>
                    <img src="/images/backgrounds/about-hero.jpg" className="w-full h-full object-cover ltr:-scale-x-100" alt="Bag" />
                  </div>
                  {/* Polaroid 2 */}
                  <div className="absolute ltr:right-10 rtl:left-10 top-0 w-[240px] h-[280px] bg-white p-3 pb-10 shadow-lg transform ltr:rotate-6 rtl:-rotate-6 z-0 border border-gray-100 rounded-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d1bfae]/50 transform -rotate-3 backdrop-blur-sm z-30"></div>
                    <img src="/images/backgrounds/cart-hero.jpg" className="w-full h-full object-cover" alt="Craft" />
                  </div>
                  {/* Text Note */}
                  <div className="absolute bottom-10 ltr:right-20 rtl:left-20 transform ltr:-rotate-12 rtl:rotate-12 font-handwriting text-[#913b4c] text-3xl leading-tight z-20 whitespace-pre-line ltr:text-left rtl:text-right">
                    {t('about.hwStory1')} <span className="text-xl">{isRTL ? "؟" : "?"}</span>
                  </div>
                </div>
              </div>
              
              {/* Right Content */}
              <div className="lg:w-1/2 relative xl:ltr:pr-40 xl:rtl:pl-40">
                <span className="text-[#a0525f] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('about.dreamSubtitle')}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4a1c24] mb-6 leading-tight whitespace-pre-line">
                  {t('about.dreamTitle')}
                </h2>
                <p className="text-[#4a1c24]/70 mb-4 text-[15px] leading-relaxed max-w-lg font-medium">
                  {t('about.dreamDesc1') || "Sect was born from a simple belief: handmade crafts have the power to connect people - across cultures, across borders, and across hearts."}
                </p>
                <p className="text-[#4a1c24]/70 mb-8 text-[15px] leading-relaxed max-w-lg font-medium">
                  {t('about.dreamDesc2') || "What started as a small passion project quickly grew into a global platform, supporting artisans and bringing their timeless creations to you."}
                </p>
                <button onClick={() => window.location.href = '/collections'} className="bg-transparent border border-[#913b4c] text-[#913b4c] hover:bg-[#913b4c] hover:text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2">
                  {t('about.dreamBtn')}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                {/* Vertical Note */}
                  <div className="absolute ltr:-right-12 rtl:-left-12 top-10 w-48 min-h-[16rem] h-auto bg-[#fcf2f4] rounded-xl transform ltr:rotate-6 rtl:-rotate-6 shadow-sm flex items-center justify-center p-6 py-8 border border-white hidden xl:flex z-30">
                    <div className="font-handwriting text-[#c35f71] text-3xl leading-[1.4] text-center whitespace-pre-line">
                      {t('about.hwStory2')} <span className="inline-block rtl:mr-1 ltr:ml-1 text-2xl">{isRTL ? "؟" : "?"}</span>
                    </div>
                  </div>
                </div>

            </div>
          </div>
          
          {/* Floral edge decors */}
          <img src="/images/decorations/floral.webp" className="absolute ltr:-left-16 rtl:-right-16 top-1/2 -translate-y-1/2 w-48 opacity-40 ltr:-scale-x-100 pointer-events-none" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} alt="" />
          <div className="absolute bottom-0 left-0 w-full h-8 md:h-12 z-40 text-white">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="py-24 relative bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <span className="text-[#a0525f] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('about.valuesSubtitle')}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4a1c24] flex items-center gap-3">
                  {t('about.valuesTitle')} <span className="font-handwriting text-[#913b4c]">{isRTL ? "؟" : "?"}</span>
                </h2>
              </div>
              <p className="text-[#4a1c24]/70 text-[15px] leading-relaxed max-w-sm font-medium ltr:text-right rtl:text-left">
                {t('about.valuesDesc')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 text-center divide-x divide-gray-100/50 rtl:divide-x-reverse">
              {/* Value 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-[#f0d8dc] bg-[#fffafb] flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6 text-[#913b4c] stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-[#4a1c24] mb-2">{t('about.val1Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70 leading-relaxed">{t('about.val1Desc')}</p>
              </div>
              {/* Value 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-[#f0d8dc] bg-[#fffafb] flex items-center justify-center mb-5">
                  <Leaf className="w-6 h-6 text-[#913b4c] stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-[#4a1c24] mb-2">{t('about.val2Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70 leading-relaxed">{t('about.val2Desc')}</p>
              </div>
              {/* Value 3 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-[#f0d8dc] bg-[#fffafb] flex items-center justify-center mb-5">
                  <Globe className="w-6 h-6 text-[#913b4c] stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-[#4a1c24] mb-2">{t('about.val3Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70 leading-relaxed">{t('about.val3Desc')}</p>
              </div>
              {/* Value 4 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-[#f0d8dc] bg-[#fffafb] flex items-center justify-center mb-5">
                  <Leaf className="w-6 h-6 text-[#913b4c] stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-[#4a1c24] mb-2">{t('about.val4Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70 leading-relaxed">{t('about.val4Desc')}</p>
              </div>
              {/* Value 5 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-[#f0d8dc] bg-[#fffafb] flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 text-[#913b4c] stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-[#4a1c24] mb-2">{t('about.val5Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70 leading-relaxed">{t('about.val5Desc')}</p>
              </div>
            </div>
          </div>
          
          <img src="/images/decorations/floral.webp" className="absolute ltr:-right-16 rtl:-left-16 top-1/3 w-48 opacity-40 pointer-events-none rtl:-scale-x-100" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }} alt="" />
          <div className="absolute bottom-0 left-0 w-full h-8 md:h-12 z-40 text-[#fcf9f5]">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </section>

        {/* The Makers Behind The Magic */}
        <section className="py-24 relative bg-[#fcf9f5] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left Image */}
              <div className="lg:w-[55%] relative">
                <img src="/images/backgrounds/about-hero.jpg" className="w-full h-[500px] object-cover rounded-xl shadow-lg" style={{ borderRadius: isRTL ? '2rem 10rem 2rem 2rem' : '2rem 2rem 2rem 10rem' }} alt="" />
                <div className="absolute inset-0 bg-black/20 rounded-xl" style={{ borderRadius: isRTL ? '2rem 10rem 2rem 2rem' : '2rem 2rem 2rem 10rem' }}></div>
                <div className="absolute bottom-16 ltr:right-12 rtl:left-12 transform ltr:-rotate-6 rtl:rotate-6 text-white font-handwriting text-4xl leading-tight ltr:text-right rtl:text-left drop-shadow-md whitespace-pre-line">
                  {t('about.hwMakers1')} <span className="text-3xl">{isRTL ? "؟" : "?"}</span>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:w-[45%] relative xl:ltr:pr-40 xl:rtl:pl-40 pb-16 xl:pb-0">
                <span className="text-[#a0525f] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('about.makersSubtitle')}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4a1c24] mb-6 leading-tight whitespace-pre-line">
                  {t('about.makersTitle')} <span className="font-handwriting text-[#913b4c] text-4xl">{isRTL ? "؟" : "?"}</span>
                </h2>
                <p className="text-[#4a1c24]/70 mb-8 text-[15px] leading-relaxed max-w-md font-medium">
                  {t('about.makersDesc') || "From cozy villages to buzzing cities, our artisans pour their hearts into every piece. We work directly with them, ensuring fair wages, safe working conditions, and a platform to showcase their talent to the world."}
                </p>
                <button onClick={() => window.location.href = '/journal'} className="bg-[#913b4c] hover:bg-[#7a3140] text-white font-bold py-3.5 px-8 rounded-full shadow-sm transition-all flex items-center gap-2">
                  {t('about.meetArtisans')}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Polaroid Stack */}
                  <div className="absolute ltr:-right-8 rtl:-left-8 bottom-0 bg-white p-3 shadow-xl transform ltr:rotate-6 rtl:-rotate-6 rounded-sm w-48 hidden xl:block z-20 border border-gray-100">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#d1bfae]/50 transform -rotate-3 backdrop-blur-sm z-30"></div>
                    <div className="space-y-2 mb-4">
                      <img src="/images/backgrounds/collections-hero.jpg" className="w-full h-24 object-cover ltr:-scale-x-100" alt="" />
                      <img src="/images/backgrounds/about-hero.jpg" className="w-full h-24 object-cover" alt="" />
                    </div>
                    <div className="font-handwriting text-[#913b4c] text-2xl text-center leading-tight whitespace-pre-line">
                      {t('about.hwMakers2')} <span className="inline-block rtl:mr-1 ltr:ml-1 text-lg">{isRTL ? "؟" : "?"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        <div className="absolute bottom-0 left-0 w-full h-8 md:h-12 z-40 text-white">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </section>

        {/* Our Impact Section */}
        <section className="py-20 bg-white relative z-10 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            <div className="lg:w-1/3 text-center lg:ltr:text-left lg:rtl:text-right">
              <span className="text-[#a0525f] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('about.impactSubtitle')}</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4a1c24] leading-tight whitespace-pre-line">
                {t('about.impactTitle')} <span className="text-[#913b4c] font-handwriting">{isRTL ? "؟" : "?"}</span>
              </h2>
            </div>

            <div className="lg:w-2/3 w-full flex justify-between items-center text-center divide-x divide-gray-100/50 rtl:divide-x-reverse">
              <div className="flex flex-col items-center flex-1">
                <Users className="w-6 h-6 text-[#913b4c] stroke-[1.5] mb-3" />
                <h4 className="text-2xl font-bold text-[#4a1c24] mb-1">{t('about.imp1Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70">{t('about.imp1Desc')}</p>
              </div>
              
              <div className="flex flex-col items-center flex-1">
                <Globe className="w-6 h-6 text-[#913b4c] stroke-[1.5] mb-3" />
                <h4 className="text-2xl font-bold text-[#4a1c24] mb-1">{t('about.imp2Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70">{t('about.imp2Desc')}</p>
              </div>
              
              <div className="flex flex-col items-center flex-1">
                <Leaf className="w-6 h-6 text-[#913b4c] stroke-[1.5] mb-3" />
                <h4 className="text-2xl font-bold text-[#4a1c24] mb-1">{t('about.imp3Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70">{t('about.imp3Desc')}</p>
              </div>
              
              <div className="flex flex-col items-center flex-1">
                <Heart className="w-6 h-6 text-[#913b4c] stroke-[1.5] mb-3" />
                <h4 className="text-2xl font-bold text-[#4a1c24] mb-1">{t('about.imp4Title')}</h4>
                <p className="text-[13px] text-[#4a1c24]/70">{t('about.imp4Desc')}</p>
              </div>
            </div>

          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

