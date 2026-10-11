import { Smartphone, Lock, Eye, ArrowLeft, User, Heart, Truck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDF5F6] font-arabic lg:flex lg:flex-row-reverse relative">
      


      {/* Image Panel (Right on Desktop due to flex-row-reverse) */}
      <div className="hidden lg:flex lg:w-1/2 lg:max-w-[750px] xl:max-w-[850px] p-4 lg:p-4 z-20">
        <div className="w-full h-full relative overflow-hidden rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-[#FDF5F6]">
          
          <img src="/images/clean-bg.jpg" alt="Handmade crochet" className="absolute inset-0 w-full h-full object-cover object-bottom" />
          
          {/* Content Overlay for Logo and Text */}
          <div className="absolute inset-0 z-10 px-10 py-10 flex flex-col pointer-events-none">
            
            {/* Logo Section */}
            <div className="flex flex-col items-start" dir="ltr">
              <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 mt-2 text-primary drop-shadow-sm">
                  <path d="M12 21C12 21 17 18 17 13C17 9 14 7 12 7C10 7 7 9 7 13C7 18 12 21 12 21Z" fill="currentColor"/>
                  <circle cx="12" cy="7" r="4" fill="#d96677" />
                </svg>
                <div className="flex items-baseline relative">
                  <span className="font-handwriting text-primary text-[75px] leading-none drop-shadow-sm">S</span>
                  <span className="font-serif text-primary text-5xl font-semibold -ml-1 tracking-wide drop-shadow-sm">ect</span>
                </div>
              </div>
              <div className="text-text-dark text-[13px] tracking-wide mt-1 ml-10 flex items-center font-bold drop-shadow-sm">
                {t('auth.handmade')} <span className="text-primary text-sm mx-1">♡</span> {t('auth.withLove')}
              </div>
            </div>

            {/* Center Text */}
            <div className={`mt-6 ml-2 transform ${isRTL ? 'rotate-3' : '-rotate-3'}`}>
              <h1 className="font-handwriting text-white text-[75px] leading-[0.85] mb-6 drop-shadow-md" dir="ltr">
                Create<br/>
                Something<br/>
                Beautiful <span className="text-[50px] font-sans font-light">♡</span>
              </h1>
            </div>
          </div>
          
          {/* Footer Features Overlay */}
          <div className="absolute bottom-0 inset-x-0 pb-10 pt-4 flex justify-center z-10">
            <div className="flex w-[90%] max-w-[550px] justify-between text-center items-start">
              
              <div className="flex flex-col items-center flex-1">
                <Heart className="w-[30px] h-[30px] mb-3 text-[#9A3B50] stroke-[1.5]" />
                <span className="text-[15px] sm:text-[16px] font-bold leading-snug text-[#9A3B50] whitespace-pre-line">{t('features.details1Title')}</span>
              </div>
              
              <div className="w-[1.5px] h-12 bg-[#EACBD0] mt-2 opacity-70"></div>
              
              <div className="flex flex-col items-center flex-1">
                <Truck className="w-[30px] h-[30px] mb-3 text-[#9A3B50] stroke-[1.5]" />
                <span className="text-[15px] sm:text-[16px] font-bold leading-snug text-[#9A3B50] whitespace-pre-line">{t('features.shippingTitle')}</span>
              </div>
              
              <div className="w-[1.5px] h-12 bg-[#EACBD0] mt-2 opacity-70"></div>
              
              <div className="flex flex-col items-center flex-1">
                <ShieldCheck className="w-[30px] h-[30px] mb-3 text-[#9A3B50] stroke-[1.5]" />
                <span className="text-[15px] sm:text-[16px] font-bold leading-snug text-[#9A3B50] whitespace-pre-line">{t('features.paymentTitle')}</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Form Panel (Left on Desktop) */}
      <div className="flex-1 flex flex-col justify-center relative p-4 lg:p-4 z-10 min-h-screen">
        <div className="w-full h-full sm:max-w-md lg:max-w-[700px] xl:max-w-[800px] sm:mx-auto flex flex-col px-6 sm:px-16 py-10 relative z-10 rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Floral decorations for the form background */}
          <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-[0.15] z-0">
            <img src="/images/decorations/floral.png" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" />
          </div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-[0.15] mix-blend-multiply z-0">
            <img src="/images/decorations/floral.png" className={`w-full h-full object-cover ${isRTL ? '' : 'scale-x-[-1]'}`} alt="" />
          </div>

          <div className="my-auto sm:mx-auto sm:w-full w-full relative z-10">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-6 mt-2" dir="ltr">
              <div className="flex items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 mt-2 text-primary">
                  <path d="M12 21C12 21 17 18 17 13C17 9 14 7 12 7C10 7 7 9 7 13C7 18 12 21 12 21Z" fill="currentColor"/>
                  <circle cx="12" cy="7" r="4" fill="#d96677" />
                </svg>
                <div className="flex items-baseline relative">
                  <span className="font-handwriting text-primary text-5xl leading-none">S</span>
                  <span className="font-serif text-primary text-3xl font-semibold -ml-1 tracking-wide">ect</span>
                </div>
              </div>
              <div className="text-text-dark text-[10px] tracking-wide mt-1 flex items-center font-medium ml-6">
                {t('auth.withLove')} <span className="text-primary text-xs mx-1">♡</span> {t('auth.handmade')}
              </div>
            </div>

            {/* Headings */}
            <div className="mb-6 text-center">
              <h2 className="font-serif text-[30px] sm:text-[34px] font-bold text-primary italic mb-2 tracking-wide whitespace-nowrap flex items-center justify-center">
                {isRTL ? (
                  <>{t('auth.signupTitle')} <span className="text-[26px] mr-2">♡</span></>
                ) : (
                  <>{t('auth.signupTitle')} <span className="text-[26px] ml-2">♡</span></>
                )}
              </h2>
              <p className="text-[#6C5B5E] text-[14px] sm:text-[15px]">
                {t('auth.signupSubtitle')}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className={`block text-[15px] font-bold text-[#9A3B50] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.fullName')}
                </label>
                <div className="relative rounded-xl border border-[#DCDFE4] bg-[#F1F4F9] overflow-hidden transition-colors focus-within:border-[#9A3B50]">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                    <User className="h-[20px] w-[20px] text-[#9A3B50] stroke-[1.5]" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`block w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 text-[15px] outline-none bg-transparent placeholder-[#9A3B50] text-[#9A3B50] ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t('auth.fullNamePlaceholder')}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className={`block text-[15px] font-bold text-[#9A3B50] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.mobile')}
                </label>
                <div className="relative rounded-xl border border-[#DCDFE4] bg-[#F1F4F9] overflow-hidden transition-colors focus-within:border-[#9A3B50]">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                    <Smartphone className="h-[20px] w-[20px] text-[#9A3B50] stroke-[1.5]" />
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    className={`block w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 text-[15px] outline-none bg-transparent placeholder-[#9A3B50] text-[#9A3B50] ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t('auth.mobilePlaceholder')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={`block text-[15px] font-bold text-[#9A3B50] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.password')}
                </label>
                <div className="relative rounded-xl border border-[#DCDFE4] bg-[#F1F4F9] overflow-hidden transition-colors focus-within:border-[#9A3B50]">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                    <Lock className="h-[20px] w-[20px] text-[#9A3B50] stroke-[1.5]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`block w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3.5 text-[15px] outline-none bg-transparent placeholder-[#111827] text-[#111827] ${isRTL ? 'text-right' : 'text-left'} tracking-widest`}
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                  <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center cursor-pointer hover:opacity-80`}>
                    <Eye className="h-[20px] w-[20px] text-[#867577] stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className={`block text-[15px] font-bold text-[#9A3B50] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative rounded-xl border border-[#DCDFE4] bg-[#F1F4F9] overflow-hidden transition-colors focus-within:border-[#9A3B50]">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                    <Lock className="h-[20px] w-[20px] text-[#9A3B50] stroke-[1.5]" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    className={`block w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3.5 text-[15px] outline-none bg-transparent placeholder-[#111827] text-[#111827] ${isRTL ? 'text-right' : 'text-left'} tracking-widest`}
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                  <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center cursor-pointer hover:opacity-80`}>
                    <Eye className="h-[20px] w-[20px] text-[#867577] stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center justify-start mt-6 mb-2">
                <div className={`relative flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    defaultChecked
                    className="peer h-[18px] w-[18px] appearance-none rounded-md border border-[#9A3B50] bg-[#9A3B50] checked:bg-[#9A3B50] cursor-pointer shrink-0"
                  />
                  <svg className="absolute w-[12px] h-[12px] text-white pointer-events-none peer-checked:block hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <label htmlFor="terms" className="block text-[13px] font-medium text-[#7A6A6C] leading-tight">
                  {t('auth.agreeTo')} <a href="#!" onClick={(e) => e.preventDefault()} className="text-[#9A3B50] underline hover:opacity-80">{t('auth.terms')}</a> {t('auth.and')} <a href="#!" onClick={(e) => e.preventDefault()} className="text-[#9A3B50] underline hover:opacity-80">{t('auth.privacy')}</a>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-sm text-[16px] font-bold text-white bg-[#A94A5C] hover:bg-[#97394E] focus:outline-none transition-colors ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <span className={isRTL ? 'ml-2' : 'mr-2'}>
                    {isLoading ? (isRTL ? 'جاري التحميل...' : 'Loading...') : t('auth.signupBtn')}
                  </span>
                  <ArrowLeft className={`h-[20px] w-[20px] ${isRTL ? 'rotate-0' : 'rotate-180'}`} />
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pb-6 text-center text-[14px] font-medium">
              <span className="text-[#7A6A6C]">{t('auth.hasAccount')} </span>
              <Link to="/login" className="font-bold text-[#9A3B50] hover:opacity-80 transition-opacity">
                {t('auth.loginBtn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
