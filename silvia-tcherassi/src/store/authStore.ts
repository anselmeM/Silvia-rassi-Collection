import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medusa } from '@/lib/medusa';

interface AuthState {
  customer: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { customer } = await medusa.auth.authenticate({
            email,
            password,
          });
          set({ customer, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Login failed', isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { customer } = await medusa.customers.create(data);
          // Medusa create doesn't log in automatically in some versions, 
          // but we can try to authenticate right after or let the user log in.
          // For now, we'll assume they need to log in manually or the API handles it.
          set({ customer, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Registration failed', isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await medusa.auth.deleteSession();
          set({ customer: null, isLoading: false });
        } catch (error) {
          set({ customer: null, isLoading: false });
        }
      },

      checkSession: async () => {
        try {
          const { customer } = await medusa.auth.getSession();
          set({ customer });
        } catch (error) {
          set({ customer: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'silvia-auth-storage',
      partialize: (state) => ({ customer: state.customer }),
    }
  )
);
