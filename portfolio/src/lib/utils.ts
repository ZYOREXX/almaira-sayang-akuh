/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Fixed-decimal number with a true minus sign (U+2212) for statistics. */
export function formatStat(value: number, decimals: number): string {
  const fixed = Math.abs(value) < 10 ** -(decimals + 1) ? (0).toFixed(decimals) : value.toFixed(decimals);
  return fixed.replace('-', '−');
}

/** True for social/profile URLs that have not been filled in yet. */
export function isPlaceholderUrl(url: string): boolean {
  return !url || url.trim() === '#';
}
