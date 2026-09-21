import { RouterLink } from './RouterLink';

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">DE ORIGEN</p>
          <p className="footer-copy">Coffee with a sense of place, roasted and served with care.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <RouterLink href="/categories" onNavigate={onNavigate}>Our menu</RouterLink>
          <RouterLink href="/about" onNavigate={onNavigate}>Our story</RouterLink>
          <RouterLink href="/contact" onNavigate={onNavigate}>Visit us</RouterLink>
        </div>
        <div>
          <h2>Opening hours</h2>
          <p>Monday–Friday · 7:00–19:00</p>
          <p>Saturday–Sunday · 8:00–18:00</p>
        </div>
        <div>
          <h2>Stay in touch</h2>
          <a href="mailto:hello@deorigen.example">hello@deorigen.example</a>
          <a href="tel:+573004277281">+57 300 427 7281</a>
        </div>
      </div>
      <div className="shell footer-base">
        <p>© {new Date().getFullYear()} De Origen Coffee Shop.</p>
        <p>Made thoughtfully in Colombia.</p>
      </div>
    </footer>
  );
}
