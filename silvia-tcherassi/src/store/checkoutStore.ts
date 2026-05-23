import { create } from 'zustand';

interface CheckoutState {
  step: 1 | 2 | 3;
  shippingAddress: any | null;
  shippingMethod: any | null;
  billingAddress: any | null;
  isBillingSameAsShipping: boolean;
  
  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  setShippingAddress: (address: any) => void;
  setShippingMethod: (method: any) => void;
  setBillingAddress: (address: any) => void;
  setBillingSameAsShipping: (value: boolean) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  shippingAddress: null,
  shippingMethod: null,
  billingAddress: null,
  isBillingSameAsShipping: true,

  setStep: (step) => set({ step }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setShippingMethod: (shippingMethod) => set({ shippingMethod }),
  setBillingAddress: (billingAddress) => set({ billingAddress }),
  setBillingSameAsShipping: (isBillingSameAsShipping) => set({ isBillingSameAsShipping }),
  resetCheckout: () => set({
    step: 1,
    shippingAddress: null,
    shippingMethod: null,
    billingAddress: null,
    isBillingSameAsShipping: true,
  }),
}));
