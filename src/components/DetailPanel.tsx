import { useEffect } from 'react';
import type { Paper } from '../data/papers';

const TIER_LABEL = ['Queued', 'Tier I', 'Tier II', 'Tier III'] as const;

type Props = {
  paper: Paper | null;
  onClose: () => void;
};

/** A blank-field placeholder so empty content reads as "to fill" not "broken". */
function Empty({ children }: { children: string }) {
  return <p className="panel__placeholder">{children}</p>;
}

/**
 * Slide-in "page" for a paper. No router in v1 — this panel IS the page.
 * Renders every data field so the structure is visible even while empty.
 */
export default function DetailPanel({ paper, onClose }: Props) {
  // Esc closes.
  useEffect(() => {
    if (!paper) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paper, onClose]);

  const open = !!paper;

  return (
    <aside className={`panel ${open ? 'panel--open' : ''}`} aria-hidden={!open}>
      {paper && (
        <div className="panel__inner">
          <header className="panel__head">
            <div className="panel__tags">
              <span className="chip chip--pillar">{paper.pillar}</span>
              <span className="chip">{TIER_LABEL[paper.tier]}</span>
              <span className={`chip ${paper.read ? 'chip--read' : 'chip--queued'}`}>
                {paper.read ? 'read' : 'queued'}
              </span>
            </div>
            <button className="panel__close" onClick={onClose} aria-label="Close panel">
              ×
            </button>
          </header>

          <h2 className="panel__title">{paper.title}</h2>
          <p className="panel__meta">
            {paper.authors} · {paper.year}
          </p>

          <section className="panel__section">
            <h3>Synthesis</h3>
            {paper.synthesis ? (
              <p className="panel__body">{paper.synthesis}</p>
            ) : (
              <Empty>No synthesis written yet.</Empty>
            )}
          </section>

          <section className="panel__section">
            <h3>Surprises</h3>
            {paper.surprises.length > 0 ? (
              <ul className="panel__list">
                {paper.surprises.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <Empty>Nothing logged yet.</Empty>
            )}
          </section>

          <section className="panel__section">
            <h3>Code / experiment</h3>
            {paper.code ? (
              <a className="panel__link" href={paper.code} target="_blank" rel="noreferrer">
                {paper.code}
              </a>
            ) : (
              <Empty>No experiment linked yet.</Empty>
            )}
          </section>

          <section className="panel__section">
            <h3>Open threads</h3>
            {paper.openThreads.length > 0 ? (
              <ul className="panel__list">
                {paper.openThreads.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <Empty>Nothing logged yet.</Empty>
            )}
          </section>
        </div>
      )}
    </aside>
  );
}
