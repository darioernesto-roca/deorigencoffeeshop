import { useState } from 'react';
import { PageHero } from '../components/PageHero';

const initialForm = { name: '', email: '', phone: '', topic: '', message: '', consent: false };

export function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <>
      <PageHero eyebrow="Visit & contact" title="There is always a seat for you.">Drop in for a cup, stay for breakfast, or send us a note before your visit.</PageHero>
      <section className="section contact-section">
        <div className="shell contact-grid">
          <div className="contact-details">
            <p className="eyebrow">Find us</p><h2>De Origen Coffee Shop</h2>
            <address>Carrera 7 #72–41<br />Bogotá, Colombia</address>
            <a href="tel:+573004277281">+57 300 427 7281</a><a href="mailto:hello@deorigen.example">hello@deorigen.example</a>
            <hr />
            <h3>Opening hours</h3><p>Monday–Friday · 7:00–19:00<br />Saturday–Sunday · 8:00–18:00</p>
          </div>
          <div className="form-panel">
            <p className="eyebrow">Send a message</p><h2>How can we help?</h2>
            {submitted && <p className="success-message" role="status">Thank you. Your message has been prepared for our team. This demonstration does not send data to a server.</p>}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row"><label>Full name<input name="name" value={form.name} onChange={updateField} autoComplete="name" required /></label><label>Email address<input type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" required /></label></div>
              <div className="form-row"><label>Phone <span>(optional)</span><input type="tel" name="phone" value={form.phone} onChange={updateField} autoComplete="tel" /></label><label>Topic<select name="topic" value={form.topic} onChange={updateField} required><option value="">Choose a topic</option><option>General question</option><option>Private events</option><option>Wholesale coffee</option><option>Feedback</option></select></label></div>
              <label>Message<textarea name="message" value={form.message} onChange={updateField} rows="6" maxLength="1000" required /></label>
              <label className="checkbox-label"><input type="checkbox" name="consent" checked={form.consent} onChange={updateField} required /><span>I agree that De Origen may use these details to respond to my request.</span></label>
              <button className="button button-dark" type="submit">Send message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
