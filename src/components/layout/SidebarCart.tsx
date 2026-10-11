// @ts-ignore
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface SidebarCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarCart({ isOpen, onClose }: SidebarCartProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';
  const items = useStore(state => state.cart);
  const clearCart = useStore(state => state.clearCart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[100] transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-full sm:w-[400px] bg-[#FCF8F9] z-[110] shadow-2xl flex flex-col transform transition-transform duration-300 ${isRTL ? 'translate-x-0' : 'translate-x-0'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Decorative Background at Bottom */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col items-center justify-center">
           <img src="/images/decorations/floral.png" className={`absolute bottom-0 inset-x-0 w-full h-64 object-cover opacity-40 ${isRTL ? '' : 'scale-x-[-1]'}`} alt="floral" />
           
           {/* Watermark Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-20 transform -rotate-[15deg] scale-[1.3] w-full">
             <div className="font-handwriting text-4xl text-[#a0525f] text-center leading-[1.2] whitespace-nowrap">
                Thank you<br/>
                for choosing Sect
             </div>
             <div className="text-[#a0525f] mt-4 text-3xl">♡</div>
           </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EACBD0]/40 relative z-10 bg-[#FCF8F9]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold text-text-dark">{t('cart.heroTitle')}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-text-light" />
          </button>
        </div>

        {/* Items Count & Clear */}
        <div className="flex items-center justify-between px-6 py-4 relative z-10 bg-[#FCF8F9]">
          <span className="text-sm font-medium text-text-light">{items.reduce((acc, i) => acc + i.quantity, 0)} {t('cart.items').toLowerCase()}</span>
          <button onClick={() => clearCart()} className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors">
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-2 relative z-10 scrollbar-thin scrollbar-thumb-primary/20">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-bold text-text-dark text-[15px] leading-tight mb-1">{item.name}</h3>
                    <p className="text-[12px] text-text-light">{item.category}</p>
                  </div>
                  <div className="font-bold text-text-dark text-[14px]">EGP {item.price}</div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.id)} className="text-text-light hover:text-primary transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center bg-white border border-[#EACBD0]/60 rounded-lg overflow-hidden shadow-sm">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1.5 hover:bg-primary/5 text-text-light transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center text-[13px] font-bold text-text-dark">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-primary/5 text-text-light transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-6 border-t border-[#EACBD0]/40 relative z-10 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.03)]">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm font-medium text-text-dark">
              <span>{t('cart.subtotal')}</span>
              <span>EGP {total}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-text-dark">
              <span>{t('cart.shipping')}</span>
              <span>EGP {total > 0 ? 60 : 0}</span>
            </div>
            <div className="pt-3 border-t border-[#EACBD0]/40 flex justify-between items-center">
              <span className="text-lg font-bold text-text-dark">{t('cart.totalOrder')}</span>
              <span className="text-xl font-bold text-primary">EGP {total > 0 ? total + 60 : 0}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => { onClose(); navigate('/cart'); }} className="w-full bg-[#9A3B50] hover:bg-[#833244] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5" />
              {t('cart.viewCart')} 
              <span className={isRTL ? "rotate-180" : ""}>→</span>
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('cart.continueShopping')}
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}
