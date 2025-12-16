import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyStore {
  currency: 'USD' | 'TRY';
  rate: number;
  setCurrency: (currency: 'USD' | 'TRY') => void;
  fetchRate: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: 'USD',
      rate: 1,
      setCurrency: (currency) => set({ currency }),
      fetchRate: async () => {
        try {
          const response = await fetch('/api/exchange-rate');
          const data = await response.json();
          set({ rate: data.rate || 1 });
        } catch (error) {
          console.error('Failed to fetch exchange rate:', error);
          set({ rate: 1 });
        }
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);

