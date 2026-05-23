import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { medusaFetch } from '@/lib/medusa';
import { formatPrice } from '@/lib/utils';
import { Package, ChevronRight, Clock } from 'lucide-react';

export default function MyOrdersPage() {
  const { customer } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;
      try {
        // Medusa 2.0 structure for fetching customer orders
        const data = await medusaFetch('/store/customers/me/orders');
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error('Failed to fetch orders:', err);
        setError('Unable to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [customer]);

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <Clock className="w-12 h-12 text-stone-300 mb-4" strokeWidth={1} />
        <p className="text-gray-500 mb-6">Please sign in to view your order history.</p>
        <Link to="/login" className="bg-black text-white px-8 py-3 text-xs tracking-widest font-medium">SIGN IN</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-serif mb-2">My Orders</h1>
        <p className="text-stone-500">Track and manage your recent purchases.</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-stone-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-sm text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-stone-100 rounded-lg bg-stone-50">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-stone-500 mb-6 font-serif text-lg">You haven't placed any orders yet.</p>
          <Link to="/" className="text-xs underline tracking-widest font-medium hover:no-underline uppercase">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-stone-200 rounded-lg overflow-hidden bg-white hover:border-stone-400 transition-colors">
              {/* Order Header */}
              <div className="bg-stone-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-stone-200 gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Order Placed</p>
                    <p className="text-xs font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Total</p>
                    <p className="text-xs font-medium">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Status</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-widest ${
                      order.status === 'completed' || order.status === 'fulfilled' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-stone-200 text-stone-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 text-right">Order #</p>
                  <p className="text-xs font-medium font-serif">#{order.display_id}</p>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.thumbnail} className="w-16 h-20 object-cover rounded bg-stone-50" />
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                        <p className="text-xs font-medium mt-1">{formatPrice(item.unit_price)}</p>
                      </div>
                      <Link 
                        to={`/product/${item.variant?.product_id || item.product_id}`}
                        className="text-[10px] uppercase tracking-widest font-bold border border-stone-200 px-3 py-2 hover:bg-stone-50 transition-colors"
                      >
                        VIEW PRODUCT
                      </Link>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
                  <div className="flex gap-4">
                    <Link 
                      to={`/return/${order.id}`}
                      className="text-xs font-medium underline underline-offset-4 hover:text-stone-600"
                    >
                      Request Return
                    </Link>
                    <button className="text-xs font-medium underline underline-offset-4 hover:text-stone-600">
                      Need Help?
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                    Order Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
