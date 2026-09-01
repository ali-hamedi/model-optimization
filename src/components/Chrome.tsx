import { useEffect, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Map', end: true },
  { to: '/trench', label: 'Trench' },
  { to: '/synthesis', label: 'Synthesis' },
  { to: '/history', label: 'World model' },
];

export default function Chrome({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <NavLink to="/" className="topbar__mark">
          Compression as a Lens <span>/ Ali Hamedi</span>
        </NavLink>
        <nav className="topbar__nav" aria-label="Sections">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="navlink">
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page" id="main">
        {children}
      </main>
      <footer className="sitefoot">
        <span>Ali Hamedi</span>
        <a href="https://github.com/ali-hamedi/model-optimization">Source</a>
      </footer>
    </div>
  );
}
