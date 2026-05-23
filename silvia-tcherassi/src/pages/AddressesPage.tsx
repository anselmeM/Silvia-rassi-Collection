import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { medusaFetch } from '@/lib/medusa';
import { MapPin, Plus, Trash2, Edit2, Home, Briefcase } from 'lucide-react';

const AddressSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address_1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country_code: z.string().length(2, 'Use 2-letter country code'),
  postal_code: z.string().min(1, 'Postal code is required'),
  phone: z.string().optional(),
});

type AddressInput = z.infer<typeof AddressSchema>;

export default function AddressesPage() {
  const { customer, checkSession } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressInput>();

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    try {
      if (editingId) {
        await medusaFetch(`/store/customers/me/addresses/${editingId}`, {
          method: 'POST', // Medusa 2.0 uses POST for updates usually, check if DELETE/POST pattern
          body: JSON.stringify(data),
        });
      } else {
        await medusaFetch('/store/customers/me/addresses', {
          method: 'POST',
          body: JSON.stringify({ address: data }),
        });
      }
      await checkSession();
      setIsAdding(false);
      setEditingId(null);
      reset();
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await medusaFetch(`/store/customers/me/addresses/${addressId}`, {
        method: 'DELETE',
      });
      await checkSession();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const startEdit = (address: any) => {
    setEditingId(address.id);
    reset({
      first_name: address.first_name,
      last_name: address.last_name,
      address_1: address.address_1,
      city: address.city,
      country_code: address.country_code,
      postal_code: address.postal_code,
      phone: address.phone,
    });
    setIsAdding(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif mb-2">My Addresses</h1>
          <p className="text-stone-500">Manage your saved shipping and billing addresses.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white border border-stone-200 rounded-lg p-8 max-w-2xl">
          <h2 className="text-xl font-serif mb-8">{editingId ? 'Edit Address' : 'New Address'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">First Name</label>
                <input {...register('first_name')} className="w-full border-b py-2 focus:border-black outline-none border-stone-200" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Last Name</label>
                <input {...register('last_name')} className="w-full border-b py-2 focus:border-black outline-none border-stone-200" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Address</label>
              <input {...register('address_1')} className="w-full border-b py-2 focus:border-black outline-none border-stone-200" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">City</label>
                <input {...register('city')} className="w-full border-b py-2 focus:border-black outline-none border-stone-200" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Postal Code</label>
                <input {...register('postal_code')} className="w-full border-b py-2 focus:border-black outline-none border-stone-200" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Country Code (e.g. US)</label>
              <input {...register('country_code')} className="w-full border-b py-2 focus:border-black outline-none border-stone-200" />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-8 py-4 text-xs tracking-widest font-bold uppercase hover:bg-stone-800 transition-colors"
              >
                {isLoading ? 'SAVING...' : 'SAVE ADDRESS'}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); reset(); }}
                className="border border-stone-200 px-8 py-4 text-xs tracking-widest font-bold uppercase hover:bg-stone-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customer?.shipping_addresses?.map((address: any) => (
            <div key={address.id} className="border border-stone-200 rounded-lg p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-stone-400" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(address)} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-black">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(address.id)} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-serif text-lg mb-1">{address.first_name} {address.last_name}</p>
                <p className="text-sm text-stone-600">{address.address_1}</p>
                <p className="text-sm text-stone-600">{address.city}, {address.postal_code}</p>
                <p className="text-sm text-stone-600 uppercase tracking-widest text-[10px] mt-2 font-bold">{address.country_code}</p>
              </div>
            </div>
          ))}
          
          {(!customer?.shipping_addresses || customer.shipping_addresses.length === 0) && (
            <div className="md:col-span-2 text-center py-20 border border-stone-100 rounded-lg bg-stone-50">
              <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" strokeWidth={1} />
              <p className="text-stone-500 font-serif text-lg">No saved addresses found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
