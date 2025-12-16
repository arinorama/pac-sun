import type { Entry } from 'contentful';

export interface PageFields {
  title: string;
  slug: string;
  components?: Entry<unknown>[];
  seoTitle?: string;
  seoDescription?: string;
}

export type Page = Entry<PageFields>;

