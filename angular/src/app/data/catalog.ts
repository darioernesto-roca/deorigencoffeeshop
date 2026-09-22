export interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly image: string;
  readonly description: string;
}

export interface Category {
  readonly name: string;
  readonly description: string;
}

export const products: readonly Product[] = [
  { id: 1, name: 'Sierra Espresso', category: 'Espresso', price: 5.5, image: '/assets/img/products/img-1.jpg', description: 'A bright, balanced double shot with cacao and citrus notes.' },
  { id: 2, name: 'Cacao Celebration', category: 'Cake', price: 8, image: '/assets/img/products/img-2.jpg', description: 'Dark chocolate cake finished with a silky coffee ganache.' },
  { id: 3, name: 'Honey Oat Latte', category: 'Latte', price: 6.5, image: '/assets/img/products/img-3.jpg', description: 'Single-origin espresso, oat milk, and a touch of local honey.' },
  { id: 4, name: 'Morning Croissant', category: 'Pastry', price: 4.75, image: '/assets/img/products/img-4.jpg', description: 'A flaky, all-butter pastry baked in small batches each morning.' },
  { id: 5, name: 'Country Sourdough', category: 'Bread', price: 7.25, image: '/assets/img/products/img-5.jpg', description: 'Slow-fermented sourdough with a caramelized crust and open crumb.' },
  { id: 6, name: 'Origen Breakfast', category: 'Breakfast', price: 12, image: '/assets/img/products/img-6.jpg', description: 'Seasonal eggs, sourdough, greens, and house-roasted coffee.' }
];

export const categories: readonly Category[] = [
  { name: 'Espresso', description: 'Concentrated, expressive, and carefully dialed in.' },
  { name: 'Filter coffee', description: 'Clear, nuanced cups brewed to reveal their origin.' },
  { name: 'Milk drinks', description: 'Silky classics and thoughtful seasonal combinations.' },
  { name: 'Cold coffee', description: 'Slow-steeped and refreshing drinks for warm afternoons.' },
  { name: 'Breakfast', description: 'Simple, nourishing plates made with local ingredients.' },
  { name: 'Bakery', description: 'Bread, pastries, and cakes baked fresh every day.' }
];

export function filterProducts(query: string): readonly Product[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return normalizedQuery
    ? products.filter(({ name, category, description }) => [name, category, description].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)))
    : products;
}
