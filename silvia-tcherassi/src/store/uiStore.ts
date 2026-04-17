import { create } from 'zustand';
import type { UIState, ToastMessage } from '@/types';
import { ANIMATION } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export const useUIStore = create<UIState>((set, get) => ({
  activeRoute: '/',
  isMobileMenuOpen: false,
  isQuickViewOpen: false,
  quickViewProductId: null,
  toasts: [],

  setActiveRoute: (route: string) => {
    set({ activeRoute: route });
    // Scroll to top on route change
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  openMobileMenu: () => {
    set({ isMobileMenuOpen: true });
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  openQuickView: (productId: string) => {
    set({
      isQuickViewOpen: true,
      quickViewProductId: productId,
    });
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  },

  closeQuickView: () => {
    set({
      isQuickViewOpen: false,
      quickViewProductId: null,
    });
    // Restore body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  },

  addToast: (message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateId();
    const toast: ToastMessage = { id, message, type };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove after duration
    setTimeout(() => {
      get().removeToast(id);
    }, ANIMATION.TOAST_DURATION);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
