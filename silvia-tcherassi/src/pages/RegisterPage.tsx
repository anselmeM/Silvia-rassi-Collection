import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { RegisterSchema, type RegisterInput } from '@/lib/validations';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    }
  });
  
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterInput) => {
    if (error) clearError();
    await registerUser(data);
    if (useAuthStore.getState().customer) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif text-center mb-8">Create Account</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                {...register('first_name')}
                className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                {...register('last_name')}
                className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

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
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
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
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="underline hover:no-underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}