import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function StoryBanner() {
  const { t, i18n } = useTranslation();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <div className="rounded-[40px] overflow-hidden shadow-2xl relative min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
        
        {/* Background Image covering the entire banner */}
        <img 
          src="/images/backgrounds/hero-bg.png" 
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&q=80&w=1600" }}
          alt="Handmade Tag" 
          className="absolute inset-0 w-full h-full object-cover ltr:-scale-x-100"
        />

        {/* Blurred Gradient Overlay on the right side in RTL, left side in LTR */}
        <div 
          className="absolute top-0 bottom-0 w-full md:w-[70%] bg-gradient-to-l from-[#4a1c24]/90 via-[#4a1c24]/70 to-transparent backdrop-blur-[8px] rtl:right-0 rtl:bg-gradient-to-l ltr:left-0 ltr:bg-gradient-to-r"
          style={{ 
            WebkitMaskImage: i18n.language === 'ar' ? 'linear-gradient(to left, black 50%, transparent 100%)' : 'linear-gradient(to right, black 50%, transparent 100%)', 
            maskImage: i18n.language === 'ar' ? 'linear-gradient(to left, black 50%, transparent 100%)' : 'linear-gradient(to right, black 50%, transparent 100%)' 
          }}
        />
        
        {/* Mobile solid overlay so text is readable if screen is too small */}
        <div className="absolute inset-0 bg-[#4a1c24]/80 md:hidden z-0" />

        {/* Text Content */}
        <div className="relative z-10 w-full md:w-1/2 p-8 md:p-16 text-start ltr:mr-auto rtl:ml-auto">
          <div className="mb-4 inline-flex items-center justify-start text-brand-pink/90 text-sm font-medium w-full">
            <span className="w-8 h-[1px] bg-brand-pink/60 rtl:ml-3 ltr:mr-3"></span> {t('storyBanner.title')}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold font-arabic mb-4 leading-tight text-white">
            {t('storyBanner.heading1')} <br />
            {t('storyBanner.heading2')} <span className="text-brand-pink inline-block rtl:mr-1 ltr:ml-1 opacity-90">♡</span>
          </h2>
          
          <p className="text-white/90 mb-8 leading-relaxed max-w-md text-sm md:text-base">
            {t('storyBanner.description')}
          </p>
          
          <div className="flex justify-start">
            <Link to="/story" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#d96677] hover:bg-[#c25565] text-white rounded-full text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
              {t('storyBanner.cta')}
              <ArrowLeft className="w-5 h-5 rtl:mr-2 ltr:ml-2 ltr:-scale-x-100" />
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
}
