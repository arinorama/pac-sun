'use client';

import { createContext, useContext } from 'react';

interface TranslationContextType {
  texts: Record<string, string>;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  texts: Record<string, string>;
  children: React.ReactNode;
}

export function TranslationProvider({
  texts,
  children,
}: TranslationProviderProps) {
  const t = (key: string) => texts[key] || key;

  return (
    <TranslationContext.Provider value={{ texts, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context.t;
}

