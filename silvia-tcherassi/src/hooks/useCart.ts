import { useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';

export function useCart() {
  const {
    items,
    subtotal,
    itemCount,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  } = useCartStore();

  return {
    items,
    subtotal,
    itemCount,
    isOpen,
    addToCart: addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  };
}
