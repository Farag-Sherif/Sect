import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../store/useStore';
import { authService, ordersService } from '../../api/services';
import type { ApiOrder } from '../../api/types';
import { 
  User, Lock, Package, Heart, LogOut, CheckCircle2, 
  AlertCircle, Loader2, Phone, Mail, Calendar, Eye, EyeOff, ShoppingBag 
} from 'lucide-react';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  const { user, isAuthenticated, updateUser, logout, favorites } = useStore();

  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'security'>('info');

  // Personal Info Form
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile_number || '');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Sync user state to form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile_number || '');
    }
  }, [user]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      setIsLoadingOrders(true);
      ordersService.getOrders()
        .then((data) => {
          setOrders(data || []);
        })
        .catch((err) => {
          console.error('Failed to load orders', err);
        })
        .finally(() => {
          setIsLoadingOrders(false);
        });
    }
  }, [activeTab, isAuthenticated]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdatingInfo(true);
    setInfoMessage(null);

    try {
      const updatedUser = await authService.updateProfile({
        name: name.trim(),
        mobile_number: mobile.trim() || undefined,
      });
      updateUser(updatedUser);
      setInfoMessage({
        type: 'success',
        text: t('profile.updateSuccess', 'تم تحديث البيانات بنجاح!'),
      });
      setTimeout(() => setInfoMessage(null), 4000);
    } catch (err: any) {
      setInfoMessage({
        type: 'error',
        text: err?.message || (isRTL ? 'فشل تحديث البيانات' : 'Failed to update info'),
      });
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: isRTL ? 'كلمة المرور الجديدة غير متطابقة' : 'Passwords do not match',
      });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage(null);

    try {
      await authService.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({
        type: 'success',
        text: t('profile.passwordSuccess', 'تم تغيير كلمة المرور بنجاح!'),
      });
      setTimeout(() => setPasswordMessage(null), 4000);
    } catch (err: any) {
      setPasswordMessage({
        type: 'error',
        text: err?.message || (isRTL ? 'فشل تغيير كلمة المرور، تأكد من كلمة المرور الحالية' : 'Failed to change password'),
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-[70vh] bg-[#fdfaf8] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#e8dcd8] text-center max-w-md w-full">
            <div className="w-16 h-16 bg-[#a0525f]/10 text-[#a0525f] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#4a1c24] mb-3">
              {t('profile.title', 'الملف الشخصي')}
            </h2>
            <p className="text-sm text-[#4a1c24]/70 mb-6">
              {t('profile.mustLogin', 'يرجى تسجيل الدخول للوصول إلى ملفك الشخصي وإدارة طلباتك.')}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-center"
              >
                {t('auth.loginBtn', 'تسجيل الدخول')}
              </Link>
              <Link
                to="/signup"
                className="w-full bg-[#fdf5f6] hover:bg-[#faeaed] text-[#a0525f] font-bold py-3.5 rounded-xl transition-all text-center"
              >
                {t('auth.signupBtn', 'إنشاء حساب جديد')}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
      })
    : '';

  return (
    <Layout>
      <div className="bg-[#fdfaf8] min-h-screen pb-24 font-sans">
        
        {/* Profile Hero Header */}
        <div className="bg-gradient-to-b from-[#fcf5f6] to-[#fdfaf8] border-b border-[#e8dcd8] pt-12 pb-10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
              
              {/* Avatar Initials */}
              <div className="w-24 h-24 rounded-full bg-[#a0525f] text-white font-serif text-4xl font-bold flex items-center justify-center shadow-lg border-4 border-white shrink-0">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>

              {/* User details */}
              <div className="flex-1">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#a0525f] block mb-1">
                  {t('profile.title', 'الملف الشخصي')}
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#4a1c24] mb-2">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[#4a1c24]/70">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#a0525f]" />
                    {user.email}
                  </span>
                  {user.mobile_number && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#a0525f]" />
                      {user.mobile_number}
                    </span>
                  )}
                  {joinDate && (
                    <span className="flex items-center gap-1.5 text-xs text-[#a0525f]/80">
                      <Calendar className="w-3.5 h-3.5" />
                      {t('profile.memberSince', 'عضو منذ')} {joinDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer self-center sm:self-start"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('profile.logout', 'تسجيل الخروج')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8">
          
          {/* Tabs Nav */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e8dcd8] pb-4 mb-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-[#a0525f] text-white shadow-md'
                  : 'bg-white text-[#4a1c24]/80 hover:text-[#a0525f] border border-[#e8dcd8]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('profile.personalInfo', 'البيانات الشخصية')}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#a0525f] text-white shadow-md'
                  : 'bg-white text-[#4a1c24]/80 hover:text-[#a0525f] border border-[#e8dcd8]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{t('profile.orders', 'طلباتي')}</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#a0525f] text-white shadow-md'
                  : 'bg-white text-[#4a1c24]/80 hover:text-[#a0525f] border border-[#e8dcd8]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{t('profile.security', 'الأمان وكلمة المرور')}</span>
            </button>

            <Link
              to="/favorites"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-[#4a1c24]/80 hover:text-[#a0525f] border border-[#e8dcd8] transition-all ms-auto cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#a0525f]" />
              <span>{t('profile.wishlist', 'المفضلة')} ({favorites.length})</span>
            </Link>
          </div>

          {/* TAB 1: Personal Info */}
          {activeTab === 'info' && (
            <div className="max-w-2xl bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-[#e8dcd8]">
              <h2 className="text-xl font-serif font-bold text-[#4a1c24] mb-6 pb-3 border-b border-[#e8dcd8] flex items-center gap-2.5">
                <User className="w-5 h-5 text-[#a0525f]" />
                {t('profile.personalInfo', 'البيانات الشخصية')}
              </h2>

              {infoMessage && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2.5 ${
                    infoMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {infoMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  <span>{infoMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#4a1c24] mb-2">
                    {t('profile.name', 'الاسم الكامل')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#fdfaf8] border border-[#e8dcd8] rounded-xl py-3 px-4 outline-none focus:border-[#a0525f] focus:ring-2 focus:ring-[#a0525f]/20 transition-all text-[#4a1c24]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4a1c24] mb-2">
                    {t('profile.email', 'البريد الإلكتروني')}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-gray-100 border border-[#e8dcd8] rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {isRTL ? 'البريد الإلكتروني لا يمكن تغييره' : 'Email address cannot be modified'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4a1c24] mb-2">
                    {t('profile.phone', 'رقم الجوال')}
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="01012345678"
                    className="w-full bg-[#fdfaf8] border border-[#e8dcd8] rounded-xl py-3 px-4 outline-none focus:border-[#a0525f] focus:ring-2 focus:ring-[#a0525f]/20 transition-all text-[#4a1c24]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingInfo}
                    className="inline-flex items-center justify-center gap-2 bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isUpdatingInfo ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>{t('profile.saveChanges', 'حفظ التغييرات')}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-[#e8dcd8]">
              <h2 className="text-xl font-serif font-bold text-[#4a1c24] mb-6 pb-3 border-b border-[#e8dcd8] flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#a0525f]" />
                {t('profile.orders', 'طلباتي')}
              </h2>

              {isLoadingOrders ? (
                <div className="py-16 flex flex-col items-center justify-center text-[#a0525f]">
                  <Loader2 className="w-10 h-10 animate-spin mb-3" />
                  <p className="font-bold text-sm">{isRTL ? 'جاري تحميل الطلبات...' : 'Loading orders...'}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-[#fdf5f6] text-[#a0525f] rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#4a1c24] mb-2">
                    {t('profile.noOrders', 'لم تقم بإنشاء أي طلبات حتى الآن.')}
                  </h3>
                  <p className="text-sm text-[#4a1c24]/60 mb-6">
                    {isRTL ? 'استكشف منتجاتنا اليدوية المميزة وابدأ طلبك الأول الآن.' : 'Explore our handmade creations and place your first order.'}
                  </p>
                  <Link
                    to="/products"
                    className="inline-block bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    {t('profile.exploreProducts', 'تصفح المنتجات')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-[#e8dcd8] rounded-2xl p-5 hover:border-[#a0525f]/40 transition-colors bg-[#fdfaf8]/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#e8dcd8]">
                        <div>
                          <span className="text-xs text-[#a0525f] font-bold block mb-0.5">
                            {t('profile.orderNumber', 'رقم الطلب')}
                          </span>
                          <span className="font-serif font-bold text-lg text-[#4a1c24]">
                            #{order.order_number || order.id}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            {order.status}
                          </span>
                          <span className="block text-xs text-gray-400 mt-1">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 flex flex-wrap items-center justify-between gap-4 text-sm">
                        <div className="text-[#4a1c24]/80">
                          <span>{t('profile.paymentMethod', 'طريقة الدفع')}: </span>
                          <span className="font-bold">
                            {order.payment_method === 'paymob' ? 'Paymob' : (isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery')}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-xs text-gray-500 block">{t('profile.orderTotal', 'الإجمالي')}</span>
                          <span className="font-bold text-lg text-[#a0525f]">
                            {order.total} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className="max-w-2xl bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-[#e8dcd8]">
              <h2 className="text-xl font-serif font-bold text-[#4a1c24] mb-6 pb-3 border-b border-[#e8dcd8] flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#a0525f]" />
                {t('profile.security', 'الأمان وكلمة المرور')}
              </h2>

              {passwordMessage && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2.5 ${
                    passwordMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#4a1c24] mb-2">
                    {t('profile.currentPassword', 'كلمة المرور الحالية')}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fdfaf8] border border-[#e8dcd8] rounded-xl py-3 px-4 outline-none focus:border-[#a0525f] focus:ring-2 focus:ring-[#a0525f]/20 transition-all text-[#4a1c24]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 end-0 pe-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4a1c24] mb-2">
                    {t('profile.newPassword', 'كلمة المرور الجديدة')}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fdfaf8] border border-[#e8dcd8] rounded-xl py-3 px-4 outline-none focus:border-[#a0525f] focus:ring-2 focus:ring-[#a0525f]/20 transition-all text-[#4a1c24]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 end-0 pe-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4a1c24] mb-2">
                    {t('profile.confirmNewPassword', 'تأكيد كلمة المرور الجديدة')}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fdfaf8] border border-[#e8dcd8] rounded-xl py-3 px-4 outline-none focus:border-[#a0525f] focus:ring-2 focus:ring-[#a0525f]/20 transition-all text-[#4a1c24]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center justify-center gap-2 bg-[#a0525f] hover:bg-[#8e4551] text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isUpdatingPassword ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>{t('profile.updatePassword', 'تحديث كلمة المرور')}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
