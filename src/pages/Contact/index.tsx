// @ts-ignore
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ChevronDown, Map, ArrowRight, Truck, ShieldCheck, Share2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDF5F6] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-[76px] md:pt-[92px]">
                        {/* Hero Section */}
        <div className="relative min-h-[450px] md:min-h-[500px] flex items-center overflow-hidden bg-[#fffaf8]">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/backgrounds/products-hero.png" 
              alt="Background"
              className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-sm font-bold tracking-wider uppercase mb-4 block ltr:ml-1 rtl:mr-1">
                {t('contact.heroSubtitle')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-4 drop-shadow-sm">
                {t('contact.heroTitle')}
              </h1>
              <h2 className="text-2xl md:text-3xl text-[#913b4c] font-sans font-medium mb-6 drop-shadow-sm leading-snug">
                {t('contact.heroScript')}
              </h2>
              <p className="text-[#4a1c24]/80 text-base md:text-lg leading-relaxed max-w-lg font-medium mb-8">
                {t('contact.heroDesc')}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              Handmade <br/> 
              with love <br/>
              <svg className="w-6 h-6 inline-block mt-2 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
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
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-40">
             <img src="/images/decorations/floral.png" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-40 mix-blend-multiply">
             <img src="/images/decorations/floral.png" className={`w-full h-full object-cover ${isRTL ? '' : 'scale-x-[-1]'}`} alt="" />
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Left Column: Contact Info */}
              <div className="lg:w-1/3">
                <span className="text-[#9A3B50] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('contact.reachUs')}</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-dark mb-6 leading-tight">
                  {t('contact.reachUsTitle')}
                </h2>
                <p className="text-text-light mb-12 text-sm leading-relaxed">
                  {t('contact.reachUsDesc')}
                </p>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-1">{t('contact.email')}</h4>
                      <a href="mailto:hello@sect.com" className="text-text-light hover:text-[#9A3B50] transition-colors text-sm">hello@sect.com</a>
                      <p className="text-xs text-text-light/70 mt-1">{t('contact.emailDesc')}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-1">{t('contact.callUs')}</h4>
                      <a href="tel:+201234567890" className="text-text-light hover:text-[#9A3B50] transition-colors text-sm ltr:font-sans rtl:font-sans" dir="ltr">+20 12 3456 7890</a>
                      <p className="text-xs text-text-light/70 mt-1">{t('contact.callUsDesc')}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-1">{t('contact.location')}</h4>
                      <p className="text-text-light text-sm leading-relaxed">{t('contact.locationDesc')}</p>
                    </div>
                  </div>

                  {/* Follow Us */}
                  <div className="flex gap-4 pt-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5 text-[#9A3B50]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark mb-2">{t('contact.followUs')}</h4>
                      <p className="text-xs text-text-light/70 mb-3">{t('contact.followUsDesc')}</p>
                      <div className="flex gap-3">
                         <a href="#!" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] hover:bg-[#9A3B50] hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                         <a href="#!" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] hover:bg-[#9A3B50] hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                         <a href="#!" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white border border-[#EACBD0] flex items-center justify-center text-[#9A3B50] hover:bg-[#9A3B50] hover:text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EACBD0]/30 relative">
                  <div className="absolute top-6 ltr:right-8 rtl:left-8 pointer-events-none hidden md:flex items-center gap-3 transform ltr:rotate-[-5deg] rtl:rotate-[5deg] opacity-80">
                    <div className="font-handwriting text-[#9A3B50] text-2xl flex flex-col items-center">
                      <span>{t('contact.wedLove')}</span>
                      <span>{t('contact.toHear')}</span>
                      <span>{t('contact.fromYou')} <span className="text-xl">{isRTL ? "؟" : "?"}</span></span>
                    </div>
                    <div className="relative text-[#9A3B50]">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <span className="text-[#9A3B50] font-bold tracking-[0.15em] text-xs mb-3 block uppercase">{t('contact.dropLine')}</span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text-dark mb-2">
                    {t('contact.dropLineTitle')}
                  </h3>
                  <p className="text-text-light mb-8 text-sm max-w-md">
                    {t('contact.dropLineDesc')}
                  </p>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-dark">{t('contact.formName')} *</label>
                        <input type="text" className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-dark">{t('contact.formEmail')} *</label>
                        <input type="email" className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" dir="ltr" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-dark">{t('contact.formSubject')} *</label>
                      <div className="relative">
                        <select className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none text-gray-500 cursor-pointer">
                          <option value="" disabled selected>{t('contact.formSubjectPlaceholder')}</option>
                          <option value="general">{t('contact.formSubjectGeneral')}</option>
                          <option value="order">{t('contact.formSubjectOrder')}</option>
                          <option value="custom">{t('contact.formSubjectCustom')}</option>
                          <option value="other">{t('contact.formSubjectOther')}</option>
                        </select>
                        <div className="absolute inset-y-0 ltr:right-4 rtl:left-4 flex items-center pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-dark">{t('contact.formMessage')} *</label>
                      <textarea rows={5} placeholder={t('contact.formMessagePlaceholder')} className="w-full bg-[#FCF8F9] border border-[#EACBD0]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none placeholder:text-gray-400"></textarea>
                    </div>

                    {isSuccess ? (
                      <div className="bg-green-500 text-white font-bold py-4 px-8 rounded-xl shadow-md text-center">
                        {isRTL ? 'تم الإرسال بنجاح!' : 'Message sent successfully!'}
                      </div>
                    ) : (
                      <button type="submit" disabled={isSubmitting} className="bg-[#9e4758] hover:bg-[#8b3d4b] text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? (isRTL ? '???? ???????...' : 'Sending...') : t('contact.sendBtn')}
                        <ArrowRight className={`w-4 h-4 ml-2 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
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
          {/* Wave divider at top */}
          <div className="absolute top-0 left-0 right-0 transform -translate-y-[99%] z-10">
            <svg viewBox="0 0 1440 120" className="w-full h-auto text-[#FCF8F9]" fill="currentColor" preserveAspectRatio="none">
              <path d="M0,0 C240,100 480,100 720,50 C960,0 1200,0 1440,50 L1440,120 L0,120 Z"></path>
            </svg>
          </div>

          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-center">
              
              {/* Left: Studio Image */}
              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-visible shadow-lg">
                <img src="/images/backgrounds/about-hero.jpg" alt="Our Studio" className="w-full h-full object-cover rounded-3xl" />
                
                {/* Polaroid-style paper */}
                <div className={`absolute -bottom-6 ${isRTL ? '-right-6' : '-left-6'} bg-[#fdfaf5] shadow-xl rounded-sm transform ${isRTL ? 'rotate-[8deg]' : 'rotate-[-8deg]'} w-40 h-32 md:w-48 md:h-40 flex flex-col items-center justify-center border border-white/50 z-20`}>
                   {/* Tape */}
                   <div className="absolute -top-3 left-1/4 w-12 h-6 bg-[#d1bfae]/50 transform -rotate-12 backdrop-blur-sm z-30"></div>
                   
                   <div className="font-handwriting text-[#9A3B50] text-2xl md:text-3xl text-center leading-tight">
                     {t('contact.ourStudio')}<br/>{t('contact.cairo')} <span className="text-xl">{isRTL ? "؟" : "?"}</span>
                   </div>
                   {/* Small heart doodles */}
                   <div className="absolute top-4 right-4 text-[#9A3B50] opacity-60 text-xs">{isRTL ? "؟" : "?"}</div>
                   <div className="absolute bottom-4 left-4 text-[#9A3B50] opacity-60 text-xs">{isRTL ? "؟" : "?"}</div>
                </div>
              </div>

              {/* Center: Text & Button */}
              <div className="flex flex-col items-center text-center px-4 lg:px-8 py-8 lg:py-0">
                <h3 className="text-[#9A3B50] font-bold tracking-[0.15em] text-xs mb-4 uppercase">{t('contact.visitStudioTitle')}</h3>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-[#4a1c24] mb-6 leading-tight">
                  {t('contact.visitStudio')} <span className="text-[#9A3B50] font-handwriting font-normal text-4xl">{isRTL ? "؟" : "?"}</span>
                </h2>
                <p className="text-[#4a1c24]/70 leading-relaxed mb-10 text-sm md:text-base max-w-sm">
                  {t('contact.visitStudioDesc')}
                </p>

                <button onClick={() => window.open('https://maps.google.com/?q=Cairo,+Egypt', '_blank')} className="bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t('contact.getDirections')}
                  <ArrowRight className={`w-5 h-5 ml-1 ${isRTL ? 'rotate-180 ml-0 mr-1' : ''}`} />
                </button>
              </div>

              {/* Right: Map Container */}
              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl bg-[#f5ebe4] border-4 border-white shadow-lg overflow-hidden">
                {/* Simulated Map Background */}
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-multiply"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")' }}
                />
                
                {/* Big Map Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-12 h-12 bg-[#9A3B50] rounded-full flex items-center justify-center shadow-lg relative">
                    <div className="absolute w-16 h-16 bg-[#9A3B50]/20 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    {/* Pin tail */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[14px] border-t-[#9A3B50]"></div>
                  </div>
                </div>

                {/* Floating Info Card */}
                <div className={`absolute bottom-6 ${isRTL ? 'right-6' : 'left-6'} bg-white rounded-2xl p-4 flex items-center gap-4 shadow-xl z-20 w-[240px]`}>
                  <div className="w-10 h-10 bg-[#fdf5f6] rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#9A3B50]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#4a1c24] text-sm leading-tight">{t('contact.cairoEgypt')}</span>
                    <span className="text-xs text-[#4a1c24]/60">{t('contact.ourHandmadeStudio')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Floral Decoration */}
          <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-0' : 'right-0'} opacity-60 pointer-events-none z-0 hidden lg:block w-32 h-48`}>
             <img src="/images/decorations/floral.png" className={`w-full h-full object-contain ${isRTL ? '' : 'scale-x-[-1]'}`} alt="" />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[#fdfbf8] relative overflow-hidden">
           <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
               
               {/* Left: Title */}
               <div className="lg:pr-8">
                 <h3 className="text-[#9A3B50] font-bold tracking-[0.2em] text-xs mb-3 uppercase">{t('contact.faqTitle')}</h3>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4a1c24] mb-4">
                   {t('contact.faq')} <span className="text-[#9A3B50] font-handwriting text-4xl ml-1 font-normal">{isRTL ? "؟" : "?"}</span>
                 </h2>
                 <p className="text-[#4a1c24]/70 leading-relaxed text-sm md:text-base max-w-sm">
                   {t('contact.faqDesc')}
                 </p>
               </div>

               {/* Middle: Accordions */}
                               <div className="space-y-4">
                  {[
                    { q: t('contact.faqShipping'), a: 'We offer worldwide shipping. Orders are usually processed within 2-3 business days. Delivery times vary by location.' },
                    { q: t('contact.faqReturns'), a: 'We accept returns within 14 days of delivery. Items must be unused and in original packaging.' },
                    { q: t('contact.faqProductCare'), a: 'Hand wash gently in cold water with mild detergent. Lay flat to dry out of direct sunlight.' },
                    { q: t('contact.faqCustomOrders'), a: 'Yes, we accept custom orders! Please send us a message with your specific requirements and we will get back to you.' }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-[#fcfaf7] rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-[#EACBD0]/40 overflow-hidden transition-all duration-300">
                      <div onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="px-6 py-4 cursor-pointer flex justify-between items-center group hover:bg-[#fcf5f7] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-[#9A3B50] opacity-80 flex items-center justify-center">
                            {idx === 0 && <Truck className="w-5 h-5" />}
                            {idx === 1 && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>}
                            {idx === 3 && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/><rect x="14" y="2" width="8" height="8" rx="2"/></svg>}
                            {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                          </div>
                          <span className="font-medium text-[#4a1c24]/90 text-sm md:text-[15px]">{faq.q}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-[#9A3B50]/50 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                      </div>
                      <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-sm text-[#4a1c24]/70 ltr:pl-9 rtl:pr-9">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
               
               {/* Right: Doodle & Flower */}
                 <div className="hidden lg:flex flex-col items-center justify-center relative h-full p-6">
                   <div className={`font-handwriting text-[#9A3B50] text-3xl md:text-4xl text-center leading-relaxed transform transition-transform ${isRTL ? 'rotate-3' : '-rotate-3'} z-10 relative mt-4`}>
                     {t('contact.stillNeedHelp')}
                     <br />
                     <span className="text-2xl md:text-3xl mt-2 block">
                       {t('contact.dropMessage')} {isRTL ? "؟" : "?"}
                     </span>
                   </div>
                   
                   {/* Floral background decoration behind text */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none w-48 h-48 z-0">
                     <img src="/images/decorations/floral.png" className={`w-full h-full object-contain ${isRTL ? 'scale-x-[-1]' : ''}`} alt="" style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(50%) saturate(884%) hue-rotate(307deg) brightness(96%) contrast(92%)' }} />
                   </div>
                 </div>

             </div>
           </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative z-10 mt-12 bg-[#913b4c]">
          {/* Wave Top Divider */}
          <div className="absolute top-0 left-0 right-0 transform -translate-y-[99%] text-[#913b4c]">
            <svg className="w-full h-12 md:h-16 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="rotate-180 origin-center"></path>
            </svg>
          </div>

          <div className="relative py-16 md:py-24 w-full overflow-hidden">
            {/* Yarn Background */}
            <div className="absolute ltr:right-[-50px] rtl:left-[-50px] top-1/2 -translate-y-1/2 w-64 md:w-[450px] opacity-20 pointer-events-none mix-blend-multiply hidden md:block">
               <img 
                 src="/images/decorations/red-yarn.jpg" 
                 className="w-full h-auto object-contain drop-shadow-xl" 
                 style={{ 
                   filter: 'contrast(1.15) brightness(1.05)',
                   WebkitMaskImage: 'radial-gradient(circle closest-side, black 80%, transparent 100%)', 
                   maskImage: 'radial-gradient(circle closest-side, black 80%, transparent 100%)' 
                 }}
                 alt="Yarn" 
               />
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative z-20 flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16">
              
              {/* Newsletter Content */}
              <div className="text-white text-center md:ltr:text-left md:rtl:text-right flex-1 max-w-xl">
                <h3 className="text-sm font-medium mb-2 opacity-90 tracking-wide">{t('newsletter.loopTitle')}</h3>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">{t('newsletter.exclusiveOffers')}</h2>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  {t('newsletter.exclusiveDesc')}
                </p>
              </div>
              
              {/* Form */}
              <div className="w-full flex-1 max-w-lg">
                <form className="flex items-center bg-white rounded-full shadow-lg h-14 p-1 ltr:pl-6 rtl:pr-6 w-full" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder={t('newsletter.emailPlaceholder')} 
                    className="flex-1 bg-transparent border-none outline-none text-[#4a1c24] placeholder-gray-400 text-[15px] font-medium h-full min-w-0"
                    required
                  />
                  <button 
                    type="submit" 
                    className="h-full px-6 md:px-8 bg-[#913b4c] text-white rounded-full font-bold text-sm hover:bg-[#7a3140] transition-colors border-[3px] border-white shadow-sm flex items-center justify-center gap-2 shrink-0"
                  >
                    {t('newsletter.subscribeBtn')}
                    <ArrowRight className={`w-4 h-4 ml-1 ${isRTL ? 'rotate-180 ml-0 mr-1' : ''}`} />
                  </button>
                </form>
              </div>
            </div>
            
            {/* Floral background decoration */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none w-48 hidden lg:block">
               <img src="/images/decorations/floral.png" className={`w-full h-auto object-contain ${isRTL ? 'scale-x-[-1]' : ''}`} style={{ filter: 'brightness(0) invert(1)' }} alt="" />
            </div>
          </div>
          
        </section>

      </main>
      
      <Footer />
    </div>
  );
}


