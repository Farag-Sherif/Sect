import { Mail, Lock, Eye, EyeOff, ArrowLeft, Heart, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../api/services';
import { useStore } from '../../store/useStore';

export default function Login() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(isRTL ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      if (res.user && res.token) {
        setAuth(res.user, res.token);
        navigate('/');
      } else {
        throw new Error(isRTL ? 'فشل تسجيل الدخول' : 'Login failed');
      }
    } catch (err: any) {
      setError(err?.message || (isRTL ? 'فشل تسجيل الدخول، تأكد من صحة البيانات' : 'Login failed. Please check credentials.'));
    } finally {
      setIsLoading(false);
    }
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
            <img src="/images/decorations/floral.webp" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" />
          </div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-[0.15] mix-blend-multiply z-0">
            <img src="/images/decorations/floral.webp" className={`w-full h-full object-cover ${isRTL ? '' : 'scale-x-[-1]'}`} alt="" />
          </div>

          <div className="my-auto sm:mx-auto sm:w-full w-full relative z-10">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8 mt-4" dir="ltr">
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
            <div className="mb-8 text-center">
              <h2 className="font-serif text-[34px] font-bold text-primary italic mb-2 tracking-wide whitespace-nowrap flex items-center justify-center">
                {isRTL ? (
                  <>{t('auth.loginTitle')} <span className="text-[26px] mr-2">♡</span></>
                ) : (
                  <>{t('auth.loginTitle')} <span className="text-[26px] ml-2">♡</span></>
                )}
              </h2>
              <p className="text-[#6C5B5E] text-[15px]">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              
              {/* Email Address */}
              <div>
                <label htmlFor="email" className={`block text-[15px] font-bold text-[#9A3B50] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.email', 'البريد الإلكتروني')}
                </label>
                <div className="relative rounded-xl border border-[#DCDFE4] bg-[#F1F4F9] overflow-hidden transition-colors focus-within:border-[#9A3B50]">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                    <Mail className="h-[20px] w-[20px] text-[#9A3B50] stroke-[1.5]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`block w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 text-[15px] outline-none bg-transparent placeholder-[#9A3B50]/60 text-[#333] ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t('auth.emailPlaceholder', 'name@example.com')}
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`block w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3.5 text-[15px] outline-none bg-transparent placeholder-[#111827] text-[#111827] ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center cursor-pointer hover:opacity-80 text-[#867577]`}
                  >
                    {showPassword ? <EyeOff className="h-[20px] w-[20px] stroke-[1.5]" /> : <Eye className="h-[20px] w-[20px] stroke-[1.5]" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between mt-6 mb-2">
                <div className="text-[14px] font-medium">
                  <a href="#!" onClick={(e) => e.preventDefault()} className="text-[#9A3B50] hover:opacity-80 underline underline-offset-2">
                    {t('auth.forgotPassword')}
                  </a>
                </div>

                <div className="flex items-center">
                  <label htmlFor="remember-me" className={`block text-[14px] font-medium text-[#7A6A6C] ${isRTL ? 'ml-2' : 'mr-2'}`}>
                    {t('auth.rememberMe')}
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      defaultChecked
                      className="peer h-[18px] w-[18px] appearance-none rounded-md border border-[#9A3B50] bg-[#9A3B50] checked:bg-[#9A3B50] cursor-pointer shrink-0"
                    />
                    <svg className="absolute w-[12px] h-[12px] text-white pointer-events-none peer-checked:block hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-sm text-[16px] font-bold text-white bg-[#A94A5C] hover:bg-[#97394E] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" />
                  ) : (
                    <>
                      <span className={isRTL ? 'ml-2' : 'mr-2'}>
                        {t('auth.loginBtn')}
                      </span>
                      <ArrowLeft className={`h-[20px] w-[20px] ${isRTL ? 'rotate-0' : 'rotate-180'}`} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pb-6 text-center text-[14px] font-medium">
              <span className="text-[#7A6A6C]">{t('auth.noAccount')} </span>
              <Link to="/signup" className="font-bold text-[#9A3B50] hover:opacity-80 transition-opacity">
                {t('auth.signupBtn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
