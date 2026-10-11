import { ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const products = [
  {
    id: 1,
    title: 'شنطة كروشيه',
    price: '$36.00',
    rating: 4.5,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1611078566938-16104c86218e?w=500&q=80',
    tag: 'جديد'
  },
  {
    id: 2,
    title: 'باقة ورد كروشيه',
    price: '$26.00',
    rating: 5,
    reviews: 153,
    image: 'https://images.unsplash.com/photo-1611078566938-16104c86218e?w=500&q=80',
    tag: 'الأكثر مبيعاً'
  },
  {
    id: 3,
    title: 'بطانية بقمط',
    price: '$24.80',
    rating: 4,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1611078566938-16104c86218e?w=500&q=80',
    tag: 'جديد'
  },
  {
    id: 4,
    title: 'دبدوب كروشيه',
    price: '$22.00',
    rating: 5,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1611078566938-16104c86218e?w=500&q=80',
    tag: 'مميز'
  }
];

export default function SuggestedProducts() {
  return (
    <div className="w-full bg-white font-arabic my-10 max-w-[1400px] mx-auto px-4 md:px-8">
      
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 w-full">
        <div className="flex-1 text-right w-full lg:max-w-2xl">
          <span className="text-[#d96677] font-medium text-sm mb-2 block">مقترحات مخصصة لك</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#33151b] mb-3">منتجات تناسب ذوقك</h2>
          <p className="text-gray-500 text-sm lg:text-base leading-relaxed">
            بناءً على اهتماماتك وتصفحك، اخترنا لك مجموعة من المنتجات التي نعتقد أنها ستعجبك.
          </p>
        </div>
        
        <button className="bg-[#33151b] hover:bg-black text-white px-7 py-3 rounded-full flex items-center justify-center gap-2 transition-colors font-medium text-sm lg:self-center shrink-0">
          <span>اكتشفي المزيد</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-[2rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col group cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            
            {/* Image Wrapper */}
            <div className="relative h-[280px] rounded-[1.5rem] overflow-hidden mb-4">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
              {/* Heart Icon (Top Left in RTL) */}
              <button className="absolute top-4 left-4 p-2 bg-[#fff8f5]/90 backdrop-blur-sm rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors z-10 shadow-sm">
                <Heart className="w-4 h-4" />
              </button>
              
              {/* Tag (Top Right in RTL) */}
              <div className="absolute top-4 right-4 bg-[#d96677] text-white text-[11px] px-3.5 py-1.5 rounded-full font-medium z-10 shadow-sm">
                {product.tag}
              </div>
            </div>
            
            {/* Card Content */}
            <div className="flex flex-col text-right px-2 pb-2 flex-1 justify-between">
              <div>
                <h3 className="font-bold text-[#33151b] text-base mb-1.5">{product.title}</h3>
                
                <div className="flex items-center justify-end gap-1.5 mb-4" dir="ltr">
                  <span className="text-[11px] text-gray-400">({product.reviews})</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn("w-3.5 h-3.5", star <= Math.floor(product.rating) ? "fill-[#ffc107] text-[#ffc107]" : "fill-transparent text-gray-300")} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full mt-auto">
                <span className="font-bold text-[#33151b] text-[1.1rem]">{product.price}</span>
                <button className="p-2.5 bg-[#fff0f2] text-[#d96677] hover:bg-[#ffe0e6] rounded-full transition-colors flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
