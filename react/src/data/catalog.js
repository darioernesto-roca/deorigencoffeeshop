const espressoImage = new URL('../../../html/img/products/img-1.jpg', import.meta.url).href;
const cakeImage = new URL('../../../html/img/products/img-2.jpg', import.meta.url).href;
const latteImage = new URL('../../../html/img/products/img-3.jpg', import.meta.url).href;
const pastryImage = new URL('../../../html/img/products/img-4.jpg', import.meta.url).href;
const breadImage = new URL('../../../html/img/products/img-5.jpg', import.meta.url).href;
const breakfastImage = new URL('../../../html/img/products/img-6.jpg', import.meta.url).href;

export const products = [
  { id: 1, name: 'Sierra Espresso', category: 'Espresso', price: 5.5, image: espressoImage, description: 'A bright, balanced double shot with cacao and citrus notes.' },
  { id: 2, name: 'Cacao Celebration', category: 'Cake', price: 8, image: cakeImage, description: 'Dark chocolate cake finished with a silky coffee ganache.' },
  { id: 3, name: 'Honey Oat Latte', category: 'Latte', price: 6.5, image: latteImage, description: 'Single-origin espresso, oat milk, and a touch of local honey.' },
  { id: 4, name: 'Morning Croissant', category: 'Pastry', price: 4.75, image: pastryImage, description: 'A flaky, all-butter pastry baked in small batches each morning.' },
  { id: 5, name: 'Country Sourdough', category: 'Bread', price: 7.25, image: breadImage, description: 'Slow-fermented sourdough with a caramelized crust and open crumb.' },
  { id: 6, name: 'Origen Breakfast', category: 'Breakfast', price: 12, image: breakfastImage, description: 'Seasonal eggs, sourdough, greens, and house-roasted coffee.' }
];

export const categories = [
  { name: 'Espresso', description: 'Concentrated, expressive, and carefully dialed in.' },
  { name: 'Filter coffee', description: 'Clear, nuanced cups brewed to reveal their origin.' },
  { name: 'Milk drinks', description: 'Silky classics and thoughtful seasonal combinations.' },
  { name: 'Cold coffee', description: 'Slow-steeped and refreshing drinks for warm afternoons.' },
  { name: 'Breakfast', description: 'Simple, nourishing plates made with local ingredients.' },
  { name: 'Bakery', description: 'Bread, pastries, and cakes baked fresh every day.' }
];

export function filterProducts(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter(({ name, category, description }) =>
    [name, category, description].some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
  );
}
