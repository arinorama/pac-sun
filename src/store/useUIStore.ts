import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  toggleSearchModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchModalOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  toggleSearchModal: () =>
    set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
}));

