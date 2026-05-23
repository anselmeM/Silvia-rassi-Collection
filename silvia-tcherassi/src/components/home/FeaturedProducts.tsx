import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { useUIStore } from '@/store/uiStore';

export default function FeaturedProducts() {
  const { data, isLoading } = useProducts({ limit: 4 });
  const { openQuickView } = useUIStore();

  if (isLoading) {
    return (
      <section className="px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const featuredProducts = data?.products || [];

  return (
    <section className="px-6 md:px-12 py-16">
      <h2 className="text-center text-4xl font-serif mb-12">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={openQuickView}
          />
        ))}
      </div>
    </section>
  );
}
