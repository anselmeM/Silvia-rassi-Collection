# Technical Design Specification: Silvia Tcherassi E-Commerce Platform

**Version:** 1.0  
**Date:** 2026-04-15  
**Status:** Draft  
**Author:** Lead Systems Architect (Kiro Methodology)

---

## 1. Technology Stack

### 1.1 Frontend Stack (FERN-Inspired)

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | React | 18.x | UI rendering, component architecture |
| **Language** | TypeScript | 5.x | Type safety, compile-time validation |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS, design system |
| **State Management** | Zustand | 4.x | Client state (cart, UI state) |
| **Data Fetching** | TanStack Query | 5.x | Server state, caching |
| **Routing** | React Router | 6.x | SPA navigation, route guards |
| **Forms** | React Hook Form + Zod | 7.x + 3.x | Form validation, schema-based |
| **Components** | shadcn/ui | Latest | Accessible primitive components |
| **Icons** | Lucide React | Latest | Consistent iconography |
| **Build Tool** | Vite | 5.x | Fast HMR, optimized builds |

### 1.2 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |

---

## 2. Project Structure

```
silvia-tcherassi/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Global styles, Tailwind imports
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces
│   ├── lib/
│   │   ├── utils.ts             # Utility functions (cn(), formatPrice())
│   │   ├── constants.ts         # App constants (routes, storage keys)
│   │   └── validations.ts       # Zod schemas
│   ├── store/
│   │   ├── cartStore.ts          # Zustand cart store
│   │   └── uiStore.ts           # Zustand UI store
│   ├── hooks/
│   │   ├── useProducts.ts       # TanStack Query hooks for products
│   │   ├── useCart.ts           # Cart operations hook
│   │   └── useToast.ts          # Toast notification hook
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (other primitives)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── CartDrawer.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   └── QuickViewModal.tsx
│   │   └── home/
│   │       ├── HeroSection.tsx
│   │       ├── CategoryCard.tsx
│   │       ├── SocialProof.tsx
│   │       └── InstagramFeed.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CollectionsPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ProductPage.tsx
│   │   └── AboutPage.tsx
│   ├── data/
│   │   └── products.json         # Static product catalog
│   └── routes/
│       └── router.tsx            # React Router configuration
└── tests/
    ├── unit/
    └── e2e/
```

---

## 3. TypeScript Interfaces

### 3.1 Core Domain Types

```typescript
// src/types/index.ts

export type Category = 'dress' | 'blouse' | 'handbag' | 'accessory';

export interface Product {
  id: string;
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
```

### 3.2 Store Types

```typescript
// src/store/cartStore.ts

interface CartState {
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

// src/store/uiStore.ts

interface UIState {
  activeRoute: string;
  isMobileMenuOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;
  toasts: ToastMessage[];
  
  // Actions
  setActiveRoute: (route: string) => void;
  toggleMobileMenu: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}
```

---

## 4. Zod Validation Schemas

```typescript
// src/lib/validations.ts

import { z } from 'zod';

export const ProductIdSchema = z.string().uuid();

export const QuantitySchema = z.number()
  .int()
  .min(1, 'Quantity must be at least 1')
  .max(99, 'Quantity cannot exceed 99');

export const AddToCartSchema = z.object({
  productId: ProductIdSchema,
  quantity: QuantitySchema.default(1),
});

export const CategorySchema = z.enum(['dress', 'blouse', 'handbag', 'accessory']);

export const ProductSchema = z.object({
  id: ProductIdSchema,
  name: z.string().min(1).max(100),
  price: z.number().int().positive(),
  category: CategorySchema,
  images: z.array(z.string().url()).min(1).max(10),
  thumbnails: z.array(z.string().url()),
  description: z.string().max(500).optional(),
  inStock: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
});
```

---

## 5. API Contracts (For Future Backend)

### 5.1 REST Endpoints (Future Phase)

```
GET    /api/products              # List all products (with pagination)
GET    /api/products/:id          # Get single product
GET    /api/products?category=    # Filter by category
POST   /api/cart                  # Create cart (guest)
GET    /api/cart/:id              # Get cart
PATCH  /api/cart/:id/items        # Update cart item
DELETE /api/cart/:id/items/:pid   # Remove from cart
```

### 5.2 Response Shapes

```typescript
// GET /api/products
interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Error Response Shape
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

---

## 6. Database Schema (For Future PostgreSQL)

```prisma
// Future phase - not implemented in Phase 1

model Product {
  id          String   @id @default(uuid())
  name        String
  price       Int      // USD cents
  category    Category
  description String?
  inStock     Boolean  @default(true)
  images      Image[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Image {
  id         String  @id @default(uuid())
  url        String
  isPrimary  Boolean @default(false)
  productId  String
  product    Product @relation(fields: [productId], references: [id])
}

enum Category {
  DRESS
  BLOUSE
  HANDBAG
  ACCESSORY
}

model Cart {
  id        String     @id @default(uuid())
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(uuid())
  quantity  Int
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id])
  productId String
}
```

---

## 7. Component Architecture

### 7.1 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── DesktopNav
│   ├── CartButton
│   └── MobileMenuButton
├── MobileMenu (Drawer)
├── CartDrawer (Drawer)
├── QuickViewModal (Dialog)
├── ToastProvider
│   └── Toast
├── PageContent
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeaturedCategories
│   │   ├── SocialProof
│   │   └── InstagramFeed
│   ├── CollectionsPage
│   │   └── ProductGrid
│   │       └── ProductCard
│   ├── CategoryPage
│   │   └── ProductGrid
│   │       └── ProductCard
│   ├── ProductPage
│   │   ├── ProductGallery
│   │   └── ProductDetails
│   └── AboutPage
└── Footer
```

### 7.2 Component Props Interfaces

```typescript
// src/components/product/ProductCard.tsx

interface ProductCardProps {
  product: Product;
  onQuickView?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

// src/components/product/ProductGrid.tsx

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

// src/components/product/QuickViewModal.tsx

interface QuickViewModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}
```

---

## 8. State Management Design

### 8.1 Zustand Store Separation

| Store | Responsibility | Persistence |
|-------|---------------|-------------|
| `cartStore` | Cart items, quantities, subtotal | localStorage |
| `uiStore` | UI state (modals, menus, toasts) | Memory only |

### 8.2 Cart Persistence Strategy

```typescript
// Key: 'silvia-cart-v1'
// Sync across tabs via 'storage' event

const CART_STORAGE_KEY = 'silvia-cart-v1';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      itemCount: 0,
      isOpen: false,
      
      addItem: (productId, quantity = 1) => {
        // ... implementation
      },
      // ... other actions
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        // Recalculate subtotal after hydration
        if (state) {
          state.subtotal = calculateSubtotal(state.items);
          state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        }
      },
    }
  )
);
```

---

## 9. Security Implementation

### 9.1 Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:;
  connect-src 'self';
  frame-ancestors 'none';
  form-action 'self';
">
```

### 9.2 Security Headers (to be set by hosting provider)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 9.3 XSS Prevention

```typescript
// All user-visible text must use textContent, not innerHTML

// ❌ BAD - XSS vulnerable
element.innerHTML = `<span>${product.name}</span>`;

// ✅ GOOD - Safe
element.textContent = product.name;

// For complex HTML in descriptions, use DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(product.description);
```

---

## 10. Performance Optimizations

### 10.1 Image Handling

```typescript
// All images must have explicit dimensions and lazy loading
<img 
  src={product.image}
  alt={product.name}
  width={600}
  height={800}
  loading="lazy"
  decoding="async"
/>

// For responsive images
<img
  srcSet={`${image}-sm.jpg 400w, ${image}-md.jpg 800w, ${image}-lg.jpg 1200w`}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 10.2 Code Splitting

```typescript
// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

// Wrap routes in Suspense
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    {/* ... */}
  </Routes>
</Suspense>
```

### 10.3 Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-drawer'],
        },
      },
    },
  },
});
```

---

## 11. Accessibility Implementation

### 11.1 ARIA Landmarks

```tsx
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
  <main role="main">
  <aside role="complementary" aria-label="Shopping cart">
  <footer role="contentinfo">
```

### 11.2 Focus Management

```typescript
// Focus trap for modals/drawers
import { useFocusTrap } from '@radix-ui/react-focus-trap';

function QuickViewModal() {
  const focusTrapRef = useFocusTrap();
  
  return (
    <div ref={focusTrapRef}>
      {/* Modal content */}
    </div>
  );
}

// Restore focus on close
useEffect(() => {
  const previousFocus = document.activeElement;
  return () => {
    (previousFocus as HTMLElement)?.focus();
  };
}, []);
```

### 11.3 Live Regions

```tsx
// Toast announcements
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {toastMessage}
</div>
```

---

## 12. Design System Tokens

### 12.1 Color Palette (Tailwind)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // indigo-500
          600: '#4f46e5', // indigo-600
          700: '#4338ca', // indigo-700
        },
        stone: {
          50: '#fafaf9', // bg-stone-50
          100: '#f5f5f4',
        },
        custom: {
          black: '#333', // text-custom-black
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### 12.2 Typography Scale

| Element | Size | Font | Weight |
|---------|------|------|--------|
| H1 | 6xl (3.75rem) | Cormorant Garamond | 400 |
| H2 | 5xl (3rem) | Cormorant Garamond | 400 |
| H3 | 4xl (2.25rem) | Cormorant Garamond | 400 |
| Body | base (1rem) | Roboto | 400 |
| Small | sm (0.875rem) | Roboto | 400 |
| Caption | xs (0.75rem) | Roboto | 400 |

---

*Design Status: Ready for Implementation Review*
