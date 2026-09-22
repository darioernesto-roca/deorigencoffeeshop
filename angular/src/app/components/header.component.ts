import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="shell header-inner">
        <a class="brand" routerLink="/" aria-label="De Origen home" (click)="closeMenu()">
          <span class="brand-mark" aria-hidden="true">D</span>
          <span><strong>DE ORIGEN</strong><small>COFFEE ROASTERS</small></span>
        </a>
        <button class="menu-button" type="button" [attr.aria-expanded]="menuOpen()" aria-controls="primary-navigation" (click)="toggleMenu()">
          <span class="sr-only">Toggle navigation</span><span aria-hidden="true">{{ menuOpen() ? 'Close' : 'Menu' }}</span>
        </button>
        <nav id="primary-navigation" class="navigation" [class.is-open]="menuOpen()" aria-label="Primary navigation">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }" (click)="closeMenu()">{{ item.label }}</a>
          }
        </nav>
        <a class="button button-small header-cta" routerLink="/contact">Find the shop</a>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly menuOpen = signal(false);
  protected readonly navigation = [
    { path: '/', label: 'Home' },
    { path: '/categories', label: 'Menu' },
    { path: '/about', label: 'Our story' },
    { path: '/contact', label: 'Visit us' }
  ] as const;

  protected toggleMenu(): void { this.menuOpen.update((open) => !open); }
  protected closeMenu(): void { this.menuOpen.set(false); }
}
