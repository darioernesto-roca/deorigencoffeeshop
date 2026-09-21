import { useState } from 'react';
import { RouterLink } from './RouterLink';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Menu' },
  { href: '/about', label: 'Our story' },
  { href: '/contact', label: 'Visit us' }
];

export function Header({ currentPath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(path) {
    setMenuOpen(false);
    onNavigate(path);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <RouterLink className="brand" href="/" onNavigate={navigate} aria-label="De Origen home">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span><strong>DE ORIGEN</strong><small>COFFEE ROASTERS</small></span>
        </RouterLink>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden="true">{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Primary navigation">
          {navigation.map((item) => (
            <RouterLink key={item.href} href={item.href} onNavigate={navigate} aria-current={currentPath === item.href ? 'page' : undefined}>
              {item.label}
            </RouterLink>
          ))}
        </nav>
        <RouterLink className="button button-small header-cta" href="/contact" onNavigate={navigate}>Find the shop</RouterLink>
      </div>
    </header>
  );
}
