import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Medusa from '@medusajs/medusa-js';
import type { Product, Category } from '@/types';

// Initialize Medusa client
const medusa = new Medusa({ 
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000', 
  maxRetries: 3 
});

// Type for filters
interface ProductFilters {
  category?: Category;
  categories?: Category[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Helper to map Medusa Product to our Frontend Product type
 */
const mapMedusaProduct = (medusaProduct: any): Product => {
  const variant = medusaProduct.variants?.[0];
  const price = variant?.prices?.find((p: any) => p.currency_code === 'usd')?.amount || 0;
  
  return {
    id: medusaProduct.id,
    variantId: variant?.id, // Added variantId
    name: medusaProduct.title,
    price: price, // Medusa 2.0 uses cents
    category: (medusaProduct.categories?.[0]?.name?.toLowerCase() || 'dress') as Category,
    images: medusaProduct.images?.map((img: any) => img.url) || [],
    thumbnails: medusaProduct.images?.map((img: any) => img.url) || [],
    description: medusaProduct.description || '',
    inStock: variant?.inventory_quantity > 0 || true, // Default to true if not managed
    createdAt: medusaProduct.created_at,
  };
};

// Fetch products from Medusa
const fetchProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params: any = {
    limit: 100,
  };

  if (filters?.category) {
    // In Medusa 2.0 we'd use category_id, but for now we filter by handle or name if needed
  }

  const { products } = await medusa.products.list(params);
  let result = products.map(mapMedusaProduct);

  // Client-side filtering for things not easily supported by simple list params
  if (filters?.category) {
    result = result.filter(p => p.category === filters.category);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  return result;
};

// Fetch all products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });
}

// Fetch products with filters
export function useFilteredProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', 'filtered', filters],
    queryFn: () => fetchProducts(filters),
  });
}

// Fetch single product by ID
export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      const { product } = await medusa.products.retrieve(productId);
      return mapMedusaProduct(product);
    },
    enabled: !!productId,
  });
}

// Hook to get products by category (Still using local data if needed, but updated to use the query results)
export function useProductsByCategory(category: Category | Category[]) {
  const { data: products = [] } = useProducts();
  const categories = Array.isArray(category) ? category : [category];
  
  return useMemo(() => {
    return products.filter((p) => categories.includes(p.category as Category));
  }, [products, categories]);
}

// Hook to get product count by category
export function useProductCountByCategory() {
  const { data: products = [] } = useProducts();
  
  return useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);
}
