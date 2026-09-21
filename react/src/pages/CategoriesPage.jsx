import { useMemo, useState } from 'react';
import { PageHero } from '../components/PageHero';
import { ProductCard } from '../components/ProductCard';
import { categories, filterProducts } from '../data/catalog';

export function CategoriesPage() {
  const [query, setQuery] = useState('');
  const visibleProducts = useMemo(() => filterProducts(query), [query]);

  return (
    <>
      <PageHero eyebrow="Eat & drink" title="A menu guided by season and origin.">Our drinks and dishes are simple by design, allowing excellent ingredients to speak for themselves.</PageHero>
      <section className="section category-section" aria-labelledby="category-heading">
        <div className="shell">
          <h2 id="category-heading" className="sr-only">Menu categories</h2>
          <div className="category-grid">
            {categories.map((category, index) => <article key={category.name} className="category-card"><span>0{index + 1}</span><h3>{category.name}</h3><p>{category.description}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section menu-section" aria-labelledby="menu-heading">
        <div className="shell section-heading menu-heading">
          <div><p className="eyebrow">Today at De Origen</p><h2 id="menu-heading">Explore the menu</h2></div>
          <label className="search-field"><span className="sr-only">Search the menu</span><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search drinks and food" /></label>
        </div>
        <div className="shell product-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {visibleProducts.length === 0 && <p className="empty-state" role="status">No menu items match “{query}”. Try another search.</p>}
      </section>
    </>
  );
}
