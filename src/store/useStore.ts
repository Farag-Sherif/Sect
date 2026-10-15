import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiUser, ApiSettings, ApiGovernorate } from '../api/types';
import { setAuthToken, getAuthToken } from '../api/client';
import { wishlistService, authService, locationsService } from '../api/services';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  slug?: string;
  stock_quantity?: number;
  is_in_stock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
}

interface StoreState {
  // Auth state
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: ApiUser, token: string) => void;
  updateUser: (user: Partial<ApiUser>) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  // Settings state
  settings: ApiSettings | null;
  setSettings: (settings: ApiSettings) => void;

  // Shipping & Governorates state
  governorates: ApiGovernorate[];
  selectedGovId: string | number | null;
  shippingCost: number;
  isLoadingShipping: boolean;
  fetchGovernorates: () => Promise<void>;
  setSelectedGovId: (id: string | number) => void;

  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;

  // Favorites state
  favorites: Product[];
  toggleFavorite: (product: Product) => Promise<void>;
  removeFromFavorites: (id: string | number) => Promise<void>;
  isFavorite: (id: string | number) => boolean;
  syncFavoritesFromServer: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: getAuthToken(),
      isAuthenticated: !!getAuthToken(),

      setAuth: (user, token) => {
        setAuthToken(token);
        set({ user, token, isAuthenticated: true });
        get().syncFavoritesFromServer().catch(() => {});
      },

      updateUser: (updated) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : (updated as ApiUser),
        }));
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // ignore network error on logout
        } finally {
          setAuthToken(null);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const token = getAuthToken();
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }
        try {
          const profile = await authService.getProfile();
          set({ user: profile, token, isAuthenticated: true });
        } catch {
          setAuthToken(null);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Settings
      settings: null,
      setSettings: (settings) => set({ settings }),

      // Shipping & Governorates
      governorates: [],
      selectedGovId: null,
      shippingCost: 0,
      isLoadingShipping: false,

      fetchGovernorates: async () => {
        if (get().governorates.length > 0 && get().shippingCost > 0) return;
        set({ isLoadingShipping: true });
        try {
          const data = await locationsService.getGovernorates();
          if (Array.isArray(data) && data.length > 0) {
            const savedId = get().selectedGovId;
            const currentGov = savedId
              ? data.find(g => String(g.id) === String(savedId)) || data[0]
              : data[0];

            set({
              governorates: data,
              selectedGovId: currentGov.id,
              shippingCost: Number(currentGov.shipping_cost) || 0,
              isLoadingShipping: false,
            });
          } else {
            set({ isLoadingShipping: false });
          }
        } catch (err) {
          console.error('Failed to load governorates in store:', err);
          set({ isLoadingShipping: false });
        }
      },

      setSelectedGovId: (id: string | number) => {
        const gov = get().governorates.find(g => String(g.id) === String(id));
        if (gov) {
          set({
            selectedGovId: gov.id,
            shippingCost: Number(gov.shipping_cost) || 0,
          });
        } else {
          set({ selectedGovId: id });
        }
      },

      // Cart
      cart: [],
      addToCart: (product, quantity = 1, color, size) => {
        set((state) => {
          const prodId = String(product.id);
          const existing = state.cart.find(
            item => String(item.id) === prodId && item.color === color && item.size === size
          );
          if (existing) {
            return {
              cart: state.cart.map(item =>
                String(item.id) === prodId && item.color === color && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, id: prodId, quantity, color, size }] };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter(item => String(item.id) !== String(id)),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          cart: state.cart.map(item =>
            String(item.id) === String(id) ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      // Favorites
      favorites: [],

      toggleFavorite: async (product) => {
        const prodId = String(product.id);
        const exists = get().favorites.some(p => String(p.id) === prodId);

        // Optimistically update local state
        set((state) => ({
          favorites: exists
            ? state.favorites.filter(p => String(p.id) !== prodId)
            : [...state.favorites, { ...product, id: prodId }],
        }));

        // If authenticated, sync with API
        if (get().isAuthenticated) {
          try {
            const numericId = typeof product.id === 'number' ? product.id : parseInt(String(product.id), 10);
            if (!isNaN(numericId)) {
              await wishlistService.toggleWishlist(numericId);
            }
          } catch (e) {
            console.error('Failed to sync wishlist to server:', e);
          }
        }
      },

      removeFromFavorites: async (id) => {
        const prodId = String(id);
        set((state) => ({
          favorites: state.favorites.filter(p => String(p.id) !== prodId),
        }));

        if (get().isAuthenticated) {
          try {
            const numericId = typeof id === 'number' ? id : parseInt(String(id), 10);
            if (!isNaN(numericId)) {
              await wishlistService.toggleWishlist(numericId);
            }
          } catch (e) {
            console.error('Failed to remove from wishlist on server:', e);
          }
        }
      },

      isFavorite: (id) => {
        return get().favorites.some(p => String(p.id) === String(id));
      },

      syncFavoritesFromServer: async () => {
        if (!get().isAuthenticated) return;
        try {
          const serverWishlist = await wishlistService.getWishlist();
          if (Array.isArray(serverWishlist)) {
            const formatted: Product[] = serverWishlist.map((item) => ({
              id: String(item.id),
              name: item.name,
              price: item.discounted_price || item.price,
              image: item.primary_image || '',
              category: item.category?.name || 'Handmade',
              rating: item.rating_avg || 5,
              reviews: item.rating_count || 0,
              slug: item.slug,
              stock_quantity: item.stock_quantity,
              is_in_stock: item.is_in_stock,
            }));
            set({ favorites: formatted });
          }
        } catch (e) {
          console.error('Failed to fetch wishlist from server:', e);
        }
      },
    }),
    {
      name: 'sect-store',
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        settings: state.settings,
        selectedGovId: state.selectedGovId,
        shippingCost: state.shippingCost,
      }),
    }
  )
);
