import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (productId: string) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product.id);
  };

  return (
    <div className="product-item-container text-center group relative">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            alt={product.name}
            className="product-image w-full h-full object-cover object-center aspect-square bg-gray-100 p-4 rounded-lg mb-4 transition-opacity cursor-pointer"
            src={product.images[0]}
            loading="lazy"
            width={400}
            height={533}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
            <button
              className="quick-view-btn text-white bg-black bg-opacity-70 text-xs px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleQuickView}
              data-product-id={product.id}
            >
              Quick View
            </button>
          </div>
        </Link>
      </div>
      <p className="font-medium">{product.name}</p>
      <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
    </div>
  );
}
