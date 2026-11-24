import { describe, expect, it } from 'vitest';
import { formatRatingLabel, googleReviews } from './reviews';

describe('formatRatingLabel', () => {
  it('uses a decimal comma and the review count', () => {
    expect(formatRatingLabel({ score: 4.2, count: 210 })).toBe('4,2 sur 5 · 210 avis Google');
  });

  it('keeps a trailing zero so the score always has one decimal', () => {
    expect(formatRatingLabel({ score: 4, count: 12 })).toBe('4,0 sur 5 · 12 avis Google');
  });

  it('uses the singular for a single review', () => {
    expect(formatRatingLabel({ score: 5, count: 1 })).toBe('5,0 sur 5 · 1 avis Google');
  });
});

describe('googleReviews data', () => {
  it('has a score between 0 and 5 and a positive review count', () => {
    expect(googleReviews.score).toBeGreaterThan(0);
    expect(googleReviews.score).toBeLessThanOrEqual(5);
    expect(googleReviews.count).toBeGreaterThan(0);
  });

  it('records when the figures were read and links to the Google listing', () => {
    expect(googleReviews.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(googleReviews.href).toMatch(/^https:\/\/www\.google\.com\/maps\//);
  });
});
