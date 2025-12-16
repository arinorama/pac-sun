'use client';

import { Button } from '@/components/atoms/Button';
import { useCurrencyStore } from '@/store/useCurrencyStore';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore();

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'TRY' : 'USD');
  };

  return (
    <div data-component="CurrencySwitcher">
      <Button
        data-component="CurrencySwitcher.Button"
        variant="ghost"
        size="sm"
        onClick={toggleCurrency}
      >
        {currency}
      </Button>
    </div>
  );
}

