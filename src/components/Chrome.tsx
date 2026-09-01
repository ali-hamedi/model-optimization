import { useEffect, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

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
