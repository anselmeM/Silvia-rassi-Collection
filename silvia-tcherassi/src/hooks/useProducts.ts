import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { medusa, medusaFetch } from '@/lib/medusa';
import type { Product, Category } from '@/types';

// Type for filters
interface ProductFilters {
  category_id?: string[];
  handle?: string[];
  q?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

/**
 * Helper to ensure image URLs are correctly formatted
 */
const formatImageUrl = (url: string): string => {
  if (!url) return '/images/placeholder.svg';
  
  // Strip hardcoded localhost:3006 if present to make it relative
  let cleanUrl = url.replace(/^http:\/\/localhost:3006/, '');
  
  // If it's still an absolute URL (e.g., S3), return it
  if (cleanUrl.startsWith('http')) return cleanUrl;
  
  // Ensure it starts with /
  return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
};

/**
 * Helper to map Medusa Product to our Frontend Product type
 */
const mapMedusaProduct = (medusaProduct: any): Product => {
  if (!medusaProduct) {
    console.warn('mapMedusaProduct received null/undefined');
    return {} as Product;
  }

  const variant = medusaProduct.variants?.[0];
  const priceObj = variant?.prices?.find((p: any) => p.currency_code === 'usd');
  const price = priceObj ? priceObj.amount : 0;
  
  // Medusa 2.0 categories are an array
  const categoryName = medusaProduct.categories?.[0]?.name || 'dress';
  
  const images = medusaProduct.images?.map((img: any) => formatImageUrl(img.url)) || [];
  if (images.length === 0 && medusaProduct.thumbnail) {
    images.push(formatImageUrl(medusaProduct.thumbnail));
  }
  
  // Fallback if still no images
  if (images.length === 0) {
    images.push('/images/placeholder.png');
  }

  return {
    id: medusaProduct.id,
    variantId: variant?.id,
    name: medusaProduct.title || 'Untitled Product',
    price: price, // Medusa 2.0 uses cents
    category: categoryName.toLowerCase() as Category,
    images: images,
    thumbnails: images,
    description: medusaProduct.description || '',
    inStock: (variant?.inventory_quantity !== undefined ? variant.inventory_quantity > 0 : true),
    createdAt: medusaProduct.created_at || new Date().toISOString(),
  };
};

// Fetch products from Medusa
const fetchProducts = async (filters?: ProductFilters) => {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', (filters?.limit || 100).toString());
  queryParams.append('offset', (filters?.offset || 0).toString());
  
  if (filters?.q) queryParams.append('q', filters.q);
  if (filters?.order) queryParams.append('order', filters.order);

  console.log('Fetching products with params:', queryParams.toString());
  
  const data = await medusaFetch(`/store/products?${queryParams.toString()}`);
  console.log('Medusa products response:', data);
  
  return {
    products: data.products.map(mapMedusaProduct),
    count: data.count,
    limit: data.limit,
    offset: data.offset,
  };
};

// Fetch all products
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
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

// Hook to get products by category
export function useProductsByCategory(categoryName: string) {
  // First we need to find the category ID by name/handle
  // For simplicity in this prototype, we'll fetch all and filter or use the handle if supported
  const { data } = useProducts({ limit: 100 });
  
  return useMemo(() => {
    if (!data?.products) return [];
    return data.products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
  }, [data?.products, categoryName]);
}

// Hook to get product count by category
export function useProductCountByCategory() {
  const { data } = useProducts({ limit: 100 });
  
  return useMemo(() => {
    const counts: Record<string, number> = {};
    if (!data?.products) return counts;
    
    data.products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [data?.products]);
}

