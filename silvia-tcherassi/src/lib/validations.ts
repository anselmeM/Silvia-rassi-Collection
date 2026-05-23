import { z } from 'zod';

// ===================================================================
// Product Validation Schemas
// ===================================================================

export const CategorySchema = z.enum(['dress', 'blouse', 'handbag', 'accessory']);

export const ProductIdSchema = z.string().uuid({
  message: 'Invalid product ID format',
});

export const QuantitySchema = z.number()
  .int({ message: 'Quantity must be an integer' })
  .min(1, 'Quantity must be at least 1')
  .max(99, 'Quantity cannot exceed 99');

export const ProductSchema = z.object({
  id: ProductIdSchema,
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters'),
  price: z.number()
    .int({ message: 'Price must be in cents' })
    .positive({ message: 'Price must be positive' }),
  category: CategorySchema,
  images: z.array(z.string().url({ message: 'Invalid image URL' }))
    .min(1, 'At least one image is required')
    .max(10, 'Cannot exceed 10 images'),
  thumbnails: z.array(z.string().url({ message: 'Invalid thumbnail URL' })),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  inStock: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
});

// ===================================================================
// Cart Validation Schemas
// ===================================================================

export const AddToCartSchema = z.object({
  productId: ProductIdSchema,
  quantity: QuantitySchema.default(1),
});

export const UpdateCartQuantitySchema = z.object({
  productId: ProductIdSchema,
  quantity: QuantitySchema,
});

export const CartItemSchema = z.object({
  productId: ProductIdSchema,
  quantity: QuantitySchema,
  addedAt: z.string().datetime(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  subtotal: z.number().int(),
  currency: z.literal('USD'),
  lastUpdated: z.string().datetime(),
});

// ===================================================================
// UI Validation Schemas
// ===================================================================

export const ToastSchema = z.object({
  id: z.string(),
  message: z.string().min(1),
  type: z.enum(['success', 'error', 'info']),
});

export const RouteParamSchema = z.object({
  productId: ProductIdSchema.optional(),
});

// ===================================================================
// Filter/Query Schemas
// ===================================================================

export const ProductFiltersSchema = z.object({
  category: CategorySchema.optional(),
  categories: z.array(CategorySchema).optional(),
  search: z.string().max(100).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().positive().optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(12),
});

// ===================================================================
// Auth Validation Schemas
// ===================================================================

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const RegisterSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

// ===================================================================
// Type Exports
// ===================================================================

export type Category = z.infer<typeof CategorySchema>;
export type ProductId = z.infer<typeof ProductIdSchema>;
export type Quantity = z.infer<typeof QuantitySchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof UpdateCartQuantitySchema>;
export type CartItemInput = z.infer<typeof CartItemSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
