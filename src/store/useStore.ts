import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
}

interface StoreState {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      addToCart: (product, quantity = 1, color, size) => {
        set((state) => {
          const existing = state.cart.find(item => item.id === product.id && item.color === color && item.size === size);
          if (existing) {
            return {
              cart: state.cart.map(item =>
                item.id === product.id && item.color === color && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return { cart: [...state.cart, { ...product, quantity, color, size }] };
        });
      },
      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          cart: state.cart.map(item => item.id === id ? { ...item, quantity } : item)
        }));
      },
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (product) => {
        set((state) => {
          const exists = state.favorites.some(p => p.id === product.id);
          if (exists) {
            return { favorites: state.favorites.filter(p => p.id !== product.id) };
          }
          return { favorites: [...state.favorites, product] };
        });
      },
      isFavorite: (id) => get().favorites.some(p => p.id === id),
    }),
    {
      name: 'sect-store',
    }
  )
);
