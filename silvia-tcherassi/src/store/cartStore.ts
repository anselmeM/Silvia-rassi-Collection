import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Medusa from '@medusajs/medusa-js';
import type { CartItem, CartState } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

const medusa = new Medusa({ 
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000', 
  maxRetries: 3 
});

interface MedusaCartState extends Omit<CartState, 'items'> {
  cartId: string | null;
  items: any[]; // Medusa Line Items
  regionId: string | null;
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
}

export const useCartStore = create<MedusaCartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      regionId: null,
      items: [],
      subtotal: 0,
      itemCount: 0,
      isOpen: false,

      initializeCart: async () => {
        let { cartId } = get();
        
        try {
          if (!cartId) {
            // Get default region
            const { regions } = await medusa.regions.list();
            const regionId = regions[0]?.id;
            
            const { cart } = await medusa.carts.create({ region_id: regionId });
            cartId = cart.id;
            set({ cartId, regionId });
          } else {
            const { cart } = await medusa.carts.retrieve(cartId);
            set({ 
              items: cart.items, 
              subtotal: cart.subtotal || 0,
              itemCount: cart.items.reduce((acc, next) => acc + next.quantity, 0)
            });
          }
        } catch (error) {
          console.error('Failed to initialize cart:', error);
          // If cart not found on server, clear local id
          set({ cartId: null });
        }
      },

      addItem: async (variantId: string, quantity: number = 1) => {
        let { cartId } = get();
        
        if (!cartId) {
          await get().initializeCart();
          cartId = get().cartId;
        }

        if (!cartId) return;

        try {
          const { cart } = await medusa.carts.lineItems.create(cartId, {
            variant_id: variantId,
            quantity,
          });
          
          set({ 
            items: cart.items, 
            subtotal: cart.subtotal || 0,
            itemCount: cart.items.reduce((acc, next) => acc + next.quantity, 0),
            isOpen: true
          });
        } catch (error) {
          console.error('Failed to add item:', error);
        }
      },

      removeItem: async (lineItemId: string) => {
        const { cartId } = get();
        if (!cartId) return;

        try {
          const { cart } = await medusa.carts.lineItems.delete(cartId, lineItemId);
          set({ 
            items: cart.items, 
            subtotal: cart.subtotal || 0,
            itemCount: cart.items.reduce((acc, next) => acc + next.quantity, 0)
          });
        } catch (error) {
          console.error('Failed to remove item:', error);
        }
      },

      updateQuantity: async (lineItemId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;

        try {
          const { cart } = await medusa.carts.lineItems.update(cartId, lineItemId, {
            quantity,
          });
          set({ 
            items: cart.items, 
            subtotal: cart.subtotal || 0,
            itemCount: cart.items.reduce((acc, next) => acc + next.quantity, 0)
          });
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      },

      clearCart: () => {
        set({
          cartId: null,
          items: [],
          subtotal: 0,
          itemCount: 0,
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      hydrate: () => get().initializeCart(),
    }),
    {
      name: STORAGE_KEYS.CART,
      partialize: (state) => ({ cartId: state.cartId, regionId: state.regionId }),
    }
  )
);
