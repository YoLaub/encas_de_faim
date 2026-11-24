import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  addItem,
  buildCatalog,
  cartTotalCents,
  changeQuantity,
  clearCart,
  emptyCart,
  extraCents,
  lineId,
  loadCart,
  saveCart,
  serializeCart,
} from './cart';
import type { Cart, Selection } from './cart';

const catalog = buildCatalog([
  {
    id: 'pizzas',
    data: {
      order: 1,
      title: 'Nos pizzas',
      extras: [
        { label: 'Ingrédient supplémentaire', amount: 1.5, appliesTo: '29 cm' },
        { label: 'Ingrédient supplémentaire', amount: 2, appliesTo: '33 cm' },
      ],
      items: [
        {
          name: 'Marguerita',
          prices: [
            { label: '29 cm', amount: 8 },
            { label: '33 cm', amount: 9 },
          ],
        },
        { name: 'Végétarienne', prices: [{ label: '29 cm', amount: 10 }, { label: '33 cm', amount: 12 }] },
        { name: 'Calzone', prices: [{ amount: 11 }] },
      ],
    },
  },
  {
    id: 'tacos',
    data: {
      order: 2,
      title: 'Nos tacos',
      extras: [
        { label: 'Avec boisson', amount: 1.5 },
        { label: 'Supplément viande', amount: 1.5 },
      ],
      items: [
        {
          name: 'Tacos poulet',
          prices: [
            { label: 'sans frites', amount: 9.5 },
            { label: 'avec frites', amount: 10.5 },
          ],
        },
      ],
    },
  },
  {
    id: 'sauces',
    data: { order: 3, title: 'Nos sauces', items: [{ name: 'Sauce au choix' }] },
  },
]);

const margherita29 = { itemKey: 'pizzas/marguerita', variant: '29 cm' };
const margherita33 = { itemKey: 'pizzas/marguerita', variant: '33 cm' };

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    removeItem: (key: string) => {
      delete data[key];
    },
  };
}

describe('buildCatalog', () => {
  it('builds a stable key from the category id and the accent-free item name', () => {
    expect(Object.keys(catalog)).toContain('pizzas/vegetarienne');
    expect(Object.keys(catalog)).toContain('tacos/tacos-poulet');
  });

  it('remembers the category id and the position of each item in its category', () => {
    expect(catalog['pizzas/marguerita']).toMatchObject({ categoryId: 'pizzas', itemIndex: 0 });
    expect(catalog['pizzas/calzone']).toMatchObject({ categoryId: 'pizzas', itemIndex: 2 });
  });

  it('converts euros to whole cents without float drift', () => {
    const rounded = buildCatalog([
      {
        id: 'x',
        data: { order: 1, title: 'X', items: [{ name: 'Plat', prices: [{ amount: 1.15 }, { amount: 9.95 }] }] },
      },
    ]);
    expect(rounded['x/plat'].prices.map((price) => price.cents)).toEqual([115, 995]);
  });

  it('leaves out items without a price, they cannot be ordered', () => {
    expect(catalog['sauces/sauce-au-choix']).toBeUndefined();
  });

  it('keeps the size an extra applies to', () => {
    expect(catalog['pizzas/marguerita'].extras).toEqual([
      { label: 'Ingrédient supplémentaire', cents: 150, appliesTo: '29 cm' },
      { label: 'Ingrédient supplémentaire', cents: 200, appliesTo: '33 cm' },
    ]);
  });

  it('gives two items with the same name distinct keys', () => {
    const duplicated = buildCatalog([
      {
        id: 'x',
        data: {
          order: 1,
          title: 'X',
          items: [
            { name: 'Plat', prices: [{ amount: 1 }] },
            { name: 'Plat', prices: [{ amount: 2 }] },
          ],
        },
      },
    ]);
    expect(Object.keys(duplicated)).toEqual(['x/plat', 'x/plat-2']);
  });
});

describe('addItem', () => {
  it('adds a new line with quantity 1', () => {
    const cart = addItem(emptyCart(), margherita29, catalog);
    expect(cart.lines).toEqual([{ ...margherita29, extras: [], quantity: 1 }]);
  });

  it('increments the quantity when the same selection is added again', () => {
    const cart = addItem(addItem(emptyCart(), margherita29, catalog), margherita29, catalog);
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].quantity).toBe(2);
  });

  it('keeps different sizes on separate lines', () => {
    const cart = addItem(addItem(emptyCart(), margherita29, catalog), margherita33, catalog);
    expect(cart.lines).toHaveLength(2);
  });

  it('attaches extras to the line and ignores their order', () => {
    const a = addItem(
      emptyCart(),
      { itemKey: 'tacos/tacos-poulet', variant: 'avec frites', extras: ['Avec boisson', 'Supplément viande'] },
      catalog,
    );
    const b = addItem(
      a,
      { itemKey: 'tacos/tacos-poulet', variant: 'avec frites', extras: ['Supplément viande', 'Avec boisson'] },
      catalog,
    );
    expect(b.lines).toHaveLength(1);
    expect(b.lines[0].quantity).toBe(2);
  });

  it('keeps the same dish with and without an extra on separate lines', () => {
    const plain = addItem(emptyCart(), { itemKey: 'tacos/tacos-poulet', variant: 'avec frites' }, catalog);
    const withDrink = addItem(
      plain,
      { itemKey: 'tacos/tacos-poulet', variant: 'avec frites', extras: ['Avec boisson'] },
      catalog,
    );
    expect(withDrink.lines).toHaveLength(2);
  });

  it('accepts a dish with a single price and no variant', () => {
    const cart = addItem(emptyCart(), { itemKey: 'pizzas/calzone' }, catalog);
    expect(cart.lines).toHaveLength(1);
  });

  it('refuses a dish with several prices when no variant is given', () => {
    const cart = emptyCart();
    expect(addItem(cart, { itemKey: 'pizzas/marguerita' }, catalog)).toBe(cart);
  });

  it('refuses an unknown item, an unknown variant and an unknown extra', () => {
    const cart = emptyCart();
    expect(addItem(cart, { itemKey: 'pizzas/inconnue' }, catalog)).toBe(cart);
    expect(addItem(cart, { itemKey: 'pizzas/marguerita', variant: '40 cm' }, catalog)).toBe(cart);
    expect(addItem(cart, { ...margherita29, extras: ['Caviar'] }, catalog)).toBe(cart);
  });

  it('prices an extra from the size that was chosen', () => {
    const cart = emptyCart();
    const sized = { ...margherita29, extras: ['Ingrédient supplémentaire'] };
    expect(addItem(cart, sized, catalog).lines).toHaveLength(1);
    // 8,00 + 1,50 (29 cm extra), not the 2,00 of the 33 cm size.
    expect(cartTotalCents(addItem(cart, sized, catalog), catalog)).toBe(950);
  });

  it('caps a line at 99 units', () => {
    let cart: Cart = { lines: [{ ...margherita29, extras: [], quantity: 99 }] };
    cart = addItem(cart, margherita29, catalog);
    expect(cart.lines[0].quantity).toBe(99);
  });

  it('does not mutate the cart it receives', () => {
    const cart = emptyCart();
    addItem(cart, margherita29, catalog);
    expect(cart.lines).toEqual([]);
  });
});

describe('changeQuantity', () => {
  const base = addItem(emptyCart(), margherita29, catalog);
  const id = lineId(base.lines[0]);

  it('increases and decreases the quantity', () => {
    const more = changeQuantity(base, id, 1);
    expect(more.lines[0].quantity).toBe(2);
    expect(changeQuantity(more, id, -1).lines[0].quantity).toBe(1);
  });

  it('removes the line when the last unit is taken out', () => {
    expect(changeQuantity(base, id, -1).lines).toEqual([]);
  });

  it('ignores an unknown line', () => {
    expect(changeQuantity(base, 'nope', 1)).toBe(base);
  });
});

describe('cartTotalCents', () => {
  it('is zero for an empty cart', () => {
    expect(cartTotalCents(emptyCart(), catalog)).toBe(0);
  });

  it('multiplies the unit price and the extras by the quantity, in cents', () => {
    let cart = addItem(emptyCart(), { ...margherita33, extras: ['Ingrédient supplémentaire'] }, catalog);
    cart = addItem(cart, { ...margherita33, extras: ['Ingrédient supplémentaire'] }, catalog);
    // (9,00 + 2,00) x 2
    expect(cartTotalCents(cart, catalog)).toBe(2200);
  });

  it('adds up different lines', () => {
    let cart = addItem(emptyCart(), margherita29, catalog);
    cart = addItem(
      cart,
      { itemKey: 'tacos/tacos-poulet', variant: 'avec frites', extras: ['Avec boisson', 'Supplément viande'] },
      catalog,
    );
    // 8,00 + (10,50 + 1,50 + 1,50)
    expect(cartTotalCents(cart, catalog)).toBe(2150);
  });

  it('ignores a line whose item left the menu', () => {
    const cart: Cart = { lines: [{ itemKey: 'pizzas/disparue', extras: [], quantity: 3 }] };
    expect(cartTotalCents(cart, catalog)).toBe(0);
  });
});

describe('clearCart', () => {
  it('returns an empty cart', () => {
    expect(clearCart().lines).toEqual([]);
  });
});

describe('serializeCart', () => {
  it('returns an empty string for an empty cart', () => {
    expect(serializeCart(emptyCart(), catalog)).toBe('');
  });

  it('writes one readable line per dish and an estimated total', () => {
    let cart = addItem(emptyCart(), { ...margherita33, extras: ['Ingrédient supplémentaire'] }, catalog);
    cart = addItem(cart, { ...margherita33, extras: ['Ingrédient supplémentaire'] }, catalog);
    cart = addItem(cart, { itemKey: 'pizzas/calzone' }, catalog);
    const text = serializeCart(cart, catalog).replace(/[^\S\n]/g, ' ');
    expect(text).toBe(
      [
        'Ma commande :',
        '2 x Marguerita (33 cm) + Ingrédient supplémentaire : 22,00 €',
        '1 x Calzone : 11,00 €',
        'Total estimé : 33,00 €',
      ].join('\n'),
    );
  });

  it('contains no em dash, en dash or emoji (style guide)', () => {
    const cart = addItem(emptyCart(), margherita29, catalog);
    const text = serializeCart(cart, catalog);
    expect(text).not.toMatch(/[—–]/);
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});

describe('persistence', () => {
  it('uses a versioned storage key', () => {
    expect(STORAGE_KEY).toBe('panier:v1');
  });

  it('restores what was saved', () => {
    const storage = memoryStorage();
    const cart = addItem(addItem(emptyCart(), margherita29, catalog), margherita29, catalog);
    saveCart(storage, cart);
    expect(loadCart(storage, catalog)).toEqual(cart);
  });

  it('removes the key when the cart is emptied', () => {
    const storage = memoryStorage();
    saveCart(storage, addItem(emptyCart(), margherita29, catalog));
    saveCart(storage, emptyCart());
    expect(STORAGE_KEY in storage.data).toBe(false);
  });

  it('returns an empty cart when nothing was saved', () => {
    expect(loadCart(memoryStorage(), catalog).lines).toEqual([]);
  });

  it('returns an empty cart for corrupted JSON, without throwing', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{not json' });
    expect(loadCart(storage, catalog).lines).toEqual([]);
  });

  it('returns an empty cart for valid JSON of the wrong shape', () => {
    for (const raw of ['null', '42', '"x"', '{"lines":"x"}', '{"lines":[{"quantity":"2"}]}']) {
      expect(loadCart(memoryStorage({ [STORAGE_KEY]: raw }), catalog).lines).toEqual([]);
    }
  });

  it('works without any storage (private mode, storage refused)', () => {
    expect(loadCart(undefined, catalog).lines).toEqual([]);
    expect(() => saveCart(undefined, emptyCart())).not.toThrow();
  });

  it('survives a storage that throws on read and on write', () => {
    const broken = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    };
    expect(loadCart(broken, catalog).lines).toEqual([]);
    expect(() => saveCart(broken, addItem(emptyCart(), margherita29, catalog))).not.toThrow();
  });

  it('refuses an extra tied to another size', () => {
    const wrongSize = { ...margherita29, extras: ['Ingrédient supplémentaire'] };
    const noExtraForSize: Selection = { itemKey: 'tacos/tacos-poulet', variant: 'avec frites', extras: ['Inconnu'] };
    expect(addItem(emptyCart(), wrongSize, catalog).lines).toHaveLength(1);
    expect(addItem(emptyCart(), noExtraForSize, catalog).lines).toHaveLength(0);
  });

  it('drops saved lines that no longer match the menu and keeps the valid ones', () => {
    const stored = {
      lines: [
        { itemKey: 'pizzas/marguerita', variant: '29 cm', extras: [], quantity: 2 },
        { itemKey: 'pizzas/disparue', extras: [], quantity: 1 },
        { itemKey: 'pizzas/marguerita', variant: '40 cm', extras: [], quantity: 1 },
        { itemKey: 'pizzas/marguerita', variant: '29 cm', extras: ['Caviar'], quantity: 1 },
        { itemKey: 'pizzas/calzone', extras: [], quantity: 0 },
      ],
    };
    const cart = loadCart(memoryStorage({ [STORAGE_KEY]: JSON.stringify(stored) }), catalog);
    expect(cart.lines).toEqual([{ itemKey: 'pizzas/marguerita', variant: '29 cm', extras: [], quantity: 2 }]);
  });

  it('prices from the current menu, not from what was saved', () => {
    const storage = memoryStorage();
    saveCart(storage, addItem(emptyCart(), margherita29, catalog));
    expect(storage.data[STORAGE_KEY]).not.toMatch(/800|8,00|8\.0/);
  });
});

describe('extraCents', () => {
  it('returns the price of an extra for the size of the line', () => {
    const small = { itemKey: 'pizzas/marguerita', variant: '29 cm', extras: [], quantity: 1 };
    const large = { ...small, variant: '33 cm' };
    expect(extraCents(small, 'Ingrédient supplémentaire', catalog)).toBe(150);
    expect(extraCents(large, 'Ingrédient supplémentaire', catalog)).toBe(200);
  });

  it('returns 0 for an unknown extra or item', () => {
    const line = { itemKey: 'pizzas/marguerita', variant: '29 cm', extras: [], quantity: 1 };
    expect(extraCents(line, 'Inconnu', catalog)).toBe(0);
    expect(extraCents({ ...line, itemKey: 'nope/nope' }, 'Ingrédient supplémentaire', catalog)).toBe(0);
  });
});
