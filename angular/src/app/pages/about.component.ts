import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeroComponent } from '../components/page-hero.component';

@Component({
  selector: 'app-about',
  imports: [PageHeroComponent],
  template: `
    <app-page-hero eyebrow="Our story" title="Coffee is personal. We keep it that way.">De Origen exists to shorten the distance between the people who cultivate exceptional coffee and the people who drink it.</app-page-hero>
    <section class="section story-section"><div class="shell story-grid"><div class="story-image"><img src="/assets/img/products/img-7.jpg" alt="Coffee cherries being carefully selected"></div><div class="story-copy"><p class="eyebrow">Rooted in Colombia</p><h2>Built around relationships, not transactions.</h2><p>We started with a simple belief: when producers are known, valued, and paid fairly, coffee becomes better for everyone. Our menu celebrates the character of each harvest rather than chasing uniformity.</p><p>That same care shapes our café—from the ingredients we source to the welcome you receive at the door.</p></div></div></section>
    <section class="values section"><div class="shell"><p class="eyebrow">What guides us</p><h2>Our everyday commitments</h2><div class="value-grid"><article><span>01</span><h3>Know the source</h3><p>We choose transparent supply chains and long-term producer relationships.</p></article><article><span>02</span><h3>Waste less</h3><p>We buy intentionally, reuse thoughtfully, and improve our practices continuously.</p></article><article><span>03</span><h3>Welcome everyone</h3><p>Good hospitality is generous, attentive, accessible, and free from pretension.</p></article></div></div></section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}
