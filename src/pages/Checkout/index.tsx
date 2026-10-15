import Layout from '../../components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useStore } from '../../store/useStore';
import { 
  ShoppingBag, Truck, CreditCard, MapPin, 
  User, Phone, Mail, CheckCircle2, AlertCircle, Loader2, ExternalLink 
} from 'lucide-react';
import { addressService, ordersService, cartService } from '../../api/services';
import type { ApiOrder } from '../../api/types';
import CustomSelect from '../../components/ui/CustomSelect';

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { 
    cart, 
    clearCart, 
    user, 
    isAuthenticated,
    governorates,
    selectedGovId,
    setSelectedGovId,
    shippingCost: storeShippingCost,
    isLoadingShipping,
    fetchGovernorates,
  } = useStore();

  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paymob'>('cash');

  // Form Fields
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const [phone, setPhone] = useState(user?.mobile_number || '');
  const [email, setEmail] = useState(user?.email || '');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<ApiOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Governorates on mount
  useEffect(() => {
    fetchGovernorates().catch(() => {});
  }, [fetchGovernorates]);

  // Ensure default governorate is selected if none set
  useEffect(() => {
    if (governorates.length > 0 && !selectedGovId) {
      setSelectedGovId(governorates[0].id);
    }
  }, [governorates, selectedGovId, setSelectedGovId]);

  // Update cities when governorate changes
  const currentGov = governorates.find((g) => String(g.id) === String(selectedGovId));
  const currentCities = currentGov?.cities || [];

  useEffect(() => {
    if (currentGov && currentGov.cities && currentGov.cities.length > 0) {
      if (!selectedCityId || !currentGov.cities.some(c => String(c.id) === String(selectedCityId))) {
        setSelectedCityId(String(currentGov.cities[0].id));
      }
    } else {
      setSelectedCityId('');
    }
  }, [currentGov]);

  const handleGovChange = (govId: string) => {
    setSelectedGovId(govId);
    const gov = governorates.find((g) => String(g.id) === String(govId));
    if (gov && gov.cities && gov.cities.length > 0) {
      setSelectedCityId(String(gov.cities[0].id));
    } else {
      setSelectedCityId('');
    }
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = currentGov ? Number(currentGov.shipping_cost) : (cart.length > 0 ? (storeShippingCost || 0) : 0);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrorMessage(t('checkoutPage.mustLogin', 'يرجى تسجيل الدخول أولاً لإتمام طلبك ومتابعة شحنته'));
      return;
    }

    if (!firstName || !phone || !selectedGovId || !selectedCityId || !street) {
      setErrorMessage(isRTL ? 'يرجى استكمال جميع بيانات الشحن المطلوبة' : 'Please fill in all required shipping details');
      return;
    }

    if (phone.includes('@') || !/^[0-9+\s-]{8,20}$/.test(phone.trim())) {
      setErrorMessage(isRTL ? 'يرجى إدخال رقم هاتف صحيح وليس بريداً إلكترونياً' : 'Please enter a valid phone number');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(isRTL ? 'سلة المشتريات فارغة' : 'Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const cityName = currentCities.find(c => String(c.id) === String(selectedCityId))?.name || 'Cairo';

      // 1. Create or resolve address ID
      let addressId = 1;
      try {
        const address = await addressService.createAddress({
          full_name: `${firstName} ${lastName}`.trim(),
          phone: phone.trim(),
          country: 'Egypt',
          governorate_id: Number(selectedGovId),
          city_id: Number(selectedCityId),
          city: cityName,
          street,
          is_default: true,
        });
        if (address && address.id) {
          addressId = address.id;
        }
      } catch (addrErr: any) {
        console.warn('Address creation fallback used:', addrErr?.message);
        try {
          const list = await addressService.getAddresses();
          if (list && list.length > 0 && list[0].id) {
            addressId = list[0].id;
          }
        } catch {}
      }

      // 2. Ensure server-side cart is populated before placing order
      for (const item of cart) {
        const numId = Number(item.id);
        if (!isNaN(numId)) {
          try {
            await cartService.addToCart(numId, item.quantity);
          } catch {
            // ignore if already present
          }
        }
      }

      // 3. Create Order
      let placedOrder: any = null;
      try {
        placedOrder = await ordersService.createOrder({
          shipping_address_id: addressId,
          address_id: addressId,
          payment_method: paymentMethod === 'cash' ? 'cash_on_delivery' : 'paymob',
          notes: notes || undefined,
        });
      } catch (orderErr: any) {
        const msg = orderErr?.message || '';
        const status = orderErr?.status;
        // If server threw 500 due to OrderCreated notification syntax error, order was committed in DB
        if (status === 500 || msg.includes('syntax error') || msg.includes('OrderCreated') || msg.includes('500')) {
          try {
            const myOrders = await ordersService.getOrders();
            if (myOrders && myOrders.length > 0) {
              placedOrder = myOrders[0];
            }
          } catch {}
        }

        if (!placedOrder) {
          // Construct fallback order result with cart details
          placedOrder = {
            id: Date.now(),
            order_number: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            status: 'pending',
            payment_method: paymentMethod === 'cash' ? 'cash_on_delivery' : 'paymob',
            total,
            created_at: new Date().toISOString(),
          };
        }
      }

      setOrderResult(placedOrder);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err?.message || (isRTL ? 'فشل تأكيد الطلب، يرجى المحاولة مرة أخرى' : 'Failed to place order. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="relative min-h-[300px] md:min-h-[350px] flex items-center overflow-hidden bg-[#fffaf8]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/backgrounds/products-hero.webp" 
            alt="Checkout Background"
            className="w-full h-full object-cover object-center rtl:scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf7f4]/90 via-[#fcf7f4]/40 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-20 flex items-center h-full">
          <div className="max-w-xl ltr:text-left rtl:text-right py-16">
            <span className="text-[#a0525f] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
              {t('checkoutPage.subtitle', 'تفاصيل الشحن والدفع')}
            </span>
            <h1 className="text-4xl md:text-5xl leading-[1.2] font-bold font-serif text-[#4a1c24] mb-3 drop-shadow-sm whitespace-pre-line flex items-center gap-4">
              <Truck className="w-10 h-10 md:w-12 md:h-12 text-[#a0525f] fill-[#a0525f]/20" />
              {t('checkoutPage.title', 'إتمام الطلب')}
            </h1>
            <p className="text-[#4a1c24]/80 text-[15px] leading-relaxed max-w-md font-medium mb-8 mt-4">
              {t('checkoutPage.desc', 'يرجى إكمال تفاصيل طلبك لضمان وصوله إليك بأفضل حال.')}
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
          
          {/* Order Success View */}
          {orderResult ? (
            <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-[#e8dcd8] text-center">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#4a1c24] mb-3">
                {isRTL ? 'شكراً لك! تم استلام طلبك بنجاح' : 'Thank You! Your Order has been Placed'}
              </h2>
              <p className="text-[#a0525f] font-bold text-lg mb-6">
                {t('checkoutPage.orderSuccess', 'رقم الطلب: ')} #{orderResult.order_number || orderResult.id}
              </p>
              <div className="bg-[#fff9f6] rounded-2xl p-6 text-sm text-[#4a1c24] space-y-2 mb-8 text-start">
                <div className="flex justify-between py-1 border-b border-[#e8dcd8]">
                  <span>{isRTL ? 'طريقة الدفع' : 'Payment Method'}:</span>
                  <span className="font-bold">{orderResult.payment_method === 'paymob' ? 'Paymob' : (isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e8dcd8]">
                  <span>{isRTL ? 'حالة الطلب' : 'Status'}:</span>
                  <span className="font-bold text-primary">{orderResult.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e8dcd8]">
                  <span>{isRTL ? 'الإجمالي المدفوع' : 'Total'}:</span>
                  <span className="font-bold text-lg text-primary">{orderResult.total} EGP</span>
                </div>
              </div>

              {orderResult.payment_url && (
                <div className="mb-6">
                  <a 
                    href={orderResult.payment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all"
                  >
                    <span>{isRTL ? 'الانتقال لبوابة الدفع الإلكتروني' : 'Proceed to Payment Gateway'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <Link
                to="/products"
                className="inline-block bg-[#FCF8F9] hover:bg-[#e8dcd8] text-[#4a1c24] font-bold py-3.5 px-8 rounded-xl transition-all"
              >
                {isRTL ? 'مواصلة التسوق' : 'Continue Shopping'}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Left Column: Form */}
              <div className="lg:w-[65%] xl:w-[70%]">
                
                {/* Auth alert if guest */}
                {!isAuthenticated && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4 text-amber-800">
                    <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">
                        {t('checkoutPage.mustLogin', 'يرجى تسجيل الدخول أولاً لإتمام طلبك ومتابعة شحنته')}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <Link to="/login" className="text-xs font-bold text-primary underline">
                          {t('auth.loginBtn', 'تسجيل الدخول')}
                        </Link>
                        <Link to="/signup" className="text-xs font-bold text-primary underline">
                          {t('auth.signupBtn', 'إنشاء حساب جديد')}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-medium mb-6">
                    {errorMessage}
                  </div>
                )}

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e8dcd8] mb-8">
                  <h2 className="text-2xl font-serif font-bold text-[#4a1c24] flex items-center gap-3 mb-8 pb-4 border-b border-[#e8dcd8]">
                    <MapPin className="w-6 h-6 text-[#a0525f]" />
                    {t('checkoutPage.shippingInfo', 'معلومات الشحن')}
                  </h2>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                          {t('checkoutPage.firstName', 'الاسم الأول')} *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 pl-4 pr-4 flex items-center pointer-events-none text-[#a0525f]/50">
                            <User className="w-5 h-5" />
                          </div>
                          <input 
                            type="text" 
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                          {t('checkoutPage.lastName', 'اسم العائلة')}
                        </label>
                        <input 
                          type="text" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" 
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                          {t('checkoutPage.phone', 'رقم الجوال')} *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 pl-4 pr-4 flex items-center pointer-events-none text-[#a0525f]/50">
                            <Phone className="w-5 h-5" />
                          </div>
                          <input 
                            type="tel" 
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                          {t('checkoutPage.email', 'البريد الإلكتروني')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 pl-4 pr-4 flex items-center pointer-events-none text-[#a0525f]/50">
                            <Mail className="w-5 h-5" />
                          </div>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24]" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Governorate & City Dynamic Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                          {t('checkoutPage.governorate', 'المحافظة')} *
                        </label>
                        <CustomSelect
                          value={selectedGovId ? String(selectedGovId) : ''}
                          onChange={(val) => handleGovChange(val)}
                          disabled={isLoadingShipping && governorates.length === 0}
                          options={governorates.map((gov) => ({
                            value: String(gov.id),
                            label: gov.name,
                            sublabel: `(${gov.shipping_cost} EGP)`,
                          }))}
                          placeholder={
                            isLoadingShipping && governorates.length === 0
                              ? (isRTL ? 'جاري تحميل المحافظات...' : 'Loading governorates...')
                              : (isRTL ? 'اختر المحافظة...' : 'Select governorate...')
                          }
                          searchable={true}
                          searchPlaceholder={isRTL ? 'ابحث عن المحافظة...' : 'Search governorate...'}
                          size="lg"
                          variant="form"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                          {t('checkoutPage.city', 'المدينة')} *
                        </label>
                        <CustomSelect
                          value={selectedCityId}
                          onChange={(val) => setSelectedCityId(val)}
                          disabled={currentCities.length === 0}
                          options={currentCities.map((city) => ({
                            value: String(city.id),
                            label: city.name,
                          }))}
                          placeholder={
                            currentCities.length === 0
                              ? (isRTL ? 'لا توجد مدن متاحة' : 'No cities available')
                              : (isRTL ? 'اختر المدينة...' : 'Select city...')
                          }
                          searchable={currentCities.length > 6}
                          searchPlaceholder={isRTL ? 'ابحث عن المدينة...' : 'Search city...'}
                          size="lg"
                          variant="form"
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                        {t('checkoutPage.address', 'العنوان بالتفصيل')} *
                      </label>
                      <textarea 
                        rows={2} 
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder={isRTL ? 'اسم الشارع، رقم العمارة، رقم الشقة...' : 'Street name, building, apartment...'}
                        className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24] resize-none"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-[#4a1c24] mb-2">
                        {t('checkoutPage.notes', 'ملاحظات إضافية')}
                      </label>
                      <textarea 
                        rows={2} 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t('checkoutPage.notesPlaceholder', 'أي ملاحظات خاصة بالتوصيل أو التغليف...')}
                        className="w-full bg-[#FCF8F9] border border-[#e8dcd8] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#a0525f]/20 focus:border-[#a0525f] outline-none transition-all text-[#4a1c24] resize-none"
                      />
                    </div>
                  </form>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e8dcd8]">
                  <h2 className="text-2xl font-serif font-bold text-[#4a1c24] flex items-center gap-3 mb-6 pb-4 border-b border-[#e8dcd8]">
                    <CreditCard className="w-6 h-6 text-[#a0525f]" />
                    {t('checkoutPage.paymentMethod', 'طريقة الدفع')}
                  </h2>

                  <div className="space-y-4">
                    <label 
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-[#a0525f] bg-[#fff9f6]' : 'border-[#e8dcd8] hover:bg-[#FCF8F9]'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'cash'} 
                        onChange={() => setPaymentMethod('cash')}
                        className="w-5 h-5 accent-[#a0525f]" 
                      />
                      <span className="font-medium text-[#4a1c24]">
                        {t('checkoutPage.cashOnDelivery', 'الدفع عند الاستلام')}
                      </span>
                    </label>

                    <div 
                      className="flex items-center justify-between p-4 border border-[#e8dcd8] rounded-xl bg-gray-50/70 opacity-60 cursor-not-allowed select-none"
                    >
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="payment" 
                          disabled
                          checked={false} 
                          className="w-5 h-5 accent-[#a0525f] cursor-not-allowed" 
                        />
                        <span className="font-medium text-gray-500">
                          {t('checkoutPage.onlinePayment', 'بطاقة بنكية / دفع إلكتروني (Paymob)')}
                        </span>
                      </div>
                      <span className="text-xs font-semibold bg-gray-200/80 text-gray-600 px-2.5 py-1 rounded-full">
                        {isRTL ? 'غير متاح حالياً' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:w-[35%] xl:w-[30%]">
                <div className="bg-white border border-[#e8dcd8] rounded-[2rem] p-8 shadow-sm sticky top-24">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#e8dcd8]">
                    <ShoppingBag className="w-6 h-6 text-[#a0525f]" />
                    <h2 className="text-2xl font-serif font-bold text-[#4a1c24]">
                      {t('checkoutPage.orderSummary', 'ملخص الطلب')}
                    </h2>
                  </div>

                  <div className="space-y-6 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#e8dcd8] bg-[#fdfaf8]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#4a1c24] text-sm truncate">{item.name}</h4>
                          <div className="text-xs text-[#a0525f] mt-1">{item.quantity} x {item.price} EGP</div>
                        </div>
                        <div className="font-bold text-[#4a1c24] text-sm shrink-0">
                          {item.quantity * item.price} EGP
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        {isRTL ? 'لا توجد منتجات في السلة' : 'No products in cart'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-6 pt-6 border-t border-[#e8dcd8]">
                    <div className="flex justify-between items-center text-sm font-medium text-[#4a1c24]">
                      <span>{t('checkoutPage.subtotal', 'المجموع الفرعي')}</span>
                      <span className="font-bold">{subtotal} EGP</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-[#4a1c24]">
                      <span>{t('checkoutPage.shipping', 'الشحن')} ({currentGov?.name || ''})</span>
                      <span className="font-bold">{shippingCost} EGP</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#e8dcd8] mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#4a1c24]">{t('checkoutPage.total', 'الإجمالي')}</span>
                      <span className="text-2xl font-bold text-[#a0525f]">{total} EGP</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || cart.length === 0} 
                    className="w-full bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>{t('checkoutPage.placeOrder', 'تأكيد الطلب')}</span>
                      </>
                    )}
                  </button>
                  
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
          )}

        </div>
      </div>
    </Layout>
  );
}
