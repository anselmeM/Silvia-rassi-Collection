import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { medusaFetch } from '@/lib/medusa';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, Package, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReturnItem {
  item_id: string;
  quantity: number;
  reason_id: string;
  note?: string;
}

export default function ReturnRequestPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [returnReasons, setReturnReasons] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: number, reason_id: string, note: string }>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;
      try {
        // 1. Fetch Order Details
        const orderData = await medusaFetch(`/store/orders/${orderId}`);
        setOrder(orderData.order);

        // 2. Fetch Return Reasons
        const reasonsData = await medusaFetch('/store/return-reasons');
        setReturnReasons(reasonsData.return_reasons);
      } catch (err: any) {
        console.error('Failed to fetch data for return:', err);
        setError('Could not load order details. Please verify the order ID or contact support.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const toggleItem = (itemId: string, maxQty: number) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId]) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = { 
          quantity: 1, 
          reason_id: returnReasons[0]?.id || '', 
          note: '' 
        };
      }
      return newItems;
    });
  };

  const updateItemDetails = (itemId: string, field: string, value: any) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(selectedItems).length === 0) {
      setError('Please select at least one item to return.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const items = Object.entries(selectedItems).map(([id, details]) => ({
        item_id: id,
        quantity: details.quantity,
        reason_id: details.reason_id,
        note: details.note
      }));

      await medusaFetch('/store/returns', {
        method: 'POST',
        body: JSON.stringify({
          order_id: orderId,
          items: items
        }),
      });

      setSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit return:', err);
      setError(err.message || 'Failed to submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-stone-400 font-serif">Loading order details...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" strokeWidth={1} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif">Return Request Received</h1>
          <p className="text-stone-600 text-lg">
            We've received your return request for order <span className="font-medium">#{order?.display_id}</span>. 
            Our team will review it and send you an email with shipping instructions shortly.
          </p>
        </div>
        <div className="pt-8">
          <Link to="/my-orders" className="bg-black text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors">
            RETURN TO ORDERS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <Link to="/my-orders" className="flex items-center gap-2 text-stone-400 hover:text-black transition-colors mb-8 text-xs font-bold tracking-widest uppercase">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-serif mb-2">Request Return</h1>
        <p className="text-stone-500">Order #{order?.display_id} • {new Date(order?.created_at).toLocaleDateString()}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-6">
          <h2 className="text-xl font-serif border-b pb-4">Select Items to Return</h2>
          
          {order?.items.map((item: any) => {
            const isSelected = !!selectedItems[item.id];
            // Don't allow returning items that were already returned if backend provides that info
            // For now, assume all items can be selected
            
            return (
              <div key={item.id} className={`p-6 border rounded-lg transition-colors ${isSelected ? 'border-black bg-stone-50' : 'border-stone-100'}`}>
                <div className="flex items-start gap-6">
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleItem(item.id, item.quantity)}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                  </div>
                  <img src={item.thumbnail} className="w-20 h-24 object-cover rounded bg-white shadow-sm" />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="font-serif text-lg">{item.title}</p>
                      <p className="font-medium">{formatPrice(item.unit_price)}</p>
                    </div>
                    <p className="text-xs text-stone-500 mb-4">{item.description}</p>
                    
                    {isSelected && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-stone-200 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Reason for Return</label>
                          <select 
                            required
                            value={selectedItems[item.id].reason_id}
                            onChange={(e) => updateItemDetails(item.id, 'reason_id', e.target.value)}
                            className="w-full border-b border-stone-300 py-2 outline-none focus:border-black bg-transparent text-sm"
                          >
                            <option value="">Select a reason</option>
                            {returnReasons.map(r => (
                              <option key={r.id} value={r.id}>{r.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Quantity</label>
                          <select 
                            value={selectedItems[item.id].quantity}
                            onChange={(e) => updateItemDetails(item.id, 'quantity', parseInt(e.target.value))}
                            className="w-full border-b border-stone-300 py-2 outline-none focus:border-black bg-transparent text-sm"
                          >
                            {[...Array(item.quantity)].map((_, i) => (
                              <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Additional Note (Optional)</label>
                          <textarea 
                            value={selectedItems[item.id].note}
                            onChange={(e) => updateItemDetails(item.id, 'note', e.target.value)}
                            placeholder="Tell us more about the issue..."
                            className="w-full border border-stone-200 p-3 text-sm focus:border-black outline-none h-24 rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 flex flex-col items-center gap-6 border-t">
          <div className="text-center space-y-2">
            <p className="text-sm font-serif">Selected {Object.keys(selectedItems).length} item(s) for return</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Returns are subject to our policy. Approval may take 1-2 business days.</p>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || Object.keys(selectedItems).length === 0}
            className="w-full max-w-md bg-black text-white py-5 text-sm font-bold tracking-widest hover:bg-stone-800 transition-colors disabled:bg-stone-200 uppercase"
          >
            {isSubmitting ? 'Submitting Request...' : 'Submit Return Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
