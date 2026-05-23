import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { medusaFetch } from '@/lib/medusa';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

const ProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileInput = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const { customer, checkSession } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
    }
  });

  const onSubmit = async (data: ProfileInput) => {
    setIsUpdating(true);
    setMessage(null);
    try {
      await medusaFetch('/store/customers/me', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await checkSession(); // Refresh local customer state
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-serif mb-2">My Profile</h1>
        <p className="text-stone-500">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Sidebar Nav (Placeholder for future portal sub-pages) */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-4 py-2 text-sm font-bold tracking-widest bg-stone-100 border-l-2 border-black uppercase">
            Personal Info
          </button>
          <button className="w-full text-left px-4 py-2 text-sm font-medium tracking-widest text-stone-400 hover:text-black uppercase transition-colors">
            Security
          </button>
          <button className="w-full text-left px-4 py-2 text-sm font-medium tracking-widest text-stone-400 hover:text-black uppercase transition-colors">
            Email Preferences
          </button>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h2 className="text-xl font-serif mb-8 flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Details
            </h2>

            {message && (
              <div className={`p-4 rounded-md mb-8 text-sm flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.type === 'success' && <ShieldCheck className="w-4 h-4" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">First Name</label>
                  <input 
                    {...register('first_name')}
                    className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.first_name ? 'border-red-500' : 'border-stone-200'}`}
                  />
                  {errors.first_name && <p className="text-red-500 text-[10px] mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Last Name</label>
                  <input 
                    {...register('last_name')}
                    className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.last_name ? 'border-red-500' : 'border-stone-200'}`}
                  />
                  {errors.last_name && <p className="text-red-500 text-[10px] mt-1">{errors.last_name.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input 
                  {...register('email')}
                  className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-stone-200'}`}
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input 
                  {...register('phone')}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full border-b py-2 focus:border-black outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-stone-200'}`}
                />
                {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isUpdating || !isDirty}
                  className="bg-black text-white px-8 py-4 text-xs tracking-widest font-bold uppercase hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12 bg-stone-50 border border-stone-200 rounded-lg p-8">
            <h2 className="text-xl font-serif mb-4">Password & Security</h2>
            <p className="text-sm text-stone-500 mb-6">
              To change your password, you will need to request a password reset email for your security.
            </p>
            <button className="text-xs font-bold uppercase tracking-widest border border-black px-6 py-3 hover:bg-white transition-colors">
              RESET PASSWORD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
