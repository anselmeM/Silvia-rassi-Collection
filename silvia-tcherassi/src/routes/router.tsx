import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import MobileMenu from '@/components/layout/MobileMenu';
import Toast from '@/components/layout/Toast';
import { ROUTES } from '@/lib/constants';
import { useCartStore } from '@/store/cartStore';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

// Loading skeleton component
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-stone-400">Loading...</div>
    </div>
  );
}

// Layout component to wrap pages
function RootLayout() {
  const { initializeCart } = useCartStore();

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-4 focus:text-black"
      >
        Skip to main content
      </a>
      
      <Header />
      <main id="main-content" role="main" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <Toast />
    </div>
  );
}

// Not found page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <a href="/" className="text-sm underline hover:no-underline">
          Return Home
        </a>
      </div>
    </div>
  );
}

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.COLLECTIONS.substring(1),
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CollectionsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.DRESSES.substring(1),
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CategoryPage category="dress" includeBlouses />
          </Suspense>
        ),
      },
      {
        path: ROUTES.HANDBAGS.substring(1),
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CategoryPage category="handbag" />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ACCESSORIES.substring(1),
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CategoryPage category="accessory" />
          </Suspense>
        ),
      },
      {
        path: 'product/:id',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ProductPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ABOUT.substring(1),
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
