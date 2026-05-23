import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import { useUIStore } from '@/store/uiStore';

export default function CollectionsPage() {
  const { data, isLoading, isError, error } = useProducts({ limit: 100 });
  const { openQuickView } = useUIStore();

  console.log('CollectionsPage data:', data);
  console.log('CollectionsPage isLoading:', isLoading);
  
  if (isError) {
    console.error('CollectionsPage error:', error);
    return <div>Error loading products. Check console for details.</div>;
  }

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
        <ProductGrid 
          products={data?.products || []} 
          isLoading={isLoading} 
          onQuickView={openQuickView}
        />
        {data?.products && data.products.length === 0 && (
          <div className="mt-8 p-4 bg-gray-100 rounded overflow-auto">
            <p className="font-bold">Debug Info:</p>
            <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
