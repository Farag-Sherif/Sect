import { useTranslation } from 'react-i18next';

export const useMockData = () => {
  const { t } = useTranslation();

  const navigationLinks = [
    { id: 'home', label: t('nav.home'), path: '/' },
    { id: 'store', label: t('nav.store'), path: '/products' },
    { id: 'collections', label: t('nav.collections', 'Collections'), path: '/collections' },
    { id: 'journal', label: t('nav.journal', 'Journal'), path: '/journal' },
    { id: 'about', label: t('nav.story'), path: '/about' },
    { id: 'contact', label: t('nav.contact'), path: '/contact' },
  ];

  const features = [
    { id: 'payment', title: t('features.paymentTitle'), subtitle: t('features.paymentSubtitle'), icon: 'ShieldCheck' },
    { id: 'shipping', title: t('features.shippingTitle'), subtitle: t('features.shippingSubtitle'), icon: 'Truck' },
    { id: 'details1', title: t('features.details1Title'), subtitle: t('features.details1Subtitle'), icon: 'Gift' },
    { id: 'details2', title: t('features.details2Title'), subtitle: t('features.details2Subtitle'), icon: 'GiftBox' },
    { id: 'materials', title: t('features.materialsTitle'), subtitle: t('features.materialsSubtitle'), icon: 'Leaf' },
  ];

  const categories = [
    { id: 'winter', name: t('categories.winterName'), subtitle: t('categories.winterSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'kids', name: t('categories.kidsName'), subtitle: t('categories.kidsSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'bags', name: t('categories.bagsName'), subtitle: t('categories.bagsSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'home', name: t('categories.homeName'), subtitle: t('categories.homeSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'gifts', name: t('categories.giftsName'), subtitle: t('categories.giftsSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'accessories', name: t('categories.accessoriesName'), subtitle: t('categories.accessoriesSubtitle'), image: '/images/products/placeholder.jpg' },
  ];

  const categoryPills = [
    { id: 'myself', name: t('categoryPills.myself'), icon: 'Heart' },
    { id: 'occasions', name: t('categoryPills.occasions'), icon: 'Gift' },
    { id: 'offices', name: t('categoryPills.offices'), icon: 'Package' },
    { id: 'decor', name: t('categoryPills.decor'), icon: 'Flower' },
    { id: 'season', name: t('categoryPills.season'), icon: 'Sun' },
    { id: 'giveaways', name: t('categoryPills.giveaways'), icon: 'Gift' },
  ];

  const products = [
    { id: 'p1', name: t('products.p1Name'), price: 22.00, rating: 4.8, reviews: 65, image: '/images/products/placeholder.jpg', badge: t('products.p1Badge'), category: 'kids' },
    { id: 'p2', name: t('products.p2Name'), price: 24.80, rating: 4.9, reviews: 112, image: '/images/products/placeholder.jpg', badge: t('products.p2Badge'), category: 'kids' },
    { id: 'p3', name: t('products.p3Name'), price: 26.00, rating: 5.0, reviews: 153, image: '/images/products/placeholder.jpg', badge: t('products.p3Badge'), category: 'decor' },
    { id: 'p4', name: t('products.p4Name'), price: 36.00, rating: 4.7, reviews: 84, image: '/images/products/placeholder.jpg', badge: t('products.p4Badge'), category: 'bags' }
  ];

  const bestsellers = [
    { id: 'b1', name: t('products.b1Name'), price: 24.00, rating: 4.9, reviews: 89, image: '/images/products/placeholder.jpg', badge: t('products.b1Badge'), category: 'kids' },
    { id: 'b2', name: t('products.b2Name'), price: 26.00, rating: 4.8, reviews: 76, image: '/images/products/placeholder.jpg', badge: t('products.b2Badge'), category: 'winter' },
    { id: 'b3', name: t('products.b3Name'), price: 36.00, rating: 5.0, reviews: 142, image: '/images/products/placeholder.jpg', badge: t('products.b3Badge'), category: 'decor' },
    { id: 'b4', name: t('products.b4Name'), price: 38.00, rating: 4.9, reviews: 215, image: '/images/products/placeholder.jpg', badge: t('products.b4Badge'), category: 'decor' }
  ];

  const occasions = [
    { id: 'events', title: t('occasions.eventsTitle'), subtitle: t('occasions.eventsSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'ramadan', title: t('occasions.ramadanTitle'), subtitle: t('occasions.ramadanSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'wedding', title: t('occasions.weddingTitle'), subtitle: t('occasions.weddingSubtitle'), image: '/images/products/placeholder.jpg' },
    { id: 'birthday', title: t('occasions.birthdayTitle'), subtitle: t('occasions.birthdaySubtitle'), image: '/images/products/placeholder.jpg' },
  ];

  const testimonials = [
    { id: 't1', name: t('testimonials.t1Name'), role: t('testimonials.t1Role'), text: t('testimonials.t1Text'), rating: 5, image: '/images/products/placeholder.jpg' },
    { id: 't2', name: t('testimonials.t2Name'), role: t('testimonials.t2Role'), text: t('testimonials.t2Text'), rating: 5, image: '/images/products/placeholder.jpg' },
    { id: 't3', name: t('testimonials.t3Name'), role: t('testimonials.t3Role'), text: t('testimonials.t3Text'), rating: 5, image: '/images/products/placeholder.jpg' }
  ];

  return { navigationLinks, features, categories, categoryPills, products, bestsellers, occasions, testimonials };
};
