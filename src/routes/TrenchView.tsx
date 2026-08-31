import { Link } from 'react-router-dom';
import { LENSES } from '../data/lenses';
import { PAPERS } from '../data/papers';
import { getNote } from '../lib/content';
import Prose from '../components/Prose';

export default function TrenchView() {
  const note = getNote('trench');
  const notation = getNote('notation');

  return (
    <article className="doc">
      <header className="doc__head">
        <p className="eyebrow">The question</p>
        <h1 className="page-title" style={{ maxWidth: '22ch' }}>
          How does an overparameterized neural network discover and represent
          the efficient computation that generalizes?
        </h1>
        <p className="lead" style={{ marginTop: '1.1rem' }}>
          Four lenses on one phenomenon. Compression is the probe carried across
          all of them; generalization is the thing being probed, not a fifth
          lens.
        </p>
      </header>

      <aside className="paper__rail" aria-label="Lenses">
        <div className="rail__head">Lenses</div>
        {LENSES.map((l) => {
          const count = PAPERS.filter(
            (p) => p.primaryLens === l.id || p.secondaryLenses.includes(l.id),
          ).length;
          return (
            <Link key={l.id} className={`rail__item lens--${l.id}`} to={`/?lens=${l.id}`}>
              <i className="lens-dot" />
              {l.title}
              <span className="rail__count">{count}</span>
              <br />
              <span className="rail__verb" style={{ paddingLeft: '1rem' }}>
                {l.question}
              </span>
            </Link>
          );
        })}
        {notation && (
          <div>
            <div className="rail__head">Notation</div>
            <a className="rail__item" href="#notation">
              How I mark up a read
            </a>
          </div>
        )}
      </aside>

      <div>
        {note && <Prose html={note.html} />}
        {notation && (
          <section id="notation" style={{ marginTop: '3rem' }}>
            <hr className="rule" />
            <p className="eyebrow">Notation</p>
            <Prose html={notation.html} />
          </section>
        )}
      </div>
    </article>
  );
}
