import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PageHeroComponent } from '../components/page-hero.component';

interface ContactFormModel {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
}

function emptyContactForm(): ContactFormModel {
  return { name: '', email: '', phone: '', topic: '', message: '', consent: false };
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule, PageHeroComponent],
  template: `
    <app-page-hero eyebrow="Visit & contact" title="There is always a seat for you.">Drop in for a cup, stay for breakfast, or send us a note before your visit.</app-page-hero>
    <section class="section contact-section"><div class="shell contact-grid">
      <div class="contact-details"><p class="eyebrow">Find us</p><h2>De Origen Coffee Shop</h2><address>Carrera 7 #72–41<br>Bogotá, Colombia</address><a href="tel:+573004277281">+57 300 427 7281</a><a href="mailto:hello@deorigen.example">hello&#64;deorigen.example</a><hr><h3>Opening hours</h3><p>Monday–Friday · 7:00–19:00<br>Saturday–Sunday · 8:00–18:00</p></div>
      <div class="form-panel"><p class="eyebrow">Send a message</p><h2>How can we help?</h2>
        @if (submitted()) { <p class="success-message" role="status">Thank you. Your message has been prepared for our team. This demonstration does not send data to a server.</p> }
        <form #contactForm="ngForm" (ngSubmit)="submit(contactForm)" class="contact-form">
          <div class="form-row"><label>Full name<input name="name" [(ngModel)]="model.name" autocomplete="name" required></label><label>Email address<input type="email" name="email" [(ngModel)]="model.email" autocomplete="email" required email></label></div>
          <div class="form-row"><label>Phone <span>(optional)</span><input type="tel" name="phone" [(ngModel)]="model.phone" autocomplete="tel"></label><label>Topic<select name="topic" [(ngModel)]="model.topic" required><option value="">Choose a topic</option><option>General question</option><option>Private events</option><option>Wholesale coffee</option><option>Feedback</option></select></label></div>
          <label>Message<textarea name="message" [(ngModel)]="model.message" rows="6" maxlength="1000" required></textarea></label>
          <label class="checkbox-label"><input type="checkbox" name="consent" [(ngModel)]="model.consent" required><span>I agree that De Origen may use these details to respond to my request.</span></label>
          <button class="button button-dark" type="submit" [disabled]="contactForm.invalid">Send message</button>
        </form>
      </div>
    </div></section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  protected model = emptyContactForm();
  protected readonly submitted = signal(false);

  protected submit(form: NgForm): void {
    if (form.invalid) return;
    this.submitted.set(true);
    this.model = emptyContactForm();
    form.resetForm(this.model);
  }
}
