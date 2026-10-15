import { apiClient, setAuthToken } from './client';
import type {
  ApiResponse,
  ApiUser,
  AuthResponse,
  ApiProduct,
  ApiCategory,
  ApiHomepageData,
  ApiSettings,
  ApiGovernorate,
  ApiCity,
  ApiAddress,
  ApiCart,
  ApiOrder,
  ApiBlogPost,
  ApiBlogCategory,
  ApiPage,
  ApiFaq,
  ApiNotification,
  ProductReview,
} from './types';

// ==================== AUTH SERVICE ====================
export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    mobile_number?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/register', data);
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/login', data);
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/customer/logout');
    } finally {
      setAuthToken(null);
    }
  },

  async getProfile(): Promise<ApiUser> {
    const res = await apiClient.get<ApiResponse<ApiUser>>('/customer/profile');
    return res.data;
  },

  async updateProfile(data: { name?: string; mobile_number?: string }): Promise<ApiUser> {
    const res = await apiClient.put<ApiResponse<ApiUser>>('/customer/profile', data);
    return res.data;
  },

  async changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await apiClient.put('/customer/profile/password', data);
  },
};

// ==================== PRODUCTS SERVICE ====================
export interface GetProductsParams {
  category?: string;
  category_id?: number | string;
  featured?: number | string;
  min_price?: number;
  max_price?: number;
  search?: string;
  per_page?: number;
  page?: number;
  sort?: 'created_at' | 'price' | 'rating' | string;
  order?: 'asc' | 'desc';
}

let cachedCategories: ApiCategory[] | null = null;

export const categoriesService = {
  async getCategories(): Promise<ApiCategory[]> {
    if (cachedCategories && cachedCategories.length > 0) return cachedCategories;
    const res = await apiClient.get<ApiResponse<ApiCategory[]>>('/categories');
    cachedCategories = res.data || [];
    return cachedCategories;
  },

  async getCategoryBySlug(slug: string): Promise<ApiCategory> {
    const res = await apiClient.get<ApiResponse<ApiCategory>>(`/categories/${slug}`);
    return res.data;
  },
};

export const productsService = {
  async getProducts(params?: GetProductsParams): Promise<{ products: ApiProduct[]; meta?: any }> {
    const queryParams: any = { ...params };

    // Resolve category slug to category_id
    if (queryParams.category && !queryParams.category_id) {
      if (!isNaN(Number(queryParams.category))) {
        queryParams.category_id = Number(queryParams.category);
      } else {
        try {
          const cats = await categoriesService.getCategories();
          const found = cats.find(c => c.slug === queryParams.category || String(c.id) === String(queryParams.category));
          if (found) {
            queryParams.category_id = found.id;
          }
        } catch {
          // fallback gracefully
        }
      }
    }

    const res = await apiClient.get<ApiResponse<ApiProduct[]>>('/products', queryParams);
    let products = res.data || [];

    // Client-side guarantee for category filtering
    if (queryParams.category || queryParams.category_id) {
      const catSlug = queryParams.category ? String(queryParams.category).toLowerCase() : null;
      const catId = queryParams.category_id ? Number(queryParams.category_id) : null;

      products = products.filter(p => {
        if (!p.category) return false;
        if (catId !== null && p.category.id === catId) return true;
        if (catSlug && p.category.slug?.toLowerCase() === catSlug) return true;
        return false;
      });
    }

    // Client-side guarantee for sorting
    if (queryParams.sort) {
      const isAsc = queryParams.order === 'asc';
      if (queryParams.sort === 'price') {
        products = [...products].sort((a, b) => {
          const priceA = a.discounted_price || a.price;
          const priceB = b.discounted_price || b.price;
          return isAsc ? priceA - priceB : priceB - priceA;
        });
      } else if (queryParams.sort === 'rating') {
        products = [...products].sort((a, b) => {
          const ratingA = a.rating_avg || 0;
          const ratingB = b.rating_avg || 0;
          return isAsc ? ratingA - ratingB : ratingB - ratingA;
        });
      }
    }

    return {
      products,
      meta: res.meta,
    };
  },

  async getProductBySlug(slug: string | number): Promise<ApiProduct> {
    const res = await apiClient.get<ApiResponse<ApiProduct>>(`/products/${slug}`);
    return res.data;
  },

  async getProductReviews(productId: number | string): Promise<ProductReview[]> {
    const res = await apiClient.get<ApiResponse<ProductReview[]>>(`/products/${productId}/reviews`);
    return res.data || [];
  },
};

// ==================== HOMEPAGE SERVICE ====================
export const homepageService = {
  async getHomepageData(): Promise<ApiHomepageData> {
    const res = await apiClient.get<ApiResponse<ApiHomepageData>>('/homepage');
    return res.data;
  },
};

// ==================== SETTINGS SERVICE ====================
export const settingsService = {
  async getSettings(): Promise<ApiSettings> {
    const res = await apiClient.get<ApiResponse<ApiSettings>>('/settings');
    return res.data;
  },
};

// ==================== LOCATIONS SERVICE ====================
export const locationsService = {
  async getGovernorates(): Promise<ApiGovernorate[]> {
    const res = await apiClient.get<ApiResponse<ApiGovernorate[]>>('/governorates');
    return res.data || [];
  },

  async getCitiesByGovernorate(governorateId: number | string): Promise<ApiCity[]> {
    const res = await apiClient.get<ApiResponse<ApiCity[]>>(`/governorates/${governorateId}/cities`);
    return res.data || [];
  },
};

// ==================== CONTACT & NEWSLETTER ====================
export const contactService = {
  async sendContactMessage(data: {
    name?: string;
    full_name?: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ message: string }> {
    const payload = {
      name: data.name || data.full_name || '',
      full_name: data.full_name || data.name || '',
      email: data.email,
      subject: data.subject,
      message: data.message,
    };
    const res = await apiClient.post<ApiResponse<any>>('/contact', payload);
    return { message: res.message || 'Message sent successfully.' };
  },

  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    const res = await apiClient.post<ApiResponse<any>>('/newsletter', { email });
    return { message: res.message || 'Subscribed successfully.' };
  },
};

// ==================== STATIC PAGES & FAQ ====================
export const pagesService = {
  async getPages(): Promise<ApiPage[]> {
    const res = await apiClient.get<ApiResponse<ApiPage[]>>('/pages');
    return res.data || [];
  },

  async getPageBySlug(slug: string): Promise<ApiPage> {
    const res = await apiClient.get<ApiResponse<ApiPage>>(`/pages/${slug}`);
    return res.data;
  },
};

export const faqsService = {
  async getFaqs(): Promise<ApiFaq[]> {
    const res = await apiClient.get<ApiResponse<ApiFaq[]>>('/faqs');
    return res.data || [];
  },
};

// ==================== BLOG SERVICE ====================
export const blogService = {
  async getPosts(params?: { category?: string; page?: number; per_page?: number }): Promise<{ posts: ApiBlogPost[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<ApiBlogPost[]>>('/blog/posts', params);
    return {
      posts: res.data || [],
      meta: res.meta,
    };
  },

  async getPostBySlug(slug: string): Promise<ApiBlogPost> {
    const res = await apiClient.get<ApiResponse<ApiBlogPost>>(`/blog/posts/${slug}`);
    return res.data;
  },

  async getCategories(): Promise<ApiBlogCategory[]> {
    const res = await apiClient.get<ApiResponse<ApiBlogCategory[]>>('/blog/categories');
    return res.data || [];
  },
};

// ==================== CUSTOMER CART SERVICE ====================
export const cartService = {
  async getCart(): Promise<ApiCart> {
    const res = await apiClient.get<ApiResponse<ApiCart>>('/customer/cart');
    return res.data;
  },

  async addToCart(productId: number, quantity: number = 1): Promise<ApiCart> {
    const res = await apiClient.post<ApiResponse<ApiCart>>('/customer/cart', {
      product_id: productId,
      quantity,
    });
    return res.data;
  },

  async updateCartItem(itemId: number, quantity: number): Promise<ApiCart> {
    const res = await apiClient.put<ApiResponse<ApiCart>>(`/customer/cart/items/${itemId}`, {
      quantity,
    });
    return res.data;
  },

  async removeCartItem(itemId: number): Promise<ApiCart> {
    const res = await apiClient.delete<ApiResponse<ApiCart>>(`/customer/cart/items/${itemId}`);
    return res.data;
  },
};

// ==================== CUSTOMER ADDRESSES ====================
export const addressService = {
  async getAddresses(): Promise<ApiAddress[]> {
    try {
      const res = await apiClient.get<ApiResponse<ApiAddress[]>>('/customer/addresses');
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createAddress(data: {
    full_name: string;
    phone: string;
    country: string;
    governorate_id: number;
    city_id: number;
    city?: string;
    street: string;
    is_default?: boolean;
  }): Promise<ApiAddress> {
    const res = await apiClient.post<ApiResponse<ApiAddress>>('/customer/addresses', data);
    return res.data;
  },

  async updateAddress(id: number, data: Partial<ApiAddress>): Promise<ApiAddress> {
    const res = await apiClient.put<ApiResponse<ApiAddress>>(`/customer/addresses/${id}`, data);
    return res.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/customer/addresses/${id}`);
  },
};

// ==================== CUSTOMER ORDERS ====================
export const ordersService = {
  async createOrder(data: {
    address_id?: number;
    shipping_address_id?: number;
    payment_method: 'cash' | 'cash_on_delivery' | 'paymob';
    notes?: string;
  }): Promise<ApiOrder> {
    const payload = {
      shipping_address_id: data.shipping_address_id || data.address_id,
      address_id: data.address_id || data.shipping_address_id,
      payment_method: data.payment_method === 'cash' ? 'cash_on_delivery' : data.payment_method,
      notes: data.notes,
    };
    const res = await apiClient.post<ApiResponse<ApiOrder>>('/customer/orders', payload);
    return res.data;
  },

  async getOrders(): Promise<ApiOrder[]> {
    const res = await apiClient.get<ApiResponse<ApiOrder[]>>('/customer/orders');
    return res.data || [];
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiOrder> {
    const res = await apiClient.get<ApiResponse<ApiOrder>>(`/customer/orders/${orderNumber}`);
    return res.data;
  },
};

// ==================== CUSTOMER WISHLIST ====================
export const wishlistService = {
  async getWishlist(): Promise<ApiProduct[]> {
    const res = await apiClient.get<ApiResponse<ApiProduct[]>>('/customer/wishlist');
    return res.data || [];
  },

  async toggleWishlist(productId: number): Promise<{ added: boolean }> {
    const res = await apiClient.post<ApiResponse<{ added: boolean }>>('/customer/wishlist', {
      product_id: productId,
    });
    return res.data;
  },
};

// ==================== CUSTOMER REVIEWS ====================
export const reviewsService = {
  async createReview(data: {
    product_id: number;
    rating: number;
    comment: string;
  }): Promise<ProductReview> {
    const res = await apiClient.post<ApiResponse<ProductReview>>('/customer/reviews', data);
    return res.data;
  },

  async getMyReviews(): Promise<ProductReview[]> {
    const res = await apiClient.get<ApiResponse<ProductReview[]>>('/customer/reviews');
    return res.data || [];
  },
};

// ==================== NOTIFICATIONS ====================
export const notificationsService = {
  async getNotifications(): Promise<ApiNotification[]> {
    const res = await apiClient.get<ApiResponse<ApiNotification[]>>('/customer/notifications');
    return res.data || [];
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<ApiResponse<{ count: number }>>('/customer/notifications/unread-count');
    return res.data?.count ?? 0;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.put(`/customer/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put('/customer/notifications/read-all');
  },
};
