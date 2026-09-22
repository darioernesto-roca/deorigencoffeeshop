import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div><p class="footer-brand">DE ORIGEN</p><p class="footer-copy">Coffee with a sense of place, roasted and served with care.</p></div>
        <div><h2>Explore</h2><a routerLink="/categories">Our menu</a><a routerLink="/about">Our story</a><a routerLink="/contact">Visit us</a></div>
        <div><h2>Opening hours</h2><p>Monday–Friday · 7:00–19:00</p><p>Saturday–Sunday · 8:00–18:00</p></div>
        <div><h2>Stay in touch</h2><a href="mailto:hello@deorigen.example">hello&#64;deorigen.example</a><a href="tel:+573004277281">+57 300 427 7281</a></div>
      </div>
      <div class="shell footer-base"><p>© {{ year }} De Origen Coffee Shop.</p><p>Made thoughtfully in Colombia.</p></div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent { protected readonly year = new Date().getFullYear(); }
