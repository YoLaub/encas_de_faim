import { z } from 'zod';

export const priceSchema = z.object({
  label: z.string().optional(),
  amount: z.number().positive(),
});

export const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  prices: z.array(priceSchema).optional(),
  tags: z.array(z.string()).optional(),
});

export const menuCategorySchema = z.object({
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  note: z.string().optional(),
  extras: z.array(priceSchema).optional(),
  items: z.array(menuItemSchema).min(1),
});

export type Price = z.infer<typeof priceSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}
