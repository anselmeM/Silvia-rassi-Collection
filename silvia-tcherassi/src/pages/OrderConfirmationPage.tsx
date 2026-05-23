import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect } from 'react';

export default function OrderConfirmationPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart on successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" strokeWidth={1} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-serif">Thank you for your order</h1>
          <p className="text-gray-600 text-lg">
            Your order has been placed successfully. We've sent a confirmation email with all the details.
          </p>
        </div>

        <div className="bg-stone-50 p-8 rounded-lg space-y-6 text-sm">
          <div className="border-b border-stone-200 pb-4">
            <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-1">Status</p>
            <p className="font-medium text-stone-900">Processing</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-left">
            <div>
              <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-1">Expected Delivery</p>
              <p className="font-medium">3-5 Business Days</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-1">Shipping Service</p>
              <p className="font-medium">Standard Shipping</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link 
            to="/my-orders" 
            className="flex-1 bg-black text-white py-4 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors"
          >
            VIEW ORDER STATUS
          </Link>
          <Link 
            to="/" 
            className="flex-1 border border-black py-4 text-sm font-medium tracking-widest hover:bg-stone-50 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
