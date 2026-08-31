import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Map', end: true },
  { to: '/trench', label: 'Trench' },
  { to: '/synthesis', label: 'Synthesis' },
  { to: '/history', label: 'World model' },
];

type Theme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** What the reader explicitly picked, if anything. */
function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  try {
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path
        strokeLinecap="round"
        d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path
        strokeLinejoin="round"
        d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z"
      />
    </svg>
  );
}

/** Site chrome: a rule, four words, and a light/dark switch. Nothing else. */
export default function Chrome({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // null means "whatever the system says" — the toggle is what pins it.
  const [choice, setChoice] = useState<Theme | null>(() => storedTheme());
  const [system, setSystem] = useState<Theme>(() => systemTheme());
  const theme = choice ?? system;

  // Follow the OS while the reader has not picked a side.
  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (choice) document.documentElement.dataset.theme = choice;
    else delete document.documentElement.dataset.theme;
    try {
      if (choice) localStorage.setItem('theme', choice);
      else localStorage.removeItem('theme');
    } catch {
      /* private mode — the choice just doesn't persist */
    }
  }, [choice]);

  // Shift-click clears the override and hands the site back to the OS.
  const toggle = useCallback(
    (e: React.MouseEvent) => {
      if (e.shiftKey) setChoice(null);
      else setChoice(theme === 'dark' ? 'light' : 'dark');
    },
    [theme],
  );

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
          Compression as a probe <span>/ Ali Hamedi</span>
        </NavLink>
        <nav className="topbar__nav" aria-label="Sections">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="navlink">
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={
            choice
              ? `${theme === 'dark' ? 'Dark' : 'Light'}. Shift-click to follow the system again.`
              : `Following the system (${theme})`
          }
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>
      <main className="page" id="main">
        {children}
      </main>
      <footer className="sitefoot">
        <span>Ali Hamedi</span>
        <span>Reading notes, updated as I go.</span>
        <a href="https://github.com/ali-hamedi/model-optimization">Source</a>
      </footer>
    </div>
  );
}
