// Figures read by hand on the Google listing (not fetched at build time).
// They go stale: re-read them and update `checkedAt` when the page is revisited.
export const googleReviews = {
  score: 4.2,
  count: 210,
  checkedAt: '2026-11-24',
  href: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x480fe7632584864d:0xbbaa019aea4311d1',
};

export type Rating = { score: number; count: number };

const scoreFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatRatingLabel({ score, count }: Rating): string {
  return `${scoreFormatter.format(score)} sur 5 · ${count} avis Google`;
}
