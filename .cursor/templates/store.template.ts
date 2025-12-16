import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  // State
  items: string[];
  
  // Actions
  addItem: (item: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  
  // Computed (getters)
  get totalItems(): number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item !== id)
      })),
      
      clearItems: () => set({ items: [] }),
      
      get totalItems() {
        return get().items.length;
      }
    }),
    {
      name: 'store-name', // localStorage key
    }
  )
);

