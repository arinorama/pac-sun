export const locales = ['en', 'tr'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

