export interface PageFields {
  title?: string;
  slug?: string;
  components?: Array<{
    sys: {
      id: string;
      contentType: {
        sys: {
          id: string;
        };
      };
    };
    fields?: Record<string, unknown>;
  }>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Page {
  fields: PageFields;
  sys: {
    id: string;
  };
}

