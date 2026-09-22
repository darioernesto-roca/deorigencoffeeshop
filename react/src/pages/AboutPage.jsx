import { PageHero } from '../components/PageHero';

const storyImage = new URL('../../../html/img/products/img-7.jpg', import.meta.url).href;

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title="Coffee is personal. We keep it that way.">De Origen exists to shorten the distance between the people who cultivate exceptional coffee and the people who drink it.</PageHero>
      <section className="section story-section">
        <div className="shell story-grid">
          <div className="story-image"><img src={storyImage} alt="Coffee cherries being carefully selected" /></div>
          <div className="story-copy">
            <p className="eyebrow">Rooted in Colombia</p>
            <h2>Built around relationships, not transactions.</h2>
            <p>We started with a simple belief: when producers are known, valued, and paid fairly, coffee becomes better for everyone. Our menu celebrates the character of each harvest rather than chasing uniformity.</p>
            <p>That same care shapes our café—from the ingredients we source to the welcome you receive at the door.</p>
          </div>
        </div>
      </section>
      <section className="values section">
        <div className="shell"><p className="eyebrow">What guides us</p><h2>Our everyday commitments</h2><div className="value-grid">
          <article><span>01</span><h3>Know the source</h3><p>We choose transparent supply chains and long-term producer relationships.</p></article>
          <article><span>02</span><h3>Waste less</h3><p>We buy intentionally, reuse thoughtfully, and improve our practices continuously.</p></article>
          <article><span>03</span><h3>Welcome everyone</h3><p>Good hospitality is generous, attentive, accessible, and free from pretension.</p></article>
        </div></div>
      </section>
    </>
  );
}
