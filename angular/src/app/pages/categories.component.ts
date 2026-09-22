import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PageHeroComponent } from '../components/page-hero.component';
import { ProductCardComponent } from '../components/product-card.component';
import { categories, filterProducts } from '../data/catalog';

@Component({
  selector: 'app-categories',
  imports: [PageHeroComponent, ProductCardComponent],
  template: `
    <app-page-hero eyebrow="Eat & drink" title="A menu guided by season and origin.">Our drinks and dishes are simple by design, allowing excellent ingredients to speak for themselves.</app-page-hero>
    <section class="section category-section" aria-labelledby="category-heading"><div class="shell"><h2 id="category-heading" class="sr-only">Menu categories</h2><div class="category-grid">@for (category of categories; track category.name; let index = $index) { <article class="category-card"><span>0{{ index + 1 }}</span><h3>{{ category.name }}</h3><p>{{ category.description }}</p></article> }</div></div></section>
    <section class="section menu-section" aria-labelledby="menu-heading"><div class="shell section-heading menu-heading"><div><p class="eyebrow">Today at De Origen</p><h2 id="menu-heading">Explore the menu</h2></div><label class="search-field"><span class="sr-only">Search the menu</span><span aria-hidden="true">⌕</span><input type="search" [value]="query()" (input)="updateQuery($event)" placeholder="Search drinks and food"></label></div><div class="shell product-grid">@for (product of visibleProducts(); track product.id) { <app-product-card [product]="product" /> }</div>@if (visibleProducts().length === 0) { <p class="empty-state" role="status">No menu items match “{{ query() }}”. Try another search.</p> }</section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
  protected readonly categories = categories;
  protected readonly query = signal('');
  protected readonly visibleProducts = computed(() => filterProducts(this.query()));
  protected updateQuery(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
}
