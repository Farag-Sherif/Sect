// @ts-ignore
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Tag, Truck, ShieldCheck, Heart, Minus, Plus, Home } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/footer/Footer';
import { useStore } from '../../store/useStore';

const mockSuggestions = [
  { id: 1, name: "Flower Keychain", price: 230, rating: 5, reviews: 14, image: "/images/backgrounds/cart-hero.jpg" },
  { id: 2, name: "Home Decor Vase", price: 299, rating: 4, reviews: 21, image: "/images/backgrounds/cart-hero.jpg" },
  { id: 3, name: "Crochet Bunny Toy", price: 249, rating: 5, reviews: 18, image: "/images/backgrounds/cart-hero.jpg" },
  { id: 4, name: "Handmade Clutch Bag", price: 380, rating: 4, reviews: 12, image: "/images/backgrounds/cart-hero.jpg" },
  { id: 5, name: "Gift Box Set", price: 540, rating: 5, reviews: 16, image: "/images/backgrounds/cart-hero.jpg" }
];

export default function Cart() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const items = useStore(state => state.cart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [discount, setDiscount] = useState(0);
  const applyPromo = () => setDiscount(20);
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="min-h-screen bg-[#FDF5F6] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-[76px] md:pt-[92px]">
        {/* Hero Banner Section */}
        <div className="relative min-h-[300px] md:min-h-[350px] flex items-center overflow-hidden bg-[#fffaf8]">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/backgrounds/products-hero.png" 
              alt="Cart Background"
              className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
              <div className="max-w-xl ltr:text-left rtl:text-right py-16">
                <div className="flex items-center text-xs font-bold tracking-[0.2em] text-[#a0525f] mb-4 uppercase">
                  <Link to="/" className="hover:text-[#4a1c24] transition-colors flex items-center gap-2">
                    <Home className="w-4 h-4" /> {t('home.title') || 'Home'}
                  </Link>
                  <ChevronRight className={`w-4 h-4 mx-2 ${isRTL ? 'rotate-180' : ''}`} />
                  <span className="text-[#a0525f]">{t('cart.heroTitle') || 'Cart'}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-3 drop-shadow-sm whitespace-pre-line flex items-center gap-4">
                  <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-[#a0525f] fill-[#a0525f]/20" />
                  {t('cart.heroTitle')}
                </h1>
                <p className="text-[#4a1c24]/80 text-[15px] leading-relaxed max-w-md font-medium mb-8 mt-4">
                  {t('cart.heroDesc')}
                </p>
              </div>
              
              <div 
                className="absolute top-1/4 -translate-y-6 ltr:right-8 sm:ltr:right-12 md:ltr:right-16 lg:ltr:right-24 rtl:left-8 sm:rtl:left-12 md:rtl:left-16 lg:rtl:left-24 transform -rotate-[13deg] select-none pointer-events-none hidden md:flex flex-col z-30 filter drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)]"
                dir="ltr"
              >
                <span className="font-handwriting text-white text-5xl md:text-6xl lg:text-[70px] leading-[0.85] tracking-wide">
                  {t('cart.heroSubtitleLine1', 'Handmade')}
                </span>
                <span className="font-handwriting text-white text-4xl md:text-5xl lg:text-[58px] leading-[0.85] mt-1 ml-6 sm:ml-8 md:ml-10">
                  {t('cart.heroSubtitleLine2', 'with love')}
                </span>
                <div className="flex justify-end pr-3 sm:pr-4 md:pr-6 mt-1 md:mt-2">
                  <Heart className="w-7 h-7 md:w-8 md:h-8 text-white stroke-[2.2] fill-none drop-shadow-md" />
                </div>
              </div>
          </div>
            
          <div className="absolute bottom-0 left-0 w-full h-6 md:h-10 z-40 text-[#FDF5F6]">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
              <path d="M0,50 Q50,60 100,40 T200,50 Q250,70 300,45 T400,55 Q450,35 500,60 T600,40 Q650,65 700,50 T800,55 Q850,30 900,60 T1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Cart Content */}
        <section className="py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Cart Items */}
              <div className="lg:w-[65%] xl:w-[70%]">
                <div className="bg-[#FCF8F9] rounded-[2rem] p-8 shadow-sm">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#EACBD0]/40 pb-6 mb-6">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-serif font-bold text-text-dark">{t('cart.items')} ({items.length})</h2>
                    </div>
                    <Link to="/products" className="text-primary font-bold text-sm hover:text-primary-dark transition-colors flex items-center gap-1">
                      {t('cart.continueShopping')} <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>

                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-bold text-[#d96677] bg-[#fbf1f2] py-3 px-4 rounded-xl mb-6">
                    <div className="col-span-6">{t('cart.product')}</div>
                    <div className="col-span-2 text-center">{t('cart.price')}</div>
                    <div className="col-span-2 text-center">{t('cart.quantity')}</div>
                    <div className="col-span-2 text-right">{t('cart.total')}</div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-[#EACBD0]/20">
                        {/* Product Info */}
                        <div className="col-span-1 md:col-span-6 flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative group">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <button onClick={(e) => { e.currentTarget.classList.toggle('text-primary'); }} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-text-light hover:text-primary backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <Heart className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="font-bold text-text-dark text-base">{item.name}</h3>
                            <p className="text-sm text-text-light mb-1">{item.category}</p>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                {t('cart.inStock')}
                              </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-1 md:col-span-2 text-center font-bold text-text-dark text-sm">
                          EGP {item.price}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1 md:col-span-2 flex justify-center">
                          <div className="flex items-center bg-[#FCF8F9] border border-[#EACBD0]/60 rounded-full px-2 py-1">
                            <button onClick={() => updateQuantity(item.id.toString(), Math.max(1, item.quantity - 1))} className="p-1 hover:text-primary transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id.toString(), item.quantity + 1)} className="p-1 hover:text-primary transition-colors text-primary"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {/* Total & Action */}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                          <div className="font-bold text-text-dark text-sm md:text-right w-full">
                            EGP {item.price * item.quantity}
                          </div>
                          <button onClick={() => removeFromCart(item.id.toString())} className="p-2 text-text-light hover:text-[#d96677] transition-colors bg-[#FCF8F9] rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Continue Shopping */}
                  <div className="mt-8 pt-6 border-t border-[#EACBD0]/40">
                    <Link to="/products" className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark transition-colors">
                      <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} /> {t('cart.continueShopping')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:w-[35%] xl:w-[30%]">
                <div className="bg-[#FCF8F9] rounded-[2rem] p-8 shadow-sm sticky top-24">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#EACBD0]/40">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-serif font-bold text-text-dark">{t('cart.summary')}</h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm font-medium text-text-dark">
                      <span>{t('cart.subtotal')} ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                      <span className="font-bold">EGP {total}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-text-dark">
                      <div>
                        <div>{t('cart.shipping')}</div>
                        <div className="text-xs text-text-light">{t('cart.standardShipping')}</div>
                      </div>
                      <span className="font-bold">EGP {total > 0 ? 60 : 0}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#EACBD0]/40 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-text-dark">{t('cart.totalOrder')}</span>
                      <span className="text-2xl font-bold text-primary">EGP {total > 0 ? total + 60 : 0}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="bg-white rounded-xl p-4 border border-[#EACBD0]/40 mb-6 shadow-sm">
                    <button className="flex items-center justify-between w-full text-sm font-bold text-text-dark group">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        {t('cart.havePromo')}
                      </div>
                      <ChevronRight className={`w-4 h-4 text-text-light transition-transform ${isRTL ? 'rotate-180' : 'rotate-90'}`} />
                    </button>
                    <div className="mt-4 flex gap-2">
                      <input type="text" placeholder={t('cart.enterCode')} className="flex-1 bg-[#FDF5F6] border border-[#EACBD0]/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                      <button onClick={applyPromo} className="bg-[#b35766] hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                          {t('cart.apply')}
                        </button>
                    </div>
                  </div>

                  <button onClick={() => navigate('/checkout')} className="w-full bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mb-8">
                    <ShoppingBag className="w-5 h-5" />
                    {t('cart.checkout')} 
                    <span className={isRTL ? "rotate-180" : ""}>→</span>
                  </button>

                  {/* Trust Features */}
                  <div className="space-y-4 pt-6 border-t border-[#EACBD0]/40">
                    <div className="flex gap-4 items-start">
                      <Truck className="w-6 h-6 text-[#9A3B50] shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-sm font-bold text-text-dark">{t('cart.freeShipping')}</div>
                        <div className="text-xs text-text-light">{t('cart.freeShippingDesc')}</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <ShieldCheck className="w-6 h-6 text-[#9A3B50] shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-sm font-bold text-text-dark">{t('cart.securePayments')}</div>
                        <div className="text-xs text-text-light">{t('cart.securePaymentsDesc')}</div>
                      </div>
                      <Heart className="w-4 h-4 text-primary/40 ml-auto" />
                    </div>
                    <div className="flex gap-4 items-start">
                      <Heart className="w-6 h-6 text-[#9A3B50] shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-sm font-bold text-text-dark">{t('cart.handmadeWithLove')}</div>
                        <div className="text-xs text-text-light">{t('cart.handmadeWithLoveDesc')}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-30 mix-blend-multiply">
                    <img src="/images/decorations/floral.png" alt="" className={`w-full h-full object-cover ${isRTL ? 'scale-x-[-1]' : ''}`} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* You Might Also Like Section */}
        <section className="pt-16 pb-32 bg-white border-t border-[#f5ebeb]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            
            <div className="flex items-end justify-between mb-10">
              <div className="flex items-start gap-4">
                <div className="text-primary mt-1">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/><path d="m19 19-7-7-7 7"/><path d="m19 5-7 7-7-7"/></svg>
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-text-dark mb-1">{t('cart.youMightAlsoLike')}</h2>
                  <p className="text-text-light">{t('cart.moreTreasures')}</p>
                </div>
              </div>
              <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors pb-1">
                {t('cart.viewAll')} <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* Carousel */}
            <div className="relative group">
              <button className={`absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-text-dark hover:text-primary z-10 hidden sm:flex ${isRTL ? 'right-4' : 'left-4'}`}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {mockSuggestions.map((item) => (
                  <div key={item.id} className="bg-[#FCF8F9] rounded-2xl overflow-hidden shadow-sm border border-[#f5ebeb] group/card">
                    <div className="relative aspect-square">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-text-light hover:text-primary shadow-sm transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-text-dark text-sm mb-1 truncate">{item.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < item.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                        <span className="text-xs text-text-light">({item.reviews})</span>
                      </div>
                      <div className="font-bold text-text-dark mb-4">EGP {item.price}</div>
                      <button onClick={(e) => { const el = e.currentTarget; const orig = el.innerHTML; el.innerHTML = 'Added'; setTimeout(() => el.innerHTML = orig, 1000); }} className="w-full bg-[#9A3B50] hover:bg-[#833244] text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {t('cart.addToCart')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-text-dark hover:text-primary z-10 hidden sm:flex ${isRTL ? 'left-4' : '-right-4'}`}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
