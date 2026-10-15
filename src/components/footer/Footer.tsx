import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

export default function Footer() {
  const { t } = useTranslation();
  const settings = useStore(state => state.settings);

  const socials = [
    { 
      name: 'Facebook', 
      url: settings?.social?.facebook || 'https://facebook.com',
      icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> 
    },
    { 
      name: 'Instagram', 
      url: settings?.social?.instagram || 'https://instagram.com',
      icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> 
    },
    { 
      name: 'Pinterest', 
      url: settings?.social?.pinterest || 'https://pinterest.com',
      icon: <><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></> 
    },
  ];

  return (
    <footer className="text-white relative z-20">
      
      {/* Wavy SVG Top Divider (Must be outside the overflow-hidden container) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -translate-y-[99%] text-[#161616]">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Main Footer Content Container (Clips overflowing florals to prevent horizontal scroll) */}
      <div className="bg-[#161616] relative w-full overflow-hidden">
        
        {/* Decorative Floral Elements */}
        <img 
          src="/images/decorations/floral.webp" 
          alt=""
          className="absolute top-10 ltr:-left-16 rtl:-right-16 w-56 opacity-80 pointer-events-none ltr:scale-x-[-1]" 
          style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
        />
        <img 
          src="/images/decorations/floral.webp" 
          alt=""
          className="absolute bottom-10 ltr:-right-16 rtl:-left-16 w-56 opacity-80 pointer-events-none rtl:scale-x-[-1]" 
          style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(306%) hue-rotate(314deg) brightness(85%) contrast(85%)' }}
        />

        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-24 relative z-10 pt-16 pb-6">
        
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-10 mb-12">
          
          {/* Column 1: Logo */}
          <div className="w-full sm:w-auto flex-shrink-0 text-start">
            <Link to="/" className="inline-block">
              <h2 className="text-4xl font-bold text-white font-serif tracking-wide relative">
                <span className="relative z-10 text-[#d96677] font-handwriting text-5xl">
                  {settings?.site_name ? settings.site_name[0] : 'S'}
                </span>
                <span className="relative z-10">
                  {settings?.site_name ? settings.site_name.slice(1) : 'ect'}
                </span>
              </h2>
              <span className="text-[9px] tracking-[0.2em] text-white/50 uppercase block mt-1 ml-1 font-medium">
                {settings?.tagline || t('footer.handmadeGifts')}
              </span>
            </Link>
          </div>

          {/* Column 2: Quick Links */}
          <div className="w-1/2 sm:w-auto text-start ltr:pl-4 md:ltr:pl-10">
            <h3 className="text-sm font-bold mb-5 text-white font-serif tracking-wide">{t('footer.quickLinks') || 'Quick Links'}</h3>
            <ul className="space-y-3 text-white/70 text-[13px] font-medium">
              <li><Link to="/" className="hover:text-white transition-colors">{t('nav.home') || 'Home'}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">{t('nav.store') || 'Shop'}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.story') || 'About Us'}</Link></li>
              <li><Link to="/collections" className="hover:text-white transition-colors">{t('nav.collections') || 'Collections'}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact') || 'Contact'}</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="w-1/2 sm:w-auto text-start">
            <h3 className="text-sm font-bold mb-5 text-white font-serif tracking-wide">{t('footer.customerService') || 'Customer Care'}</h3>
            <ul className="space-y-3 text-white/70 text-[13px] font-medium">
              <li><Link to="/pages/shipping-policy" className="hover:text-white transition-colors">{t('footer.shippingPolicy') || 'Shipping Policy'}</Link></li>
              <li><Link to="/pages/return-policy" className="hover:text-white transition-colors">{t('footer.returnPolicy') || 'Return & Refunds'}</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">{t('footer.faq') || 'FAQs'}</Link></li>
              <li><Link to="/pages/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacyPolicy') || 'Privacy Policy'}</Link></li>
              <li><Link to="/pages/terms-conditions" className="hover:text-white transition-colors">{t('footer.terms') || 'Terms & Conditions'}</Link></li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="w-full sm:w-auto text-start">
            <h3 className="text-sm font-bold mb-5 text-white font-serif tracking-wide">{t('contact.followUs') || 'Follow Us'}</h3>
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/80 hover:text-white transition-colors p-1"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={social.name === 'Facebook' || social.name === 'Instagram' || social.name === 'Youtube' ? 'none' : 'currentColor'} stroke={social.name === 'Facebook' || social.name === 'Instagram' || social.name === 'Youtube' ? 'currentColor' : 'none'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
            {settings?.support_email && (
              <p className="mt-4 text-xs text-white/60">
                {settings.support_email}
              </p>
            )}
            {settings?.phone && (
              <p className="mt-1 text-xs text-white/60" dir="ltr">
                {settings.phone}
              </p>
            )}
          </div>

          {/* Right Decoration Text */}
          <div className="hidden lg:flex items-center justify-center ltr:-rotate-12 rtl:rotate-12 w-48 text-[#fcfcfc]">
            <div className="font-handwriting text-3xl leading-tight">
              {t('footer.moreThan')} <br/> {t('footer.justGifts')} <Heart className="inline w-5 h-5 opacity-80" strokeWidth={2.5} />
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-white/60">
          
          <p dir="ltr">
            © {new Date().getFullYear()} {settings?.site_name || 'Sect'}. All rights reserved.
          </p>

          <div className="flex items-center gap-3 font-medium tracking-wide">
            <Heart className="w-3.5 h-3.5 text-[#d96677] fill-current" />
            <span>{t('auth.handmade')}</span>
            <span className="text-[#d96677] text-[10px]">★</span>
            <span>{t('auth.withLove')}</span>
            <span className="text-[#d96677] text-[10px]">★</span>
            <span>{t('footer.madeForYou')}</span>
          </div>
          
        </div>
      </div>
      </div>
    </footer>
  );
}
