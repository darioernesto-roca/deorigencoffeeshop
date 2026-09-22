import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../components/product-card.component';
import { products } from '../data/catalog';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  template: `
    <section class="home-hero">
      <video autoplay muted loop playsinline [poster]="products[0].image" aria-hidden="true"><source src="/assets/vids/hero-vid-1.mp4" type="video/mp4"></video><div class="hero-shade"></div>
      <div class="shell hero-content"><p class="eyebrow light">Roasted with purpose · Served with heart</p><h1>Great coffee begins<br>at the origin.</h1><p>Traceable Colombian coffee, seasonal food, and a warm place to slow down.</p><div class="button-row"><a class="button" routerLink="/categories">Explore our menu</a><a class="text-link light-link" routerLink="/about">Meet De Origen <span aria-hidden="true">→</span></a></div></div>
      <a class="scroll-cue" href="#featured">Scroll to discover <span aria-hidden="true">↓</span></a>
    </section>
    <section class="manifesto section"><div class="shell manifesto-grid"><p class="eyebrow">Our philosophy</p><div><h2>From the hands that grow it<br>to the people who enjoy it.</h2><p>We work with independent producers, roast in thoughtful batches, and prepare every cup to express where it came from. Nothing rushed. Nothing hidden.</p><a class="text-link" routerLink="/about">Learn about our approach <span aria-hidden="true">→</span></a></div></div></section>
    <section id="featured" class="section featured-section"><div class="shell section-heading"><div><p class="eyebrow">From our kitchen</p><h2>Current favorites</h2></div><a class="text-link" routerLink="/categories">See the full menu <span aria-hidden="true">→</span></a></div><div class="shell product-grid">@for (product of featuredProducts; track product.id) { <app-product-card [product]="product" /> }</div></section>
    <section class="visit-banner"><div class="shell visit-content"><div><p class="eyebrow light">Come say hello</p><h2>Your daily ritual,<br>made better.</h2></div><div><p>Pull up a chair, watch the roastery at work, and discover a new favorite.</p><a class="button button-cream" routerLink="/contact">Plan your visit</a></div></div></section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly products = products;
  protected readonly featuredProducts = products.slice(0, 3);
}
