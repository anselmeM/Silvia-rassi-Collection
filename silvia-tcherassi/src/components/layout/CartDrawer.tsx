import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { UI_TEXT } from '@/lib/constants';

export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    closeButtonRef.current?.focus();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={UI_TEXT.SHOPPING_BAG}
    >
      <div
        ref={drawerRef}
        className="absolute top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl flex flex-col"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-serif text-2xl">{UI_TEXT.SHOPPING_BAG}</h2>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            className="text-2xl"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        <div id="cart-items" className="flex-grow p-6 overflow-y-auto">
          {items.length === 0 ? (
            <p id="empty-cart-message">{UI_TEXT.YOUR_BAG_IS_EMPTY}</p>
          ) : (
            items.map((item) => {
              return (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <div className="flex items-center mt-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      {UI_TEXT.REMOVE}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-between font-bold mb-4">
            <span>{UI_TEXT.SUBTOTAL}</span>
            <span id="cart-subtotal">{formatPrice(subtotal)}</span>
          </div>
          {items.length > 0 && (
            <button className="w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-800 rounded-md">
              {UI_TEXT.PROCEED_TO_CHECKOUT}
            </button>
          )}
          <Link
            to="/collections"
            onClick={closeCart}
            className="block text-center mt-4 text-sm underline hover:no-underline"
          >
            {UI_TEXT.CONTINUE_SHOPPING}
          </Link>
        </div>
      </div>
    </div>
  );
}
