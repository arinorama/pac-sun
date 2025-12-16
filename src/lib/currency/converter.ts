import { useCurrencyStore } from '@/store/useCurrencyStore';

export function formatPrice(
  amount: number,
  currency?: 'USD' | 'TRY',
  rate?: number
): string {
  // If called from server component, use provided values
  if (currency && rate) {
    const convertedAmount = currency === 'TRY' ? amount * rate : amount;
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency,
    }).format(convertedAmount);
  }

  // For client components, this will be called with hook
  return '';
}

export function useFormatPrice() {
  const { currency, rate } = useCurrencyStore();
  
  return (amount: number) => {
    const convertedAmount = currency === 'TRY' ? amount * rate : amount;
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency,
    }).format(convertedAmount);
  };
}

