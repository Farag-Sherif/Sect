import { Mail, ArrowLeft } from 'lucide-react';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Newsletter() {
  const { t, i18n } = useTranslation();
  const [isSubscribed, setIsSubscribed] = useState(false);
  return (
    <section className="relative w-full z-20 overflow-x-clip">
      
      {/* Wavy Top Divider (Must be outside overflow-hidden) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -translate-y-[99%] text-[#2a1116] pointer-events-none">
        <svg className="relative block w-full h-[40px] sm:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="bg-[#2a1116] relative w-full overflow-hidden py-16 sm:py-24">
        {/* Background Image on Left with Fade Mask in RTL, Right in LTR */}
        <div className="absolute top-0 bottom-0 w-full md:w-[65%] z-0 rtl:left-0 ltr:right-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url('/images/backgrounds/cart-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitMaskImage: i18n.language === 'ar' ? 'linear-gradient(to right, black 20%, transparent 90%)' : 'linear-gradient(to left, black 20%, transparent 90%)',
              maskImage: i18n.language === 'ar' ? 'linear-gradient(to right, black 20%, transparent 90%)' : 'linear-gradient(to left, black 20%, transparent 90%)',
              opacity: 0.9
            }}
          />
          {/* Top Gradient Fade to blend with the wavy divider */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#2a1116] to-transparent pointer-events-none" />
        </div>

        {/* Decorative Floral Elements behind the text */}
        <img 
          src="/images/decorations/floral.webp" 
          alt=""
          className="absolute top-1/2 rtl:-right-6 sm:rtl:right-10 ltr:-left-6 sm:ltr:left-10 -translate-y-1/2 w-64 sm:w-80 opacity-30 sm:opacity-40 pointer-events-none rtl:-scale-x-100 max-w-none" 
          style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
        />

        {/* Content Container */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10 w-full">
          <div className="flex flex-col items-start text-start w-full lg:w-1/2 rtl:ml-auto ltr:mr-auto pt-4 sm:pt-8">
            
            {/* Title */}
            <div className="flex items-center justify-start gap-3 sm:gap-4 mb-3 sm:mb-4 w-full">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold font-arabic text-white">
                {t('newsletter.title')}
              </h2>
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white/90 stroke-[1.5] shrink-0" />
            </div>

            {/* Subtitle */}
            <p className="text-white/80 mb-6 sm:mb-10 max-w-[380px] text-sm sm:text-[15px] leading-relaxed font-medium">
              {t('newsletter.subtitle')}
            </p>

            {/* Form Pill */}
            {isSubscribed ? (
              <div className="flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full w-full max-w-[460px] h-[50px] sm:h-[54px] text-white font-bold border border-white/30 text-xs sm:text-sm px-4">
                {i18n.dir() === "rtl" ? "تم الاشتراك بنجاح!" : "Subscribed successfully!"}
              </div>
            ) : (
              <form 
                className="flex items-center bg-white rounded-full w-full max-w-[460px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-[50px] sm:h-[54px] p-1 sm:p-1.5 box-border" 
                onSubmit={async (e) => { 
                  e.preventDefault(); 
                  const form = e.currentTarget;
                  const input = form.querySelector('input') as HTMLInputElement;
                  if (input && input.value) {
                    try {
                      const { contactService } = await import('../../api/services');
                      await contactService.subscribeNewsletter(input.value);
                      setIsSubscribed(true); 
                      setTimeout(() => setIsSubscribed(false), 3000);
                    } catch (err) {
                      console.error('Newsletter error:', err);
                      setIsSubscribed(true); 
                      setTimeout(() => setIsSubscribed(false), 3000);
                    }
                  }
                }}
              >
                <input 
                  type="email" 
                  placeholder={t('newsletter.placeholder')} 
                  className="flex-1 min-w-0 bg-transparent border-none outline-none px-3.5 sm:px-6 text-start text-[#2a1116] placeholder-gray-400 font-medium text-xs sm:text-sm h-full"
                  required
                />
                <button 
                  type="submit" 
                  className="h-full px-4 sm:px-8 bg-[#d96677] text-white rounded-full font-bold text-xs sm:text-sm hover:bg-[#c25565] transition-transform active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 ltr:-scale-x-100" />
                  <span>{t('newsletter.button')}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
