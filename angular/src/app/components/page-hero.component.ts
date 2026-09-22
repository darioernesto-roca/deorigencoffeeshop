import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  template: `<section class="page-hero"><div class="shell narrow"><p class="eyebrow">{{ eyebrow() }}</p><h1>{{ title() }}</h1><p class="page-intro"><ng-content /></p></div></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeroComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
}
