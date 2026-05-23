import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { formatPrice } from '@/lib/utils';
import { medusa, medusaFetch } from '@/lib/medusa';
import PaymentForm from '@/components/product/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

export default function CheckoutPage() {
  const { cartId, items, subtotal } = useCartStore();
  const { 
    step, setStep, 
    shippingAddress, setShippingAddress,
    shippingMethod, setShippingMethod,
    isBillingSameAsShipping, setBillingSameAsShipping
  } = useCheckoutStore();
  const navigate = useNavigate();
  const [shippingOptions, setShippingMethodOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartId || items.length === 0) {
      // navigate('/'); // Commented out for dev to see the page
    }
  }, [cartId, items, navigate]);

  // Fetch shipping options when reaching step 2
  useEffect(() => {
    if (step === 2 && cartId) {
      const fetchShippingOptions = async () => {
        try {
          const data = await medusaFetch(`/store/shipping-options?cart_id=${cartId}`);
          setShippingMethodOptions(data.shipping_options);
        } catch (error) {
          console.error('Failed to fetch shipping options:', error);
        }
      };
      fetchShippingOptions();
    }
  }, [step, cartId]);

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError(null);
    
    const formData = new FormData(e.currentTarget);
    const address = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      address_1: formData.get('address_1') as string,
      city: formData.get('city') as string,
      country_code: formData.get('country_code') as string,
      postal_code: formData.get('postal_code') as string,
      phone: formData.get('phone') as string,
    };

    try {
      if (cartId) {
        await medusaFetch(`/store/carts/${cartId}`, {
          method: 'POST',
          body: JSON.stringify({
            shipping_address: address,
            billing_address: isBillingSameAsShipping ? address : undefined,
            email: formData.get('email') as string, // Ensure email is sent if not in cart
          }),
        });
      }
      setShippingAddress(address);
      setStep(2);
    } catch (error: any) {
      console.error('Failed to update address:', error);
      setPaymentError(error.message || 'Failed to update shipping information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShippingMethodSelect = async (optionId: string) => {
    setIsLoading(true);
    try {
      if (cartId) {
        await medusaFetch(`/store/carts/${cartId}/shipping-methods`, {
          method: 'POST',
          body: JSON.stringify({ option_id: optionId }),
        });
      }
      setShippingMethod(optionId);
      setStep(3);
    } catch (error: any) {
      console.error('Failed to add shipping method:', error);
      setPaymentError(error.message || 'Failed to select shipping method');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Checkout Flow */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif">Checkout</h1>
            <div className="flex space-x-2">
              <span className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-300'}`}></span>
              <span className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-300'}`}></span>
              <span className={`h-2 w-8 rounded-full ${step >= 3 ? 'bg-black' : 'bg-gray-300'}`}></span>
            </div>
          </div>

          {/* STEP 1: Shipping Address */}
          <div className={`bg-white p-8 rounded-lg shadow-sm ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-serif mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs mr-3">1</span>
              Shipping Information
            </h2>
            
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                  <input name="first_name" required defaultValue={shippingAddress?.first_name} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                  <input name="last_name" required defaultValue={shippingAddress?.last_name} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Address</label>
                  <input name="address_1" required defaultValue={shippingAddress?.address_1} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">City</label>
                  <input name="city" required defaultValue={shippingAddress?.city} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                  <input name="postal_code" required defaultValue={shippingAddress?.postal_code} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Country Code (e.g. US)</label>
                  <input name="country_code" required defaultValue={shippingAddress?.country_code || 'us'} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                  <input name="phone" required defaultValue={shippingAddress?.phone} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black" />
                </div>
                
                <div className="col-span-2 mt-4">
                  <label className="flex items-center text-sm text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={isBillingSameAsShipping} 
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                      className="mr-2"
                    />
                    Billing address same as shipping
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="col-span-2 bg-black text-white py-4 text-sm font-medium tracking-widest hover:bg-gray-800 disabled:bg-gray-400 mt-4"
                >
                  {isLoading ? 'SAVING...' : 'CONTINUE TO SHIPPING'}
                </button>
              </form>
            )}

            {step > 1 && shippingAddress && (
              <div className="text-sm text-gray-600">
                <p>{shippingAddress.first_name} {shippingAddress.last_name}</p>
                <p>{shippingAddress.address_1}</p>
                <p>{shippingAddress.city}, {shippingAddress.postal_code}</p>
                <button onClick={() => setStep(1)} className="text-black underline mt-2">Edit</button>
              </div>
            )}
          </div>

          {/* STEP 2: Shipping Method */}
          <div className={`bg-white p-8 rounded-lg shadow-sm ${step < 2 ? 'opacity-50 pointer-events-none' : ''} ${step === 2 ? 'ring-2 ring-black' : ''}`}>
            <h2 className="text-xl font-serif mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs mr-3">2</span>
              Shipping Method
            </h2>

            {step === 2 && (
              <div className="space-y-4">
                {shippingOptions.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Loading shipping options...</p>
                ) : (
                  shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleShippingMethodSelect(option.id)}
                      className="w-full flex justify-between items-center p-4 border rounded-md hover:border-black transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-medium">{option.name}</p>
                        <p className="text-xs text-gray-500">{option.data?.description || 'Delivery in 2-5 business days'}</p>
                      </div>
                      <p className="font-medium">{formatPrice(option.amount)}</p>
                    </button>
                  ))
                )}
                <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-black">Back to Address</button>
              </div>
            )}
          </div>

          {/* STEP 3: Payment */}
          <div className={`bg-white p-8 rounded-lg shadow-sm ${step < 3 ? 'opacity-50 pointer-events-none' : ''} ${step === 3 ? 'ring-2 ring-black' : ''}`}>
            <h2 className="text-xl font-serif mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs mr-3">3</span>
              Payment Information
            </h2>
            {step === 3 && cartId && (
              <div className="py-4">
                {paymentError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
                    {paymentError}
                  </div>
                )}
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    cartId={cartId} 
                    onSuccess={() => navigate('/order-confirmation')}
                    onError={(msg) => setPaymentError(msg)}
                  />
                </Elements>
                <button onClick={() => setStep(2)} className="block w-full mt-4 text-sm text-gray-400 hover:text-black text-center italic">Back to Shipping</button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-xl font-serif mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex">
                    <img src={item.thumbnail} className="w-12 h-12 object-cover rounded mr-3" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p>{formatPrice(item.unit_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{step > 2 ? 'Calculated' : 'TBD'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
