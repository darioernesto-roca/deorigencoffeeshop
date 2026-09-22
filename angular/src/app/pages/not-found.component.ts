import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `<section class="not-found shell"><p class="eyebrow">404 · Page not found</p><h1>This path has gone cold.</h1><p>The page you requested does not exist in this Angular implementation.</p><a class="button button-dark" routerLink="/">Return home</a></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
