// ===================================================================
// Domain Types
// ===================================================================

export type Category = 'dress' | 'blouse' | 'handbag' | 'accessory';

export interface Product {
  id: string;
  variantId?: string; // Medusa variant ID
  name: string;
  price: number; // Price in USD cents
  category: Category;
  images: string[];
  thumbnails: string[];
  description: string;
  inStock: boolean;
  createdAt: string; // ISO 8601
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string; // ISO 8601
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: 'USD';
  lastUpdated: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ===================================================================
// Store Types
// ===================================================================

export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  
  // Actions
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  hydrate: () => void;
}

export interface UIState {
  activeRoute: string;
  isMobileMenuOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;
  toasts: ToastMessage[];
  
  // Actions
  setActiveRoute: (route: string) => void;
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

// ===================================================================
// Component Props Types
// ===================================================================

export interface ProductCardProps {
  product: Product;
  onQuickView?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export interface QuickViewModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

// ===================================================================
// API Types (for future backend)
// ===================================================================

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// ===================================================================
// Navigation Types
// ===================================================================

export type RoutePath = '/' | '/collections' | '/dresses' | '/handbags' | '/accessories' | '/about' | '/product/:id';

export interface NavLink {
  label: string;
  href: string;
}
