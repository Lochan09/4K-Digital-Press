export type CatalogCard = {
  title: string;
  subtitle: string;
};

export type CatalogItem = {
  image: string;
  title: string;
};

export type CatalogCategory = {
  items: CatalogItem[];
};

export type Service = {
  icon: string;
  title: string;
  description: string;
};

export type OrderField = {
  label: string;
  placeholder: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type Page = 'main' | 'about' | 'achievements' | 'admin' | 'myorders';
