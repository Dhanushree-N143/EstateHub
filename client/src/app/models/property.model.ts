export interface Property {
  id: string;
  title: string;
  city: string;
  community: string;
  category: 'sale' | 'rent' | 'invest';
  type: 'apartment' | 'villa' | 'studio' | 'penthouse';
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  tag: string;
  colors: [string, string];
  image: string;
}
