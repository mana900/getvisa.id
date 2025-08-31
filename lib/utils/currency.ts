/**
 * Format price in Indonesian Rupiah (IDR)
 */
export function formatIDR(price: number): string {
  if (price === 0) return 'Contact for pricing';
  
  // Use a simple number formatting approach that works across all browsers
  return `Rp ${price.toLocaleString()}`;
}

/**
 * Format price with compact notation for large numbers
 */
export function formatIDRCompact(price: number): string {
  if (price === 0) return 'Contact for pricing';
  
  // For millions
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `Rp ${millions.toFixed(1)}M`;
  }
  
  // For thousands  
  if (price >= 1000) {
    const thousands = price / 1000;
    return `Rp ${thousands.toFixed(0)}K`;
  }
  
  return `Rp ${price.toLocaleString('id-ID')}`;
}