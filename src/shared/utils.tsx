export function formatCurrency(value: number) {
    return new Intl.NumberFormat('us', {
      style: 'currency',
      currency: 'USD', // Alterar para a moeda desejada, como 'USD', 'EUR', etc.
    }).format(value);
}
  