import { RouterLink } from '../components/RouterLink';

export function NotFoundPage({ onNavigate }) {
  return <section className="not-found shell"><p className="eyebrow">404 · Page not found</p><h1>This path has gone cold.</h1><p>The page you requested does not exist in this React demonstration.</p><RouterLink className="button button-dark" href="/" onNavigate={onNavigate}>Return home</RouterLink></section>;
}
