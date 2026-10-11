# 🌸 Sect — Handmade With Love (سكت — صُنع بحب)

> **A luxury boutique e-commerce platform for bespoke handmade gifts, artisan crochet creations, and curated floral collections.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.3-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![i18next](https://img.shields.io/badge/i18next-Bilingual_AR%2FEN-26A69A?style=flat-square)](https://www.i18next.com/)

---

## 📖 جدول المحتويات (Table of Contents)

1. [نظرة عامة على المشروع (Project Overview)](#-نظرة-عامة-على-المشروع-project-overview)
2. [المميزات والخصائص الفريدة (Key Features)](#-المميزات-والخصائص-الفريدة-key-features)
3. [البنية التقنية (Tech Stack)](#-البنية-التقنية-tech-stack)
4. [هيكلية المجلدات والملفات (Project Architecture)](#-هيكلية-المجلدات-والملفات-project-architecture)
5. [الصفحات ومكونات الموقع (Pages & Modules)](#-الصفحات-ومكونات-الموقع-pages--modules)
6. [التجربة السينمائية ثلاثية الأبعاد (Cinematic Hero Experience)](#-التجربة-السينمائية-cinematic-hero-experience)
7. [نظام الترجمة وتعدد اللغات (i18n & RTL/LTR)](#-نظام-الترجمة-وتعدد-اللغات-i18n--rtlltr)
8. [نظام الألوان والخطوط (Design Tokens & Typography)](#-نظام-الألوان-والخطوط-design-tokens--typography)
9. [التشغيل والتثبيت (Getting Started)](#-التشغيل-والتثبيت-getting-started)
10. [الأوامر المتاحة (Available Scripts)](#-الأوامر-المتاحة-available-scripts)

---

## 🌟 نظرة عامة على المشروع (Project Overview)

**Sect** هو موقع تجارة إلكترونية فاخر متكامل مخصص لمنتجات الهدايا المصنوعة يدويًا وفنون الكروشيه والإكسسوارات الفنية. تم بناء الموقع بأحدث تقنيات الويب المعاصرة لتوفير تجربة تسوق غامرة تجمع بين الجماليات البصرية الفائقة، والأداء فائق السرعة، والتوافق الكامل مع مختلف أحجام الشاشات وتعدد اللغات (العربية والإنجليزية).

---

## ✨ المميزات والخصائص الفريدة (Key Features)

- **🎬 تجربة سينمائية تفاعلية (Cinematic Scroll Engine):**
  - سكشن هيرو رئيسي يمتد على مسافة `1200vh`، يقوم بمسح وإظهار `744` إطار بدقة عالية بسلاسة تامة مرتبطة بسرعة التمرير عبر HTML5 Canvas.
  - سرد قصة البراند عبر 5 مشاهد تفاعلية متتالية (الافتتاحية، مميزات المتجر، قصة الحرفة، استكشاف الأقسام، العروض الخاصة).
- **🌍 دعم ثنائي اللغة بالكامل (Full Bilingual Support):**
  - الإنجليزية (اللغة الافتراضية الأولى - LTR) والعربية (RTL).
  - تبديل فوري وسلس لاتجاه الصفحة وكافة النصوص والفلاتر دون الحاجة لإعادة تحميل الموقع.
- **📱 تصميم متجاوب فائق الدقة (100% Mobile Responsive):**
  - قائمة تنقل جانبية للموبايل (`MobileNavDrawer`) تنزلق بسلاسة مع بحث متقدم وروابط سريعة وتبديل لغة.
  - سلايدرز متجاوبة للبطاقات (`Testimonials`, `Occasions`, `Bestsellers`) تدعم الـ touch والـ snap بدون أي قص للهوامش.
- **🛍️ دورة تسوق متكاملة (E-Commerce Workflow):**
  - كتالوج منتجات مع فلاتر حية للأقسام وتصنيف متعدد (الأحدث، السعر من الأقل للأعلى / الأعلى للأقل، الأكثر شعبية، الأعلى تقييماً، الترتيب الأبجدي).
  - صفحة تفاصيل منتج شاملة مع معرض صور ذكي، واختيار الألوان والأحجام، وكتابة إهداء مخصص.
  - سلة مشتريات ديناميكية ببانر كاليجرافي حصري ("Handmade with love ♡") مع نافذة سلة سريعة جانبية (`SidebarCart`).
  - صفحة إتمام طلب (`Checkout`) متعددة الخطوات مع خيارات دفع متنوعة وكوبونات خصم.
- **❤️ المفضلة والسلة المحفوظة (Zustand Persistence):**
  - إدارة حالة السلة وقائمة الرغبات في الذاكرة مع تحديث فوري لعدادات الـ Header.
- **🎨 هوية بصرية مخصصة (Custom Artisanal Aesthetics):**
  - خطوط راقية: *Playfair Display* للعناوين الكلاسيكية، *Great Vibes* للعبارات اليدوية، و *Almarai* للنصوص العربية.

---

## 🛠️ البنية التقنية (Tech Stack)

| المجال | التقنية | الإصدار | الوصف |
| :--- | :--- | :--- | :--- |
| **Core Framework** | **React** | `19.2.8` | أحدث إصدار من رياكت مع تحسينات الأداء الفائقة |
| **Language** | **TypeScript** | `~6.0.2` | أمان تام للأنواع والواجهات البرمجية |
| **Build Tool** | **Vite** | `8.3.0` | تجميع فائق السرعة وتحديث لحظي (HMR) |
| **Styling** | **Tailwind CSS** | `4.3.3` | الجيل الجديد من Tailwind مع متغيرات CSS حديثة |
| **Animation** | **Framer Motion** | `13.3.0` | حركات فيزيائية وتحريك العناصر المرتبطة بالتمرير |
| **3D & Canvas** | **Three.js** / **R3F** | `0.186.0` | دعم المشاهد ثلاثية الأبعاد وعناصر الكانفاس |
| **Localization** | **i18next** | `26.4.2` | محرك ترجمة قوي مع دعم اتجاهات RTL و LTR |
| **State Management** | **Zustand** | Custom Store | إدارة حالة السلة والمفضلة بكود نظيف وبسيط |
| **Routing** | **React Router** | `7.18.4` | إدارة الصفحات والمسارات الديناميكية |
| **Form Handling** | **React Hook Form** + **Yup** | `7.88.0` | نماذج الإدخال مع التحقق من صحة البيانات |
| **Icons** | **Lucide React** | `1.47.0` | مكتبة أيقونات متجهة عصرية وخفيفة الوزن |

---

## 📂 هيكلية المجلدات والملفات (Project Architecture)

```
sect/
├── public/
│   ├── favicon.svg                  # أيقونة الموقع
│   ├── icons.svg                    # رموز SVG مخصصة
│   └── images/
│       ├── backgrounds/             # خلفيات البانرات والصفحات
│       ├── hero bg/                 # 744 إطار تسلسلي لسكشن الهيرو السينمائي
│       ├── hero-3d/                 # خامات وأصول المشاهد ثلاثية الأبعاد
│       └── products/                # صور المنتجات والكتالوج
├── src/
│   ├── assets/                      # أصول التصميم الثابتة
│   ├── components/
│   │   ├── brand/
│   │   │   └── StoryBanner.tsx      # بانر قصة البراند والحرفة اليدوية
│   │   ├── categories/
│   │   │   └── CategoriesSection.tsx # شبكة تصنيفات المنتجات الرئيسية
│   │   ├── footer/
│   │   │   └── Footer.tsx           # الفوتر المتكامل للموقع
│   │   ├── hero/
│   │   │   ├── Hero.tsx             # سكشن الهيرو السينمائي (1200vh Canvas Engine)
│   │   │   └── Hero3DScene.tsx      # مشهد العرض ثلاثي الأبعاد
│   │   ├── home/
│   │   │   └── Features.tsx         # بطاقات مميزات الخدمة (شحن، دفع، جودة)
│   │   ├── layout/
│   │   │   ├── Header.tsx           # الهيدر العلوي وشريط التنقل الشفاف/الصلب
│   │   │   ├── Layout.tsx           # الحاوية الهيكلية العامة للصفحات
│   │   │   ├── MobileNavDrawer.tsx  # القائمة الجانبية المنزلقة لشاشات الموبايل
│   │   │   └── SidebarCart.tsx      # درج السلة السريعة المنزلق من اليمين
│   │   ├── newsletter/
│   │   │   └── Newsletter.tsx       # سكشن الاشتراك البريدي بزخارف نباتية
│   │   ├── occasions/
│   │   │   └── OccasionsSection.tsx # قسم التسوق حسب المناسبة
│   │   ├── products/
│   │   │   ├── Bestsellers.tsx      # سلايدر المنتجات الأكثر مبيعاً
│   │   │   ├── ProductCard.tsx      # كارت المنتج التفاعلي مع أزرار الإضافة والمفضلة
│   │   │   └── RecommendedProducts.tsx # المقترحات المخصصة
│   │   ├── testimonials/
│   │   │   └── TestimonialsSection.tsx # آراء وتقييمات العملاء
│   │   └── ui/
│   │       ├── FadeIn.tsx           # مكون حركة الظهور التدريجي
│   │       ├── Parallax.tsx         # مكون البارالاكس
│   │       └── Stagger.tsx          # مكون تتابع الحركات
│   ├── data/
│   │   └── mockData.ts              # قاعدة بيانات تجريبية للمنتجات والأقسام
│   ├── locales/
│   │   ├── ar.json                  # ملف الترجمة العربية الشاملة
│   │   └── en.json                  # ملف الترجمة الإنجليزية الشاملة
│   ├── pages/
│   │   ├── About/                   # صفحة من نحن وقصة الحرفيات
│   │   ├── Cart/                    # صفحة سلة المشتريات الرئيسية
│   │   ├── Checkout/                # صفحة إتمام الدفع والشحن
│   │   ├── Collections/             # صفحة التشكيلات والمجموعات الفنية
│   │   ├── Contact/                 # صفحة اتصل بنا مع الأسئلة الشائعة
│   │   ├── Favorites/               # صفحة المنتجات المفضلة (Wishlist)
│   │   ├── Home/                    # الصفحة الرئيسية المتكاملة
│   │   ├── Journal/                 # المدونة والمقالات الحرفية
│   │   ├── Login/                   # تسجيل الدخول بتصميم مقسوم
│   │   ├── ProductDetails/          # صفحة تفاصيل المنتج ومعرض الصور
│   │   ├── Products/                # كتالوج المنتجات مع الفلاتر والفرز
│   │   └── SignUp/                  # إنشاء حساب جديد
│   ├── store/
│   │   └── useStore.ts              # مخزن Zustand لإدارة السلة والمفضلة
│   ├── i18n.ts                      # إعدادات وتكوين i18next واللغة الافتراضية
│   ├── index.css                    # استيراد Tailwind ومصفوفة الخطوط والألوان
│   └── main.tsx                     # نقطة الانطلاق وإعداد التوجيه (Router)
├── package.json                     # حزم المشروع والتبعيات
├── tsconfig.json                    # إعدادات مترجم TypeScript
└── vite.config.ts                   # إعدادات Vite ومكونات التجميع
```

---

## 📄 الصفحات ومكونات الموقع (Pages & Modules)

### 1. الصفحة الرئيسية (`/`)
- تجربة الهيرو السينمائي (`Hero.tsx`) التي تسرد قصة الحرفة.
- قسم المنتجات المقترحة (`RecommendedProducts`).
- الأكثر مبيعاً (`Bestsellers`) مع إمكانية التمرير باللمس.
- المناسبات الخاصة (`OccasionsSection`) وهدايا الاحتفالات.
- تقييمات العملاء (`TestimonialsSection`).
- صندوق النشرة البريدية الحصري (`Newsletter`).

### 2. كتالوج المنتجات (`/products`)
- فلترة حسب التصنيف (كروشيه، حقائب، ورود، ديكور منزلي، هدايا).
- ترتيب ديناميكي متعدد الحالات مترجم بالكامل:
  - الأحدث (`Newest`)
  - السعر: من الأقل للأعلى (`Price: Low to High`)
  - السعر: من الأعلى للأقل (`Price: High to Low`)
  - الأكثر شعبية (`Most Popular`)
  - الأعلى تقييماً (`Highest Rating`)
  - الترتيب الأبجدي (`Alphabetical: A-Z`)
- شبكة عرض متجاوبة مع زر الإضافة السريعة وإضافة المفضلة.

### 3. صفحة تفاصيل المنتج (`/products/:id`)
- صورة رئيسية عريضة بدقة عالية.
- شريط مصغرات أفقي أنيق أسفل الصورة للتنقل بين الزوايا.
- خيارات المقاسات والألوان المتاحة.
- حقل اختياري لإضافة كارت إهداء أو رسالة مخصصة مع الطلب.
- تقييمات المشترين ومقترحات لمنتجات ذات صلة.

### 4. سلة المشتريات (`/cart`)
- بانر علوي مميز يحمل توقيع المتجر بخط يدوي مائل:
  ```
  Handmade
    with love
         ♡
  ```
- جدول عناصر السلة التفاعلي مع إمكانية تعديل الكمية وحذف العناصر.
- حقل كود الخصم الترويجي وحساب الإجمالي مع تكلفة الشحن.

### 5. إتمام الطلب (`/checkout`)
- نموذج بيانات الشحن والاتصال.
- اختيار طريقة الدفع (دفع عند الاستلام، بطاقة ائتمانية، محافظ إلكترونية).
- ملخص الطلب النهائي مع تأكيد الأمان بنسبة 100%.

### 6. صفحات إضافية متكاملة
- **المجموعات (`/collections`):** استعراض التشكيلات الموسمية مع فلاتر مخصصة.
- **المفضلة (`/favorites`):** حفظ المنتجات المرغوبة ونقلها للسلة بضغطة زر.
- **المدونة (`/journal`):** مقالات شيقة عن فن الكروشيه والعناية بالقطع اليدوية.
- **عن سكت (`/about`):** قصة الانطلاق من فكرة صغيرة، ورؤية صانعات الهدايا.
- **تواصل معنا (`/contact`):** خريطة الاستوديو، ساعات العمل، وقسم الأسئلة المتكررة (FAQ).
- **الدخول والتسجيل (`/login`, `/signup`):** واجهات عصرية بتأثيرات بصرية راقية.

---

## 🎬 التجربة السينمائية (Cinematic Hero Experience)

يعتمد سكشن الهيرو على محرك رسم مباشر عبر **HTML5 Canvas** مدمج مع **Framer Motion**:
- **تثبيت ناعم (CSS Sticky):** حاوية بارتفاع `1200vh` تحتوي على شاشة مثبتة `sticky top-0 h-screen w-full`.
- **مكتبة الإطارات:** `744` إطار تصويري سينمائي يتم تحميلها مسبقاً بنظام Look-ahead ذكي لمنع أي تقطيع أثناء التمرير.
- **تدرج سينمائي وتوافق الهواتف:** تظليل متدرج محسوب لضمان وضوح النصوص فوق الإطارات، مع ضبط للأبعاد بنسبة العرض إلى الارتفاع لمنع أي تشوه بصري على أي شاشة.

---

## 🌐 نظام الترجمة وتعدد اللغات (i18n & RTL/LTR)

تم ضبط الموقع ليعمل باللغة الإنجليزية كـ **اللغة الرئيسية الافتراضية** مع دعم فوري وكامل للغة العربية:
- ملف الترجمة الإنجليزية: [`src/locales/en.json`](file:///d:/Blue/Brain/sect/src/locales/en.json)
- ملف الترجمة العربية: [`src/locales/ar.json`](file:///d:/Blue/Brain/sect/src/locales/ar.json)
- تغيير اتجاه الصفحة تلقائياً (`dir="ltr"` عند اختيار الإنجليزية، و `dir="rtl"` عند اختيار العربية).
- تبديل أيقونات الأسهم وأزرار التنقل تلقائياً لتعكس الاتجاه الصحيح للقراءة.

---

## 🎨 نظام الألوان والخطوط (Design Tokens & Typography)

### الألوان الأساسية (Color Palette)
- **Primary Burgundy:** `#4a1d26` / `#943446` (الفخامة والعمق)
- **Soft Rose / Pink:** `#d96677` / `#ab4458` (الدفء والأنوثة)
- **Cream Background:** `#fff8f5` / `#fdf6f7` / `#fcf8f9` (الهدوء والنقاء)
- **Text Brown:** `#33151b` / `#705f62` (القراءة المريحة)

### الخطوط المستخدمة (Typography)
- **العناوين الرئيسية والفخمة:** `'Playfair Display', serif`
- **الكتابة اليدوية والعلامات الحصرية:** `'Great Vibes', cursive`
- **النصوص العربية والتطبيق:** `'Almarai', system-ui, sans-serif`

---

## 🚀 التشغيل والتثبيت (Getting Started)

### المتطلبات المسبقة:
- [Node.js](https://nodejs.org/) (الإصدار 18 أو أحدث)
- مدير الحزم [npm](https://www.npmjs.com/) أو [yarn](https://yarnpkg.com/) أو [pnpm](https://pnpm.io/)

### خطوات التثبيت:

1. **استنساخ المستودع (Clone Repository):**
   ```bash
   git clone <repository-url>
   cd sect
   ```

2. **تثبيت الحزم البرمجية (Install Dependencies):**
   ```bash
   npm install
   ```

3. **تشغيل بيئة التطوير (Run Development Server):**
   ```bash
   npm run dev
   ```
   سيتم تشغيل الموقع محلياً على: `http://localhost:5173`

4. **تجميع المشروع للإنتاج (Build for Production):**
   ```bash
   npm run build
   ```

5. **معاينة النسخة المجمعة (Preview Production Build):**
   ```bash
   npm run preview
   ```

---

## 📜 الأوامر المتاحة (Available Scripts)

- `npm run dev`: تشغيل خادم التطوير السريع عبر Vite.
- `npm run build`: فحص الأنواع البرمجية عبر TypeScript وتجميع كود الإنتاج إلى مجلد `dist/`.
- `npm run lint`: فحص جودة الكود وتوافق القواعد عبر Oxlint.
- `npm run preview`: تشغيل خادم محلي لمعاينة مخرجات مجلد `dist/`.

---

<p align="center">
  صُنع بكل حب وفخر لبراند <strong>Sect</strong> 🌸<br>
  <em>Handmade with love, just for you.</em>
</p>
