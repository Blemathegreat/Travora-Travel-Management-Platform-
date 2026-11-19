// src/utils/money.js
// "12000.00" (text from the server)  ->  "₦12,000.00"
export function formatMoney(value) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value) || 0);
}