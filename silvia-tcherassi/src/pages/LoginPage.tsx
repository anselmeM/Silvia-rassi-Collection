import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { LoginSchema, type LoginInput } from '@/lib/validations';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data: LoginInput) => {
    if (error) clearError();
    await login(data.email, data.password);
    if (useAuthStore.getState().customer) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif text-center mb-8">Sign In</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-500">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-black">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="underline hover:no-underline">
              Create one
            </Link>
          </p>
          <Link to="/" className="block text-xs text-gray-400 hover:text-black">
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}