import { describe, expect, it } from 'vitest';
import { formatPrice, menuCategorySchema, menuItemSchema } from './menu.schema';

describe('menuItemSchema', () => {
  it('accepts an item with multiple sized prices', () => {
    const result = menuItemSchema.safeParse({
      name: 'Marguerita',
      description: 'Tomate, fromage',
      prices: [
        { label: '29 cm', amount: 8 },
        { label: '33 cm', amount: 9 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts an item without prices (e.g. a sauce list entry)', () => {
    const result = menuItemSchema.safeParse({ name: 'Sauce au choix' });
    expect(result.success).toBe(true);
  });

  it('rejects an item without a name', () => {
    const result = menuItemSchema.safeParse({ prices: [{ amount: 8 }] });
    expect(result.success).toBe(false);
  });

  it('rejects a negative or zero price', () => {
    const result = menuItemSchema.safeParse({
      name: 'Cheese burger',
      prices: [{ amount: 0 }],
    });
    expect(result.success).toBe(false);
  });
});

describe('menuCategorySchema', () => {
  it('accepts a full category with extras and items', () => {
    const result = menuCategorySchema.safeParse({
      order: 1,
      title: 'Nos pizzas',
      note: 'Toutes nos pizzas sont faites maison',
      extras: [{ label: 'Ingrédient supplémentaire', amount: 1.5 }],
      items: [{ name: 'Marguerita', prices: [{ amount: 8 }] }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects a category with no items', () => {
    const result = menuCategorySchema.safeParse({
      order: 1,
      title: 'Nos pizzas',
      items: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('formatPrice', () => {
  it('formats an amount as French euros, amount and symbol separated by whitespace', () => {
    // Intl.NumberFormat fr-FR inserts a narrow no-break space (U+202F) between
    // the amount and "€" — not a regular space, so this must go through the
    // formatter rather than being written as a literal string.
    expect(formatPrice(8)).toMatch(/^8,00\s€$/);
  });

  it('formats decimals with a comma', () => {
    expect(formatPrice(11.5)).toMatch(/^11,50\s€$/);
  });
});
