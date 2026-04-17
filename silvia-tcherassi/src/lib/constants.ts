// ===================================================================
// Route Constants
// ===================================================================

export const ROUTES = {
  HOME: '/',
  COLLECTIONS: '/collections',
  DRESSES: '/dresses',
  HANDBAGS: '/handbags',
  ACCESSORIES: '/accessories',
  ABOUT: '/about',
  PRODUCT: '/product/:id',
} as const;

export const ROUTE_LABELS: Record<keyof typeof ROUTES, string> = {
  HOME: 'Home',
  COLLECTIONS: 'Collections',
  DRESSES: 'Dresses',
  HANDBAGS: 'Handbags',
  ACCESSORIES: 'Accessories',
  ABOUT: 'About',
  PRODUCT: 'Product',
};

// ===================================================================
// Storage Keys
// ===================================================================

export const STORAGE_KEYS = {
  CART: 'silvia-cart-v1',
  UI_PREFERENCES: 'silvia-ui-prefs-v1',
} as const;

// ===================================================================
// Animation Durations (in ms)
// ===================================================================

export const ANIMATION = {
  TOAST_DURATION: 3000,
  MODAL_TRANSITION: 300,
  PAGE_TRANSITION: 500,
  DEBOUNCE_DELAY: 300,
} as const;

// ===================================================================
// Pagination
// ===================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

// ===================================================================
// Product Categories
// ===================================================================

export const CATEGORIES = {
  DRESS: 'dress',
  BLOUSE: 'blouse',
  HANDBAG: 'handbag',
  ACCESSORY: 'accessory',
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  [CATEGORIES.DRESS]: 'Dresses',
  [CATEGORIES.BLOUSE]: 'Blouses',
  [CATEGORIES.HANDBAG]: 'Handbags',
  [CATEGORIES.ACCESSORY]: 'Accessories',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  [CATEGORIES.DRESS]: 'Explore our collection of signature dresses, defined by unique silhouettes and luxurious fabrics.',
  [CATEGORIES.BLOUSE]: 'Discover elegant blouses crafted with attention to detail and premium materials.',
  [CATEGORIES.HANDBAG]: 'Artisanal details meet modern forms in our collection of handbags, crafted for the discerning woman.',
  [CATEGORIES.ACCESSORY]: 'The finishing touches. Discover jewelry, scarves, and clutches to complete your look.',
};

// ===================================================================
// UI Text
// ===================================================================

export const UI_TEXT = {
  ADD_TO_BAG: 'ADD TO BAG',
  ADDED_TO_BAG: 'Item added to your bag!',
  VIEW_FULL_DETAILS: 'View full details',
  QUICK_VIEW: 'Quick View',
  SHOPPING_BAG: 'Shopping Bag',
  YOUR_BAG_IS_EMPTY: 'Your bag is empty.',
  SUBTOTAL: 'Subtotal',
  PROCEED_TO_CHECKOUT: 'PROCEED TO CHECKOUT',
  SHOP_NOW: 'Shop Now',
  SHOP_COLLECTION: 'Shop Collection',
  FOLLOW_THE_JOURNEY: 'Follow the Journey',
  CONTACT: 'Contact',
  BOUTIQUES: 'Boutiques',
  STORIES: 'Stories',
  TCHERASSI_HOME: 'Tcherassi Home',
  ATELIER: 'Atelier',
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  CONTINUE_SHOPPING: 'Continue Shopping',
  REMOVE: 'Remove',
  PRODUCT_NOT_FOUND: 'Product not found',
  CART_UPDATED: 'Cart updated',
} as const;

// ===================================================================
// Breakpoints (matching Tailwind)
// ===================================================================

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ===================================================================
// Social Proof
// ===================================================================

export const SOCIAL_PROOF_BRANDS = [
  'VOGUE',
  "Harper's BAZAAR",
  'ELLE',
  'W Magazine',
] as const;
