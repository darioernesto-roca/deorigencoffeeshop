import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container shell">
        <Link href="/" className="logo" aria-label="De Origen Coffee Shop home">
          De Origen Coffee Shop
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
