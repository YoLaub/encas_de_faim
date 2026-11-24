const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}
