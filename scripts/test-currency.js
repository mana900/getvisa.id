// Simple test script to verify currency formatting
const formatIDR = (price) => {
  if (price === 0) return 'Contact for pricing';
  return `Rp ${price.toLocaleString()}`;
}

const formatIDRCompact = (price) => {
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
  
  return `Rp ${price.toLocaleString()}`;
}

// Test cases
const testPrices = [
  3300000,  // Canada
  2880000,  // Australia
  1800000,  // China
  1350000,  // Singapore/Malaysia
  1100000,  // Japan
  0,        // Dubai (should show contact message)
  999       // Small amount
];

console.log('Testing currency formatting:');
console.log('================================');

testPrices.forEach(price => {
  console.log(`${price.toLocaleString()} → "${formatIDR(price)}" (compact: "${formatIDRCompact(price)}")`);
});

console.log('================================');
console.log('✅ Currency formatting test completed successfully!');