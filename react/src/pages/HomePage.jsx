import { ProductCard } from '../components/ProductCard';
import { RouterLink } from '../components/RouterLink';
import { products } from '../data/catalog';

const heroVideo = new URL('../../../html/vids/hero-vid-1.mp4', import.meta.url).href;

export function HomePage({ onNavigate }) {
  return (
    <>
      <section className="home-hero">
        <video autoPlay muted loop playsInline poster={products[0].image} aria-hidden="true">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p className="eyebrow light">Roasted with purpose · Served with heart</p>
          <h1>Great coffee begins<br />at the origin.</h1>
          <p>Traceable Colombian coffee, seasonal food, and a warm place to slow down.</p>
          <div className="button-row">
            <RouterLink className="button" href="/categories" onNavigate={onNavigate}>Explore our menu</RouterLink>
            <RouterLink className="text-link light-link" href="/about" onNavigate={onNavigate}>Meet De Origen <span aria-hidden="true">→</span></RouterLink>
          </div>
        </div>
        <a className="scroll-cue" href="#featured">Scroll to discover <span aria-hidden="true">↓</span></a>
      </section>

      <section className="manifesto section">
        <div className="shell manifesto-grid">
          <p className="eyebrow">Our philosophy</p>
          <div>
            <h2>From the hands that grow it<br />to the people who enjoy it.</h2>
            <p>We work with independent producers, roast in thoughtful batches, and prepare every cup to express where it came from. Nothing rushed. Nothing hidden.</p>
            <RouterLink className="text-link" href="/about" onNavigate={onNavigate}>Learn about our approach <span aria-hidden="true">→</span></RouterLink>
          </div>
        </div>
      </section>

      <section id="featured" className="section featured-section">
        <div className="shell section-heading">
          <div><p className="eyebrow">From our kitchen</p><h2>Current favorites</h2></div>
          <RouterLink className="text-link" href="/categories" onNavigate={onNavigate}>See the full menu <span aria-hidden="true">→</span></RouterLink>
        </div>
        <div className="shell product-grid">
          {products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="visit-banner">
        <div className="shell visit-content">
          <div><p className="eyebrow light">Come say hello</p><h2>Your daily ritual,<br />made better.</h2></div>
          <div><p>Pull up a chair, watch the roastery at work, and discover a new favorite.</p><RouterLink className="button button-cream" href="/contact" onNavigate={onNavigate}>Plan your visit</RouterLink></div>
        </div>
      </section>
    </>
  );
}
