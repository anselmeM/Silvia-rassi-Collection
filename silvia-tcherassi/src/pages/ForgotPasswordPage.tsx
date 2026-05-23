import { useState } from 'react';
import { Link } from 'react-router-dom';
import { medusaFetch } from '@/lib/medusa';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await medusaFetch('/store/customers/password-token', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setStatus('success');
      setMessage('If an account with that email exists, we have sent password reset instructions.');
    } catch (err: any) {
      // Don't leak whether an email exists for security reasons
      setStatus('success');
      setMessage('If an account with that email exists, we have sent password reset instructions.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif text-center mb-8">Reset Password</h1>
        
        {status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm">
              {message}
            </div>
            <Link to="/login" className="block text-sm underline hover:no-underline text-black">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 text-center mb-8">
              Enter your email address below and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-black text-white py-4 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {status === 'loading' ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/login" className="text-xs text-gray-400 hover:text-black">
                Cancel
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
