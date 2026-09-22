import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../data/catalog';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  template: `
    <article class="product-card">
      <div class="product-image-wrap"><img [src]="product().image" [alt]="product().name + ', served at De Origen'" class="product-image" loading="lazy"><span class="product-category">{{ product().category }}</span></div>
      <div class="product-content"><div class="product-title-row"><h3>{{ product().name }}</h3><span>{{ product().price | currency:'USD' }}</span></div><p>{{ product().description }}</p></div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent { readonly product = input.required<Product>(); }
