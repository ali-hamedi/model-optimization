import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Map', end: true },
  { to: '/trench', label: 'Trench' },
  { to: '/synthesis', label: 'Synthesis' },
  { to: '/history', label: 'World model' },
];

type Theme = 'light' | 'dark';

function initialTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Site chrome: a rule, four words, and a light/dark switch. Nothing else. */
export default function Chrome({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return initialTheme();
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* private mode — the choice just doesn't persist */
    }
  }, [theme]);

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
          Compression as a probe <span>/ A. Hamedi</span>
        </NavLink>
        <nav className="topbar__nav" aria-label="Sections">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="navlink">
              {n.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </button>
        </nav>
      </header>
      <main className="page" id="main">
        {children}
      </main>
      <footer className="sitefoot">
        <span>Literature map · reading notes · working document</span>
        <span>Notes are written in Obsidian and rendered verbatim.</span>
      </footer>
    </div>
  );
}
