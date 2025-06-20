export function formatCurrency(value: number) {
    return new Intl.NumberFormat('us', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
}

export function getFirstDayInMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}
  