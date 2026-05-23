import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { medusaFetch } from '@/lib/medusa';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid or missing reset token');
      return;
    }

    setStatus('loading');
    try {
      await medusaFetch('/store/customers/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token, password })
      });
      setStatus('success');
      setMessage('Password successfully reset.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to reset password. The link may have expired.');
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-serif mb-4">Invalid Reset Link</h1>
        <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
        <button onClick={() => navigate('/forgot-password')} className="underline">
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif text-center mb-8">Set New Password</h1>
        
        {status === 'error' && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
            {message}
          </div>
        )}
        
        {status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm">
              {message}
            </div>
            <p className="text-sm text-gray-600">Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-black text-white py-4 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {status === 'loading' ? 'SAVING...' : 'RESET PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
