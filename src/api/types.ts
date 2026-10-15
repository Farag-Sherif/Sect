// API Data Types for Sect Handmade E-Commerce

export interface ApiResponse<T = any> {
  success?: boolean;
  data: T;
  message?: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  mobile_number?: string | null;
  avatar?: string | null;
  created_at?: string;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  icon?: string | null;
  description?: string;
  is_featured?: boolean;
  products_count?: number;
  children?: ApiCategory[];
}

export interface ProductImage {
  id: number;
  url: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ProductReview {
  id: number;
  user_name?: string;
  customer_name?: string;
  user?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  rating: number;
  comment: string;
  created_at?: string;
}

export interface ApiProduct {
  id: number | string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  short_description?: string;
  shipping_and_returns?: string;
  care_instructions?: string;
  price: number;
  compare_at_price?: number | null;
  discount_percent?: number;
  discounted_price?: number;
  stock_quantity?: number;
  is_in_stock?: boolean;
  is_handmade?: boolean;
  is_featured?: boolean;
  rating_avg?: number;
  rating_count?: number;
  primary_image?: string | null;
  short_video?: string | null;
  images?: ProductImage[];
  variants?: any[];
  category?: ApiCategory | null;
  tags?: string[];
  reviews?: ProductReview[];
  created_at?: string;
}

export interface HomepageSection {
  key: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  cta_text?: string;
  cta_link?: string | null;
  data?: any;
}

export interface HomepageTestimonial {
  id: number;
  customer_name: string;
  role: string;
  avatar?: string | null;
  rating: number;
  comment: string;
  created_at?: string;
}

export interface ApiHomepageData {
  sections: HomepageSection[];
  best_sellers: ApiProduct[];
  personalized_suggestions: ApiProduct[];
  features?: any[];
  testimonials: HomepageTestimonial[];
}

export interface ApiSettings {
  currency: string;
  site_name: string;
  tagline?: string;
  support_email: string;
  phone: string;
  address: string;
  social?: {
    facebook?: string;
    instagram?: string;
    pinterest?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
}

export interface ApiCity {
  id: number;
  name: string;
  governorate_id?: number;
}

export interface ApiGovernorate {
  id: number;
  name: string;
  shipping_cost: number;
  cities?: ApiCity[];
}

export interface ApiAddress {
  id: number;
  full_name: string;
  phone: string;
  country: string;
  governorate_id: number;
  city_id: number;
  street: string;
  is_default: boolean;
  governorate?: ApiGovernorate;
  city?: ApiCity;
}

export interface ApiCartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: ApiProduct;
}

export interface ApiCart {
  id: number;
  items: ApiCartItem[];
  total: number;
  items_count: number;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  payment_method: 'cash' | 'paymob';
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  notes?: string;
  address?: ApiAddress;
  items?: {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
    primary_image?: string | null;
  }[];
  payment_url?: string;
  created_at: string;
}

export interface ApiBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  read_time?: string;
  created_at: string;
}

export interface ApiBlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

export interface ApiPage {
  slug: string;
  title: string;
  content?: string;
  meta_description?: string;
}

export interface ApiFaq {
  id: number;
  question: string;
  answer: string;
}

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
