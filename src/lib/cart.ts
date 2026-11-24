import { formatPrice } from './format';
import type { MenuCategory } from './menu.schema';

// A helper to prepare a phone order, not a shop: nothing is sent anywhere.
// The cart stores choices only (item key, size, extras, quantity). Prices are always
// resolved from the current menu (the catalog), so a saved cart never shows stale prices.

export const STORAGE_KEY = 'panier:v1';
const MAX_QUANTITY = 99;

export type CatalogItem = {
  key: string;
  categoryId: string;
  itemIndex: number;
  name: string;
  categoryTitle: string;
  prices: { label?: string; cents: number }[];
  extras: { label: string; cents: number; appliesTo?: string }[];
};
export type Catalog = Record<string, CatalogItem>;

export type CartLine = {
  itemKey: string;
  variant?: string;
  extras: string[];
  quantity: number;
};
export type Cart = { lines: CartLine[] };
export type Selection = { itemKey: string; variant?: string; extras?: string[] };

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const toCents = (amount: number) => Math.round(amount * 100);

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildCatalog(categories: { id: string; data: MenuCategory }[]): Catalog {
  const catalog: Catalog = {};
  for (const { id, data } of categories) {
    const extras = (data.extras ?? []).map((extra) => ({
      label: extra.label,
      cents: toCents(extra.amount),
      ...(extra.appliesTo ? { appliesTo: extra.appliesTo } : {}),
    }));
    for (const [itemIndex, item] of data.items.entries()) {
      if (!item.prices || item.prices.length === 0) continue;
      const base = `${id}/${slugify(item.name)}`;
      let key = base;
      for (let n = 2; key in catalog; n += 1) key = `${base}-${n}`;
      catalog[key] = {
        key,
        categoryId: id,
        itemIndex,
        name: item.name,
        categoryTitle: data.title,
        prices: item.prices.map((price) => ({
          ...(price.label ? { label: price.label } : {}),
          cents: toCents(price.amount),
        })),
        extras,
      };
    }
  }
  return catalog;
}

export const emptyCart = (): Cart => ({ lines: [] });
export const clearCart = emptyCart;

export function lineId(line: Pick<CartLine, 'itemKey' | 'variant' | 'extras'>): string {
  return `${line.itemKey}|${line.variant ?? ''}|${[...line.extras].sort().join(',')}`;
}

function resolvePrice(item: CatalogItem, variant?: string) {
  if (variant === undefined) return item.prices.length === 1 ? item.prices[0] : undefined;
  return item.prices.find((price) => price.label === variant);
}

function resolveExtra(item: CatalogItem, label: string, variant?: string) {
  return item.extras.find(
    (extra) => extra.label === label && (extra.appliesTo === undefined || extra.appliesTo === variant),
  );
}

function isValid(selection: Selection, catalog: Catalog): boolean {
  const item = catalog[selection.itemKey];
  if (!item || !resolvePrice(item, selection.variant)) return false;
  return (selection.extras ?? []).every((label) => resolveExtra(item, label, selection.variant));
}

function withLine(cart: Cart, line: CartLine): Cart {
  const id = lineId(line);
  const existing = cart.lines.find((candidate) => lineId(candidate) === id);
  if (!existing) return { lines: [...cart.lines, line] };
  return {
    lines: cart.lines.map((candidate) =>
      candidate === existing
        ? { ...candidate, quantity: Math.min(MAX_QUANTITY, candidate.quantity + line.quantity) }
        : candidate,
    ),
  };
}

export function addItem(cart: Cart, selection: Selection, catalog: Catalog): Cart {
  if (!isValid(selection, catalog)) return cart;
  const line: CartLine = {
    itemKey: selection.itemKey,
    ...(selection.variant !== undefined ? { variant: selection.variant } : {}),
    extras: [...new Set(selection.extras ?? [])].sort(),
    quantity: 1,
  };
  return withLine(cart, line);
}

export function changeQuantity(cart: Cart, id: string, delta: number): Cart {
  const target = cart.lines.find((line) => lineId(line) === id);
  if (!target) return cart;
  const quantity = Math.min(MAX_QUANTITY, target.quantity + delta);
  return {
    lines:
      quantity <= 0
        ? cart.lines.filter((line) => line !== target)
        : cart.lines.map((line) => (line === target ? { ...line, quantity } : line)),
  };
}

function unitCents(line: CartLine, catalog: Catalog): number | undefined {
  const item = catalog[line.itemKey];
  const price = item && resolvePrice(item, line.variant);
  if (!item || !price) return undefined;
  const extras = line.extras.reduce(
    (sum, label) => sum + (resolveExtra(item, label, line.variant)?.cents ?? 0),
    0,
  );
  return price.cents + extras;
}

export function cartTotalCents(cart: Cart, catalog: Catalog): number {
  return cart.lines.reduce((sum, line) => sum + (unitCents(line, catalog) ?? 0) * line.quantity, 0);
}

const NBSP = ' ';

export function serializeCart(cart: Cart, catalog: Catalog): string {
  const rows = cart.lines.flatMap((line) => {
    const item = catalog[line.itemKey];
    const unit = unitCents(line, catalog);
    if (!item || unit === undefined) return [];
    const variant = line.variant ? ` (${line.variant})` : '';
    const extras = line.extras.length > 0 ? ` + ${line.extras.join(', ')}` : '';
    return [`${line.quantity} x ${item.name}${variant}${extras}${NBSP}: ${formatPrice((unit * line.quantity) / 100)}`];
  });
  if (rows.length === 0) return '';
  return [`Ma commande${NBSP}:`, ...rows, `Total estimé${NBSP}: ${formatPrice(cartTotalCents(cart, catalog) / 100)}`].join(
    '\n',
  );
}

// Plain checks instead of a schema library: this file ships to the browser.
function parseStoredLine(candidate: unknown): CartLine | undefined {
  if (typeof candidate !== 'object' || candidate === null) return undefined;
  const { itemKey, variant, extras, quantity } = candidate as Record<string, unknown>;
  if (typeof itemKey !== 'string') return undefined;
  if (variant !== undefined && typeof variant !== 'string') return undefined;
  if (!Array.isArray(extras) || !extras.every((extra) => typeof extra === 'string')) return undefined;
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return undefined;
  }
  return { itemKey, ...(variant !== undefined ? { variant } : {}), extras: extras as string[], quantity };
}

export function loadCart(storage: StorageLike | undefined, catalog: Catalog): Cart {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    const lines = (JSON.parse(raw) as { lines?: unknown } | null)?.lines;
    if (!Array.isArray(lines)) return emptyCart();
    // One bad line must not wipe the others: validate line by line.
    return lines
      .flatMap((candidate) => parseStoredLine(candidate) ?? [])
      .filter((line) => isValid(line, catalog))
      .reduce<Cart>((cart, line) => withLine(cart, { ...line, extras: [...line.extras].sort() }), emptyCart());
  } catch {
    return emptyCart();
  }
}

export function saveCart(storage: StorageLike | undefined, cart: Cart): void {
  try {
    if (cart.lines.length === 0) storage?.removeItem(STORAGE_KEY);
    else storage?.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage refused (private mode, quota): the cart just stops being remembered.
  }
}
