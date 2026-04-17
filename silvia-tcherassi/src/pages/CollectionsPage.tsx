import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';

export default function CollectionsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div>
      <section className="text-center pt-12 pb-8">
        <h1 className="text-6xl font-serif">All Collections</h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm text-gray-600">
          Discover a curated selection of vacation-ready pieces, defined by vibrant prints,
          airy silhouettes, and artisanal details.
        </p>
      </section>
      <section className="px-6 md:px-12 py-8">
        <ProductGrid products={products || []} isLoading={isLoading} />
      </section>
    </div>
  );
}
