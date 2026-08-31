import { Link } from 'react-router-dom';
import { allPaperMarkers, getNote } from '../lib/content';
import { paperById } from '../data/papers';
import { MARKER_META, type MarkerKind } from '../lib/markers';
import Prose from '../components/Prose';

const SECTIONS: { kind: MarkerKind; blurb: string }[] = [
  { kind: 'D', blurb: 'What I take to follow from what I have read.' },
  { kind: 'H', blurb: 'Guesses I am currently willing to defend.' },
  { kind: 'Q', blurb: 'Still open. These decide what gets read next.' },
  { kind: 'A', blurb: 'Where I disagree with a paper, or where two papers disagree.' },
];

/**
 * The synthesis note plus everything I marked while reading, pulled out of the
 * papers automatically. Nothing here is written twice: the markers live in the
 * notes.
 */
export default function SynthesisView() {
  const note = getNote('synthesis');
  const markers = allPaperMarkers();

  return (
    <article className="doc">
      <header className="doc__head">
        <p className="eyebrow">Current world model</p>
        <h1 className="page-title">Synthesis</h1>
        <p className="lead" style={{ marginTop: '0.8rem' }}>
          Deductions, hypotheses, open questions and tensions, collected from
          the reading notes as they were written.
        </p>
      </header>

      <aside className="paper__rail" aria-label="Sections">
        <div className="rail__head">Collected</div>
        {SECTIONS.map((s) => (
          <a key={s.kind} className="rail__item" href={`#sec-${s.kind}`}>
            {MARKER_META[s.kind].label}
            <span className="rail__count">
              {markers.filter((m) => m.marker.kind === s.kind).length}
            </span>
          </a>
        ))}
      </aside>

      <div>
        {note && <Prose html={note.html} />}

        {SECTIONS.map((s) => {
          const items = markers.filter((m) => m.marker.kind === s.kind);
          if (items.length === 0) return null;
          return (
            <section key={s.kind} id={`sec-${s.kind}`} style={{ marginTop: '2.6rem' }}>
              <hr className="rule" />
              <p className="eyebrow">{MARKER_META[s.kind].label}</p>
              <p className="lead" style={{ fontSize: '0.95rem' }}>{s.blurb}</p>
              <div className="prose">
                {items.map(({ marker, slug, path }) => (
                  <aside
                    key={marker.id + slug}
                    className={`marker marker--${marker.kind.toLowerCase()}`}
                  >
                    <span className="marker__label">
                      <Link to={path}>
                        {paperById[slug]?.shortTitle ?? slug}
                      </Link>
                    </span>
                    <div className="marker__body">
                      <p>{marker.text}</p>
                    </div>
                  </aside>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
