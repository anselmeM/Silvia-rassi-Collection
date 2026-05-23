import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts, useProductsByCategory, useProduct, useProductCountByCategory } from '@/hooks/useProducts';

// Hoist mocks
const { mockList, mockRetrieve } = vi.hoisted(() => ({
  mockList: vi.fn(),
  mockRetrieve: vi.fn(),
}));

// Mock Medusa client
vi.mock('@medusajs/medusa-js', () => {
  return {
    default: class {
      products = {
        list: mockList,
        retrieve: mockRetrieve,
      };
    },
  };
});

const mockProducts = [
  {
    id: 'prod_1',
    title: 'Product 1',
    categories: [{ name: 'Dress' }],
    variants: [{ id: 'var_1', prices: [{ currency_code: 'usd', amount: 1000 }], inventory_quantity: 10 }],
    images: [{ url: 'img1.jpg' }],
    created_at: '2023-01-01',
  },
  {
    id: 'prod_2',
    title: 'Product 2',
    categories: [{ name: 'Handbag' }],
    variants: [{ id: 'var_2', prices: [{ currency_code: 'usd', amount: 2000 }], inventory_quantity: 5 }],
    images: [{ url: 'img2.jpg' }],
    created_at: '2023-01-02',
  },
];

describe('useProducts hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
    mockList.mockReset();
    mockRetrieve.mockReset();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useProducts', () => {
    it('returns all products when no filter', async () => {
      mockList.mockResolvedValue({ products: mockProducts });

      const { result } = renderHook(() => useProducts(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].name).toBe('Product 1');
      expect(result.current.data?.[1].name).toBe('Product 2');
    });

    it('handles loading state', async () => {
      // Delay the resolution to test loading state
      let resolvePromise: any;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockList.mockReturnValue(promise);

      const { result } = renderHook(() => useProducts(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      resolvePromise({ products: mockProducts });
      
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('handles error state', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockList.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useProducts(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('useProductsByCategory', () => {
    it('filters by single category', async () => {
      mockList.mockResolvedValue({ products: mockProducts });

      const { result } = renderHook(() => useProductsByCategory('dress' as any), { wrapper });

      // Wait for the internal useProducts query to resolve
      await waitFor(() => expect(result.current).toHaveLength(1));

      expect(result.current[0].name).toBe('Product 1');
      expect(result.current[0].category).toBe('dress');
    });

    it('filters by multiple categories', async () => {
      mockList.mockResolvedValue({ products: mockProducts });

      const { result } = renderHook(() => useProductsByCategory(['dress', 'handbag'] as any), { wrapper });

      await waitFor(() => expect(result.current).toHaveLength(2));
      
      const names = result.current.map(p => p.name);
      expect(names).toContain('Product 1');
      expect(names).toContain('Product 2');
    });

    it('returns empty array when no products match category', async () => {
      mockList.mockResolvedValue({ products: mockProducts });

      const { result } = renderHook(() => useProductsByCategory('shoes' as any), { wrapper });

      await waitFor(() => expect(result.current).toEqual([]));
    });
  });

  describe('useProduct', () => {
    it('returns a single product by ID', async () => {
      mockRetrieve.mockResolvedValue({ product: mockProducts[0] });

      const { result } = renderHook(() => useProduct('prod_1'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.id).toBe('prod_1');
      expect(result.current.data?.name).toBe('Product 1');
    });

    it('does not fetch when productId is undefined', () => {
      renderHook(() => useProduct(undefined), { wrapper });
      expect(mockRetrieve).not.toHaveBeenCalled();
    });
  });

  describe('useProductCountByCategory', () => {
    it('returns counts for each category', async () => {
      mockList.mockResolvedValue({ products: mockProducts });

      const { result } = renderHook(() => useProductCountByCategory(), { wrapper });

      await waitFor(() => expect(Object.keys(result.current)).toHaveLength(2));

      expect(result.current).toEqual({
        dress: 1,
        handbag: 1,
      });
    });
  });
});
