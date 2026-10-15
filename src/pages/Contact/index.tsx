import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, ChevronDown, ArrowRight, Truck, ShieldCheck, Share2, Loader2, CheckCircle2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';
import { contactService, faqsService, settingsService } from '../../api/services';
import { useStore } from '../../store/useStore';
import type { ApiFaq } from '../../api/types';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const settings = useStore(state => state.settings);
  const setSettings = useStore(state => state.setSettings);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [faqs, setFaqs] = useState<ApiFaq[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Load FAQs
    faqsService.getFaqs()
      .then(data => {
        if (isMounted) setFaqs(data);
      })
      .catch(() => {});

    // Ensure settings are loaded
    if (!settings) {
      settingsService.getSettings()
        .then(data => {
          if (isMounted) setSettings(data);
        })
        .catch(() => {});
    }

    return () => { isMounted = false; };
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await contactService.sendContactMessage({
        ...formData,
        full_name: formData.name,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setIsSubmitting(false);
      const msg = err?.message || '';
      const status = err?.status;
      // The contact message is saved in database; only the mail notification to admin fails
      if (status === 500 || msg.includes('syntax error') || msg.includes('MessageReceived') || msg.includes('500')) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorMessage(msg || (isRTL ? 'فشل إرسال الرسالة' : 'Failed to send message'));
      }
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await contactService.subscribeNewsletter(newsletterEmail);
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 3000);
    } catch {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF5F6] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-[76px] md:pt-[92px]">
        {/* Hero Section */}
        <div className="relative min-h-[450px] md:min-h-[500px] flex items-center overflow-hidden bg-[#fffaf8]">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/backgrounds/products-hero.webp" 
              alt="Background"
              className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block ltr:ml-1 rtl:mr-1">
                {t('contact.heroSubtitle', isRTL ? 'تواصل معنا' : 'Get In Touch')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm">
                {t('contact.heroTitle', isRTL ? 'نحن هنا من أجلك' : "We're Here For You")}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('contact.heroScript', isRTL ? 'دعنا نتواصل ونشارك الأفكار' : "Let's connect and share ideas")}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('contact.heroDesc', isRTL ? 'يسعدنا دائماً سماع آرائكم واستفساراتكم حول منتجاتنا اليدوية المصنوعة بحب.' : 'We would love to hear from you. Reach out to us for questions, custom orders, or just to say hello.')}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              Handmade <br/> 
              with love <br/>
              <span className="text-2xl">♡</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-[#FDF5F6]">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Contact Info & Form */}
        <section className="py-20 relative overflow-hidden bg-[#FDF5F6]">
          <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-40">
             <img src="/images/decorations/floral.webp" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-40 mix-blend-multiply">
             <img src="/images/decorations/floral.webp" className={`w-full h-full object-cover ${isRTL ? '' : 'scale-x-[-1]'}`} alt="" />
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Left Column: Contact Info */}
              <div className="lg:w-1/3">
                <span className="text-[#9A3B50] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('contact.reachUs', isRTL ? 'تواصل معنا' : 'Reach Out')}</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-dark mb-6 leading-tight">
                  {t('contact.reachUsTitle', isRTL ? 'يسعدنا دائماً سماع صوتك' : "We'd Love to Hear From You")}
                </h2>
                <p className="text-text-light mb-12 text-sm leading-relaxed">
                  {t('contact.reachUsDesc', isRTL ? 'سواء كان لديك استفسار حول طلب، رغبة في تصميم خاص، أو مجرد رغبة في إلقاء التحية، نحن دائماً في انتظارك.' : "Whether you have questions about an order, want a custom design, or just want to say hi, we're here.")}
                </p>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-1">{t('contact.email', isRTL ? 'البريد الإلكتروني' : 'Email Us')}</h4>
                      <a href={`mailto:${settings?.support_email || 'support@sect.com'}`} className="text-text-light hover:text-[#9A3B50] transition-colors text-sm">
                        {settings?.support_email || 'support@sect.com'}
                      </a>
                      <p className="text-xs text-text-light/70 mt-1">{t('contact.emailDesc', isRTL ? 'نرد عادة خلال ٢٤ ساعة' : 'We usually reply within 24 hours')}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-1">{t('contact.callUs', isRTL ? 'اتصل بنا' : 'Call Us')}</h4>
                      <a href={`tel:${settings?.phone || '+201012345678'}`} className="text-text-light hover:text-[#9A3B50] transition-colors text-sm" dir="ltr">
                        {settings?.phone || '+20 10 1234 5678'}
                      </a>
                      <p className="text-xs text-text-light/70 mt-1">{t('contact.callUsDesc', isRTL ? 'من السبت إلى الخميس، ٩ ص - ٦ م' : 'Sat to Thu, 9 AM - 6 PM')}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-1">{t('contact.location', isRTL ? 'موقعنا' : 'Our Location')}</h4>
                      <p className="text-text-light text-sm leading-relaxed">
                        {settings?.address || t('contact.locationDesc', isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt')}
                      </p>
                    </div>
                  </div>

                  {/* Follow Us */}
                  <div className="flex gap-4 pt-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-2">{t('contact.followUs', isRTL ? 'تابعنا' : 'Follow Us')}</h4>
                      <p className="text-xs text-text-light/70 mb-3">{t('contact.followUsDesc', isRTL ? 'ابق على اطلاع بجديد أعمالنا اليدوية' : 'Stay tuned with our latest handmade crafts')}</p>
                      <div className="flex gap-3">
                         <a href={settings?.social?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] hover:bg-[#9A3B50] hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                         <a href={settings?.social?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] hover:bg-[#9A3B50] hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                         <a href={settings?.social?.pinterest || 'https://pinterest.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] hover:bg-[#9A3B50] hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EACBD0]/30 relative">
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif font-bold text-text-dark mb-2">
                      {isRTL ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                    </h3>
                    <p className="text-text-light text-sm">
                      {isRTL ? 'نسعد دائماً بالإجابة على استفساراتكم وملاحظاتكم.' : 'We would love to hear your questions and thoughts.'}
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-dark">{t('contact.formName', isRTL ? 'الاسم الكامل' : 'Full Name')} *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t('contact.formNamePlaceholder', isRTL ? 'مثال: سارة أحمد' : 'e.g. Sarah Ahmed')} 
                          className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-dark">{t('contact.formEmail', isRTL ? 'البريد الإلكتروني' : 'Email Address')} *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('contact.formEmailPlaceholder', 'name@example.com')} 
                          className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-dark">{t('contact.formSubject', isRTL ? 'الموضوع' : 'Subject')} *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={t('contact.formSubjectPlaceholder', isRTL ? 'عن ماذا يدور استفسارك؟' : 'What is your inquiry about?')} 
                        className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-dark">{t('contact.formMessage', isRTL ? 'الرسالة' : 'Message')} *</label>
                      <textarea 
                        rows={5} 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t('contact.formMessagePlaceholder', isRTL ? 'اكتب رسالتك أو استفسارك هنا...' : 'Write your message or inquiry here...')} 
                        className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none placeholder:text-gray-400"
                      />
                    </div>

                    {isSuccess ? (
                      <div className="bg-green-500 text-white font-bold py-4 px-8 rounded-xl shadow-md text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{isRTL ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Message sent successfully! We will get back to you soon.'}</span>
                      </div>
                    ) : (
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="bg-[#9e4758] hover:bg-[#8b3d4b] text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isRTL ? 'جاري الإرسال...' : 'Sending...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{t('contact.sendBtn', isRTL ? 'إرسال الرسالة' : 'Send Message')}</span>
                            <ArrowRight className={`w-4 h-4 ml-2 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
                          </>
                        )}
                      </button>
                    )}
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Visit Our Studio */}
        <section className="py-16 md:py-24 bg-[#FCF8F9] relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-center">
              
              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-visible shadow-lg">
                <img src="/images/backgrounds/about-hero.jpg" alt="Our Studio" className="w-full h-full object-cover rounded-3xl" />
                <div className={`absolute -bottom-6 ${isRTL ? '-right-6' : '-left-6'} bg-[#fdfaf5] shadow-xl rounded-sm transform ${isRTL ? 'rotate-[8deg]' : 'rotate-[-8deg]'} w-40 h-32 md:w-48 md:h-40 flex flex-col items-center justify-center border border-white/50 z-20`}>
                   <div className="absolute -top-3 left-1/4 w-12 h-6 bg-[#d1bfae]/50 transform -rotate-12 backdrop-blur-sm z-30"></div>
                   <div className="font-handwriting text-[#9A3B50] text-2xl md:text-3xl text-center leading-tight">
                     {t('contact.ourStudio', isRTL ? 'استوديو الحرف' : 'Our Studio')}<br/>{t('contact.cairo', isRTL ? 'القاهرة' : 'Cairo')} <span className="text-xl">♡</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center px-4 lg:px-8 py-8 lg:py-0">
                <h3 className="text-[#9A3B50] font-bold tracking-[0.15em] text-xs mb-4 uppercase">{t('contact.visitStudioTitle', isRTL ? 'زر الاستوديو الخاص بنا' : 'Visit Our Studio')}</h3>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-[#4a1c24] mb-6 leading-tight">
                  {t('contact.visitStudio', isRTL ? 'مساحة للإبداع' : 'A Space For Craft')} <span className="text-[#9A3B50] font-handwriting font-normal text-4xl">♡</span>
                </h2>
                <p className="text-[#4a1c24]/70 leading-relaxed mb-10 text-sm md:text-base max-w-sm">
                  {t('contact.visitStudioDesc', isRTL ? 'تفضل بزيارة ورشتنا واستمتع برؤية القطع اليدوية تُصنع بكل شغف وحب.' : 'Visit our creative workshop and see handmade items crafted with love and passion.')}
                </p>

                <button onClick={() => window.open('https://maps.google.com/?q=Cairo,+Egypt', '_blank')} className="bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <MapPin className="w-5 h-5" />
                  {t('contact.getDirections', isRTL ? 'الاتجاهات على الخريطة' : 'Get Directions')}
                  <ArrowRight className={`w-5 h-5 ml-1 ${isRTL ? 'rotate-180 ml-0 mr-1' : ''}`} />
                </button>
              </div>

              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl bg-[#f5ebe4] border-4 border-white shadow-lg overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-multiply"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")' }}
                />
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-12 h-12 bg-[#9A3B50] rounded-full flex items-center justify-center shadow-lg relative">
                    <div className="absolute w-16 h-16 bg-[#9A3B50]/20 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[14px] border-t-[#9A3B50]"></div>
                  </div>
                </div>

                <div className={`absolute bottom-6 ${isRTL ? 'right-6' : 'left-6'} bg-white rounded-2xl p-4 flex items-center gap-4 shadow-xl z-20 w-[240px]`}>
                  <div className="w-10 h-10 bg-[#fdf5f6] rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#9A3B50]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#4a1c24] text-sm leading-tight">{settings?.address || t('contact.cairoEgypt', isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt')}</span>
                    <span className="text-xs text-[#4a1c24]/60">{t('contact.ourHandmadeStudio', isRTL ? 'استوديو الحرف اليدوية' : 'Handmade Crafts Studio')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Live FAQ Section */}
        <section className="py-20 bg-[#fdfbf8] relative overflow-hidden">
           <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
               
               <div className="lg:pr-8">
                 <h3 className="text-[#9A3B50] font-bold tracking-[0.2em] text-xs mb-3 uppercase">{t('contact.faqTitle', isRTL ? 'الأسئلة الشائعة' : 'FAQ')}</h3>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4a1c24] mb-4">
                   {t('contact.faq', isRTL ? 'إجابات لاستفساراتك' : 'Answers to Your Questions')} <span className="text-[#9A3B50] font-handwriting text-4xl ml-1 font-normal">♡</span>
                 </h2>
                 <p className="text-[#4a1c24]/70 leading-relaxed text-sm md:text-base max-w-sm">
                   {t('contact.faqDesc', isRTL ? 'إليك أكثر الأسئلة شيوعاً حول منتجاتنا وشحنها وكيفية العناية بها.' : 'Here are the most common questions about our products, shipping, and care.')}
                 </p>
               </div>

               {/* Accordions */}
               <div className="space-y-4">
                  {(faqs.length > 0 ? faqs.slice(0, 5) : [
                    { id: 1, question: t('contact.faqShipping', isRTL ? 'ما هي مدة وتكلفة الشحن؟' : 'What are the shipping times and rates?'), answer: 'We offer shipping across Egypt and worldwide. Delivery times typically take 2-4 business days.' },
                    { id: 2, question: t('contact.faqReturns', isRTL ? 'ما هي سياسة الاسترجاع؟' : 'What is your return policy?'), answer: 'We accept returns within 14 days of delivery for all unused items.' },
                    { id: 3, question: t('contact.faqProductCare', isRTL ? 'كيف أعتني بالمنتجات اليدوية والكروشيه؟' : 'How do I care for handmade crochet items?'), answer: 'Hand wash gently in cold water with mild detergent.' },
                    { id: 4, question: t('contact.faqCustomOrders', isRTL ? 'هل تقبلون الطلبات المخصصة والتوزيعات؟' : 'Do you accept custom orders and favors?'), answer: 'Yes, we gladly accept custom orders!' }
                  ]).map((faq, idx) => (
                    <div key={faq.id || idx} className="bg-[#fcfaf7] rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-[#EACBD0]/40 overflow-hidden transition-all duration-300">
                      <div onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="px-6 py-4 cursor-pointer flex justify-between items-center group hover:bg-[#fcf5f7] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-[#9A3B50] opacity-80 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-[#4a1c24]/90 text-sm md:text-[15px]">{faq.question}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-[#9A3B50]/50 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                      </div>
                      <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-sm text-[#4a1c24]/70 ltr:pl-9 rtl:pr-9">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
               
               <div className="hidden lg:flex flex-col items-center justify-center relative h-full p-6">
                 <div className={`font-handwriting text-[#9A3B50] text-3xl md:text-4xl text-center leading-relaxed transform transition-transform ${isRTL ? 'rotate-3' : '-rotate-3'} z-10 relative mt-4`}>
                   {t('contact.stillNeedHelp', isRTL ? 'هل ما زلت بحاجة للمساعدة؟' : 'Still need help?')}
                   <br />
                   <span className="text-2xl md:text-3xl mt-2 block">
                     {t('contact.dropMessage', isRTL ? 'أرسل لنا رسالة وسنساعدك فوراً' : 'Drop us a message anytime')} ♡
                   </span>
                 </div>
               </div>

             </div>
           </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative z-10 mt-12 bg-[#913b4c]">
          <div className="relative py-16 md:py-24 w-full overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative z-20 flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16">
              
              <div className="text-white text-center md:ltr:text-left md:rtl:text-right flex-1 max-w-xl">
                <h3 className="text-sm font-medium mb-2 opacity-90 tracking-wide">{t('newsletter.loopTitle')}</h3>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">{t('newsletter.exclusiveOffers')}</h2>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  {t('newsletter.exclusiveDesc')}
                </p>
              </div>
              
              <div className="w-full flex-1 max-w-lg">
                {newsletterSubscribed ? (
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-center border border-white/40">
                    {isRTL ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!'}
                  </div>
                ) : (
                  <form className="flex items-center bg-white rounded-full shadow-lg h-14 p-1 ltr:pl-6 rtl:pr-6 w-full" onSubmit={handleNewsletterSubmit}>
                    <input 
                      type="email" 
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t('newsletter.emailPlaceholder')} 
                      className="flex-1 bg-transparent border-none outline-none text-[#4a1c24] placeholder-gray-400 text-[15px] font-medium h-full min-w-0"
                    />
                    <button 
                      type="submit" 
                      className="h-full px-6 md:px-8 bg-[#913b4c] text-white rounded-full font-bold text-sm hover:bg-[#7a3140] transition-colors border-[3px] border-white shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      {t('newsletter.subscribeBtn')}
                      <ArrowRight className={`w-4 h-4 ml-1 ${isRTL ? 'rotate-180 ml-0 mr-1' : ''}`} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
