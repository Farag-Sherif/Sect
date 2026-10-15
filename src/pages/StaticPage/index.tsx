import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, FileText, HelpCircle, ChevronDown, ArrowLeft, Home } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { pagesService, faqsService } from '../../api/services';
import type { ApiPage, ApiFaq } from '../../api/types';

export default function StaticPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [page, setPage] = useState<ApiPage | null>(null);
  const [faqs, setFaqs] = useState<ApiFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pathname = window.location.pathname;
  const isFaqPage = slug === 'faqs' || pathname.includes('/faq');

  let effectiveSlug = slug;
  if (!effectiveSlug) {
    if (pathname.includes('/shipping')) effectiveSlug = 'shipping-policy';
    else if (pathname.includes('/returns')) effectiveSlug = 'return-policy';
    else if (pathname.includes('/privacy')) effectiveSlug = 'privacy-policy';
    else if (pathname.includes('/terms')) effectiveSlug = 'terms-conditions';
  }

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (isFaqPage) {
      faqsService.getFaqs()
        .then(data => {
          if (isMounted) {
            setFaqs(data);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setError(err.message || 'Failed to load FAQs');
            setLoading(false);
          }
        });
    } else if (effectiveSlug) {
      pagesService.getPageBySlug(effectiveSlug)
        .then(data => {
          if (isMounted) {
            setPage(data);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setError(err.message || 'Failed to load page');
            setLoading(false);
          }
        });
    }

    return () => { isMounted = false; };
  }, [slug, isFaqPage, i18n.language]);

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="relative min-h-[260px] md:min-h-[300px] flex items-center overflow-hidden bg-[#fffaf8]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/backgrounds/products-hero.webp" 
            alt="Hero Background"
            className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/95 via-[#fcf7f4]/60 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
          <div className="max-w-2xl ltr:text-left rtl:text-right py-12">
            <div className="flex items-center text-xs font-bold tracking-[0.2em] text-[#a0525f] mb-4 uppercase">
              <Link to="/" className="hover:text-[#4a1c24] transition-colors flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>{t('nav.home') || 'Home'}</span>
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 mx-2 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-[#a0525f]">
                {isFaqPage ? (isRTL ? 'الأسئلة الشائعة' : 'FAQs') : (page?.title || slug)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#4a1c24] mb-3 flex items-center gap-3">
              {isFaqPage ? (
                <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-[#d96677]" />
              ) : (
                <FileText className="w-8 h-8 md:w-10 md:h-10 text-[#d96677]" />
              )}
              <span>{isFaqPage ? (isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions') : (page?.title || '...')}</span>
            </h1>
            {page?.meta_description && (
              <p className="text-[#4a1c24]/70 text-sm md:text-base leading-relaxed mt-2 max-w-xl">
                {page.meta_description}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-6 md:h-8 z-40 text-[#fff9f6]">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
            <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#fff9f6] min-h-[400px] py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#a0525f]">
              <div className="w-10 h-10 border-4 border-[#a0525f]/20 border-t-[#a0525f] rounded-full animate-spin mb-4" />
              <p className="font-bold text-sm">{isRTL ? 'جاري التحميل...' : 'Loading content...'}</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-sm text-center">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#a0525f] hover:underline">
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                <span>{isRTL ? 'العودة للرئيسية' : 'Back to Home'}</span>
              </Link>
            </div>
          ) : isFaqPage ? (
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((faq, idx) => (
                  <div 
                    key={faq.id || idx}
                    className="bg-white rounded-2xl border border-[#e8dcd8] shadow-xs overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-start font-bold text-[#4a1c24] hover:bg-[#fffcfb] transition-colors"
                    >
                      <span className="text-base sm:text-lg">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-[#a0525f] transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-6 pt-2 text-[#4a1c24]/80 text-sm leading-relaxed border-t border-[#f5ebeb]">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#4a1c24]/60">
                  <p>{isRTL ? 'لا توجد أسئلة شائعة حالياً.' : 'No FAQs available at the moment.'}</p>
                </div>
              )}
            </div>
          ) : page ? (
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#e8dcd8]">
              <div 
                className="prose prose-stone max-w-none text-[#4a1c24]/85 leading-relaxed font-sans text-sm md:text-base space-y-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:font-serif [&>h2]:text-[#4a1c24] [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#4a1c24] [&>ul]:list-disc [&>ul]:ps-6 [&>ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: page.content || '' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
