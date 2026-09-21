export function PageHero({ eyebrow, title, children }) {
  return (
    <section className="page-hero">
      <div className="shell narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children && <p className="page-intro">{children}</p>}
      </div>
    </section>
  );
}
