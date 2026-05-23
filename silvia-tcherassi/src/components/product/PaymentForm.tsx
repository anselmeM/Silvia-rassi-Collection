import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { medusaFetch } from '@/lib/medusa';

interface PaymentFormProps {
  cartId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function PaymentForm({ cartId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      // 1. Create payment session in Medusa
      const { cart } = await medusaFetch(`/store/carts/${cartId}/payment-sessions`, {
        method: 'POST',
      });
      
      // 2. Select the stripe session
      const stripeSession = cart.payment_collection?.payment_sessions?.find((s: any) => s.provider_id === 'stripe') 
                          || cart.payment_sessions?.find((s: any) => s.provider_id === 'stripe');
      
      if (!stripeSession) {
        throw new Error('Stripe payment session not found. Please ensure the Stripe plugin is configured in the backend.');
      }

      // 3. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        stripeSession.data.client_secret as string,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // 4. Complete cart in Medusa
        const result = await medusaFetch(`/store/carts/${cartId}/complete`, {
          method: 'POST',
        });
        
        // Medusa 2.0 might return different structures for complete
        console.log('Cart completion result:', result);
        onSuccess();
      } else {
        throw new Error(`Payment intent status: ${paymentIntent.status}`);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md bg-stone-50">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-black text-white py-4 text-sm font-medium tracking-widest hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isLoading ? 'PROCESSING...' : 'PAY NOW'}
      </button>
    </form>
  );
}
