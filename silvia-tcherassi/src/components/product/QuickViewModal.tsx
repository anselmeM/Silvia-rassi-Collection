import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { UI_TEXT } from '@/lib/constants';

interface QuickViewModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ productId, isOpen, onClose }: QuickViewModalProps) {
  const { data: product } = useProduct(productId || undefined);
  const { addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;
    
    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Basic focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      // Restore focus to previous element
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (product && product.variantId) {
      addToCart(product.variantId);
      onClose();
    }
  };

  const handleViewDetails = () => {
    if (product) {
      onClose();
      // Navigation will be handled by the Link component
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="quick-view-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        ref={modalRef}
        className="quick-view-content bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-y-auto relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8"
      >
        <button
          ref={closeButtonRef}
          id="close-quick-view"
          className="absolute top-4 right-4 text-2xl"
          onClick={onClose}
          aria-label="Close quick view"
        >
          &times;
        </button>

        <div className="quick-view-image-container">
          <img
            id="quick-view-image"
            src={product.images[0]}
            alt={`Quick view of ${product.name}`}
            className="w-full h-auto object-cover rounded-lg"
            width={400}
            height={500}
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2
            id="quick-view-title"
            className="text-4xl font-serif"
          >
            {product.name}
          </h2>
          <p id="quick-view-price" className="text-2xl mt-2 text-gray-800">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            {product.description}
          </p>
          
          <button
            id="quick-view-add-to-cart"
            className="mt-8 w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-800 rounded-md transition-colors"
            onClick={handleAddToCart}
          >
            {UI_TEXT.ADD_TO_BAG}
          </button>
          
          <Link
            to={`/product/${product.id}`}
            id="quick-view-details-link"
            className="text-center mt-4 text-sm underline hover:no-underline"
            onClick={handleViewDetails}
          >
            {UI_TEXT.VIEW_FULL_DETAILS}
          </Link>
        </div>
      </div>
    </div>
  );
}
