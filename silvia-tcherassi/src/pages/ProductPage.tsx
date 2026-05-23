import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { UI_TEXT } from '@/lib/constants';
import SafeImage from '@/components/ui/SafeImage';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-24 bg-gray-200 rounded mb-8" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Product Not Found</h1>
          <Link to="/collections" className="text-sm underline hover:no-underline">
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
          <SafeImage
            id="product-main-image"
            alt={`Main view of ${product.name}`}
            className="w-full h-auto bg-gray-100 p-4 rounded-lg"
            src={product.images[0]}
            width={600}
            height={800}
          />
          <div id="product-thumbnails-container" className="grid grid-cols-4 gap-4">
            {product.thumbnails.map((thumb, index) => (
              <SafeImage
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1} for ${product.name}`}
                className="product-thumb w-full h-auto bg-gray-100 p-2 rounded-lg cursor-pointer hover:opacity-75"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* Product Information & Actions */}
        <div className="md:sticky top-24 h-fit">
          <h1 className="text-5xl font-serif">{product.name}</h1>
          <p className="text-2xl mt-2 text-gray-800">{formatPrice(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-gray-700">{product.description}</p>
          <button
            id="add-to-cart-button"
            className="mt-8 w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-md"
            onClick={() => product.variantId && addToCart(product.variantId)}
          >
            {UI_TEXT.ADD_TO_BAG}
          </button>
        </div>
      </div>
    </div>
  );
}
