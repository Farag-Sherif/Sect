import Layout from '../../components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ShoppingBag, Truck, CreditCard, Heart, MapPin, User, Phone, Mail } from 'lucide-react';
import { useMockData } from '../../data/mockData';

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { cart, clearCart } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 60 : 0;
  const total = subtotal + shipping;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="relative min-h-[300px] md:min-h-[350px] flex items-center overflow-hidden bg-[#fffaf8]">
        
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/backgrounds/products-hero.png" 
            alt="Checkout Background"
            className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
            <div className="max-w-xl ltr:text-left rtl:text-right py-16">
              <span className="text-[#a0525f] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t('checkoutPage.subtitle') || 'Shipping and Payment Details'}
              </span>
              <h1 className="text-4xl md:text-5xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-3 drop-shadow-sm whitespace-pre-line flex items-center gap-4">
                <Truck className="w-10 h-10 md:w-12 md:h-12 text-[#a0525f] fill-[#a0525f]/20" />
                {t('checkoutPage.title') || 'Checkout'}
              </h1>
              <p className="text-[#4a1c24]/80 text-[15px] leading-relaxed max-w-md font-medium mb-8 mt-4">
                {t('checkoutPage.desc') || 'Please complete your order details to ensure it reaches you in perfect condition.'}
              </p>
            </div>
            
            <div className="absolute top-1/4 ltr:right-16 rtl:left-16 rotate-[-12deg] font-handwriting text-white text-3xl md:text-4xl ltr:text-right rtl:text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hidden md:block">
              More than just <br/>
                <span className="text-2xl">♡</span> Handmade..
            </div>
        </div>
          
        <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-[#fff9f6]">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
            <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
          </svg>
        </div>
      </div>

      <div className="bg-[#fff9f6] min-h-[500px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pt-12 pb-32">
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column: Form */}
            <div className="lg:w-[65%] xl:w-[70%]">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e8dcd8] mb-8">
                
                <h2 className="text-2xl font-serif font-bold text-[#4a1c24] flex items-center gap-3 mb-8 pb-4 border-b border-[#e8dcd8]">
                  <MapPin className="w-6 h-6 text-[#a0525f]" />
                  {t('checkoutPage.shippingInfo') || 'Shipping Information'}
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4a1c24] mb-2">{t('checkoutPage.firstName') || 'First Name'}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 pl-4 pr-4 flex items-center pointer-events-none text-[#a0525f]/50">
                          <User className="w-5 h-5" />
                        </div>
                        <input type="text" className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4a1c24] mb-2">{t('checkoutPage.lastName') || 'Last Name'}</label>
                      <input type="text" className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4a1c24] mb-2">{t('checkoutPage.phone') || 'Phone Number'}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 pl-4 pr-4 flex items-center pointer-events-none text-[#a0525f]/50">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input type="tel" className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4a1c24] mb-2">{t('checkoutPage.email') || 'Email'}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 pl-4 pr-4 flex items-center pointer-events-none text-[#a0525f]/50">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input type="email" className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a1c24] mb-2">{t('checkoutPage.city') || 'City'}</label>
                    <input type="text" className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a1c24] mb-2">{t('checkoutPage.address') || 'Address'}</label>
                    <textarea rows={3} className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24] resize-none"></textarea>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e8dcd8]">
                <h2 className="text-2xl font-serif font-bold text-[#4a1c24] flex items-center gap-3 mb-6 pb-4 border-b border-[#e8dcd8]">
                  <CreditCard className="w-6 h-6 text-[#a0525f]" />
                  {t('checkoutPage.paymentMethod') || 'Payment Method'}
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border border-[#e8dcd8] rounded-xl cursor-pointer hover:bg-[#FCF8F9] transition-colors">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-[#a0525f]" />
                    <span className="font-medium text-[#4a1c24]">{t('checkoutPage.cashOnDelivery') || 'Cash on Delivery'}</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-[#e8dcd8] rounded-xl cursor-pointer hover:bg-[#FCF8F9] transition-colors opacity-70">
                    <input type="radio" name="payment" disabled className="w-5 h-5 accent-[#a0525f]" />
                    <span className="font-medium text-[#4a1c24]">{t('checkoutPage.creditCard') || 'Credit Card (Coming Soon)'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-[35%] xl:w-[30%]">
              <div className="bg-white border border-[#e8dcd8] rounded-[2rem] p-8 shadow-sm sticky top-24">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#e8dcd8]">
                  <ShoppingBag className="w-6 h-6 text-[#a0525f]" />
                  <h2 className="text-2xl font-serif font-bold text-[#4a1c24]">{t('checkoutPage.orderSummary') || 'Order Summary'}</h2>
                </div>

                <div className="space-y-6 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#e8dcd8]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#4a1c24] text-sm truncate">{item.name}</h4>
                        <div className="text-xs text-[#a0525f] mt-1">{item.quantity} x EGP {item.price}</div>
                      </div>
                      <div className="font-bold text-[#4a1c24] text-sm shrink-0">
                        EGP {item.quantity * item.price}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6 pt-6 border-t border-[#e8dcd8]">
                  <div className="flex justify-between items-center text-sm font-medium text-[#4a1c24]">
                    <span>{t('checkoutPage.subtotal') || 'Subtotal'}</span>
                    <span className="font-bold">EGP {subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-[#4a1c24]">
                    <span>{t('checkoutPage.shipping') || 'Shipping'}</span>
                    <span className="font-bold">EGP {shipping}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e8dcd8] mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#4a1c24]">{t('checkoutPage.total') || 'Total'}</span>
                    <span className="text-2xl font-bold text-[#a0525f]">EGP {total}</span>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2">
                    {isRTL ? '?? ????? ???? ?????!' : 'Order placed successfully!'}
                  </div>
                ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting || cart.length === 0} className="w-full bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ShoppingBag className="w-5 h-5" />
                    {isSubmitting ? (isRTL ? '???? ???????...' : 'Submitting...') : (t('checkoutPage.placeOrder') || 'Place Order')}
                  </button>
                )}
                
                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                   <div className="font-handwriting text-[#a0525f] text-2xl drop-shadow-sm text-center">
                     Thank you <br/>
                     for choosing Sect <br/>
                     <span className="text-xl">♡</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
