import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserStore {
  user: User | null;
  wishlist: string[];
  setUser: (user: User | null) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      wishlist: [],
      setUser: (user) => set({ user }),
      addToWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist
            : [...state.wishlist, productId],
        })),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);

