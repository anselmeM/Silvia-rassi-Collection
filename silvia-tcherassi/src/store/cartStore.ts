import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medusa } from '@/lib/medusa';
import { STORAGE_KEYS } from '@/lib/constants';

const formatImageUrl = (url: string): string => {
  if (!url) return '/images/placeholder.svg';
  
  // Strip hardcoded localhost:3006 if present to make it relative
  let cleanUrl = url.replace(/^http:\/\/localhost:3006/, '');
  
  // If it's still an absolute URL (e.g., S3), return it
  if (cleanUrl.startsWith('http')) return cleanUrl;
  
  // Ensure it starts with /
  return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
};

interface MedusaCartState {
  cartId: string | null;
  items: any[]; // Medusa Line Items
  regionId: string | null;
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  
  // Actions
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  hydrate: () => void;
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
            const items = cart.items.map((item: any) => ({
              ...item,
              thumbnail: formatImageUrl(item.thumbnail),
            }));
            set({ 
              items, 
              subtotal: cart.subtotal || 0,
              itemCount: items.reduce((acc, next) => acc + next.quantity, 0)
            });
          }
        } catch (error) {
          console.error('Failed to initialize cart:', error);
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

        // Optimistic update could be added here, but Medusa cart operations are relatively fast
        // and involve server-side calculations (taxes, discounts) that are hard to replicate client-side.
        // Instead, we'll set a loading state if we had one.

        try {
          const { cart } = await medusa.carts.lineItems.create(cartId, {
            variant_id: variantId,
            quantity,
          });
          
          const items = cart.items.map((item: any) => ({
            ...item,
            thumbnail: formatImageUrl(item.thumbnail),
          }));

          set({ 
            items, 
            subtotal: cart.subtotal || 0,
            itemCount: items.reduce((acc, next) => acc + next.quantity, 0),
            isOpen: true
          });
        } catch (error) {
          console.error('Failed to add item:', error);
        }
      },

      removeItem: async (lineItemId: string) => {
        const { cartId, items } = get();
        if (!cartId) return;

        // Optimistic update
        const previousItems = [...items];
        const newItems = items.filter(item => item.id !== lineItemId);
        set({ 
          items: newItems,
          itemCount: newItems.reduce((acc, next) => acc + next.quantity, 0)
        });

        try {
          const { cart } = await medusa.carts.lineItems.delete(cartId, lineItemId);
          const items = cart.items.map((item: any) => ({
            ...item,
            thumbnail: formatImageUrl(item.thumbnail),
          }));

          set({ 
            items, 
            subtotal: cart.subtotal || 0,
            itemCount: items.reduce((acc, next) => acc + next.quantity, 0)
          });
        } catch (error) {
          console.error('Failed to remove item:', error);
          // Rollback
          set({ items: previousItems, itemCount: previousItems.reduce((acc, next) => acc + next.quantity, 0) });
        }
      },

      updateQuantity: async (lineItemId: string, quantity: number) => {
        const { cartId, items } = get();
        if (!cartId) return;

        // Optimistic update
        const previousItems = [...items];
        const newItems = items.map(item => 
          item.id === lineItemId ? { ...item, quantity } : item
        );
        set({ 
          items: newItems,
          itemCount: newItems.reduce((acc, next) => acc + next.quantity, 0)
        });

        try {
          const { cart } = await medusa.carts.lineItems.update(cartId, lineItemId, {
            quantity,
          });
          const items = cart.items.map((item: any) => ({
            ...item,
            thumbnail: formatImageUrl(item.thumbnail),
          }));

          set({ 
            items, 
            subtotal: cart.subtotal || 0,
            itemCount: items.reduce((acc, next) => acc + next.quantity, 0)
          });
        } catch (error) {
          console.error('Failed to update quantity:', error);
          // Rollback
          set({ items: previousItems, itemCount: previousItems.reduce((acc, next) => acc + next.quantity, 0) });
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

