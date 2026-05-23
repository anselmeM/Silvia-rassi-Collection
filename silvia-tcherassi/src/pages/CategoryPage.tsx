import type { Category } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import { CATEGORY_DESCRIPTIONS } from '@/lib/constants';
import { useUIStore } from '@/store/uiStore';

interface CategoryPageProps {
  category: Category;
  includeBlouses?: boolean;
}

export default function CategoryPage({ category, includeBlouses = false }: CategoryPageProps) {
  const { data, isLoading } = useProducts({ limit: 100 });
  const { openQuickView } = useUIStore();
  
  const filteredProducts = data?.products?.filter((p) => {
    if (includeBlouses && category === 'dress') {
      return p.category === 'dress' || p.category === 'blouse';
    }
    return p.category === category;
  }) || [];

  const title = category.charAt(0).toUpperCase() + category.slice(1) + 's';
  const description = CATEGORY_DESCRIPTIONS[category] || '';

  return (
    <div>
      <section className="text-center pt-12 pb-8">
        <h1 className="text-6xl font-serif">{title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm text-gray-600">{description}</p>
      </section>
      <section className="px-6 md:px-12 py-8">
        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
          onQuickView={openQuickView}
          emptyMessage={`No ${title.toLowerCase()} found.`}
        />
      </section>
    </div>
  );
}
