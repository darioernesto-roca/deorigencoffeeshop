export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={`${product.name}, served at De Origen`} className="product-image" loading="lazy" />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-content">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <span>${product.price.toFixed(2)}</span>
        </div>
        <p>{product.description}</p>
      </div>
    </article>
  );
}
