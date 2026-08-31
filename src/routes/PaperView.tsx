import { Link, useParams } from 'react-router-dom';
import { paperById } from '../data/papers';
import { relationsFor } from '../data/relations';
import {
  lensById,
  RELATION_LABEL,
  RELATION_LABEL_INVERSE,
  ROLE_LABEL,
} from '../data/lenses';
import { getNote } from '../lib/content';
import Prose from '../components/Prose';
import MarkerIndex from '../components/MarkerIndex';
import NotFound from './NotFound';

const letters = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function dropRepeatedTitle(html: string, title: string): string {
  return html.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/, (whole, inner: string) => {
    const text = letters(inner.replace(/<[^>]+>/g, ''));
    const want = letters(title);
    return text && (want.startsWith(text) || text.startsWith(want)) ? '' : whole;
  });
}

export default function PaperView() {
  const { id = '' } = useParams();
  const paper = paperById[id];
  if (!paper) return <NotFound />;

  const note = getNote(paper.note);
  const relations = relationsFor(paper.id);
  // The note opens with its own title; the page header already carries it.
  const html = note ? dropRepeatedTitle(note.html, paper.title) : '';

  return (
    <article
      className="paper"
      style={
        { '--accent': `var(--lens-${paper.primaryLens})` } as React.CSSProperties
      }
    >
      <header className="paper__head">
        <Link className="paper__back" to={`/?p=${paper.id}`}>
          ← Back to the map
        </Link>
        <h1 className="paper__title">{paper.title}</h1>
        <p className="paper__byline">
          {paper.authors} · {paper.year}
          {paper.venue ? ` · ${paper.venue}` : ''}
        </p>
        <div className="paper__facts">
          <span className={`lens--${paper.primaryLens}`}>
            <i className="lens-dot" />
            <b>{lensById[paper.primaryLens].title}</b>
            {paper.secondaryLenses.map((l) => ` + ${lensById[l].title}`).join('')}
          </span>
          <span>
            Role <b>{paper.roles.map((r) => ROLE_LABEL[r]).join(' / ')}</b>
          </span>
          {paper.provisional && <span>Reading note in progress</span>}
        </div>
        <p className="paper__trench">{paper.trenchRelation}</p>
      </header>

      <aside className="paper__rail" aria-label="Note apparatus">
        <div>
          <div className="rail__head">In the map</div>
          {relations.map((r) => {
            const outgoing = r.source === paper.id;
            const otherId = outgoing ? r.target : r.source;
            return (
              <Link
                key={`${r.source}-${r.target}-${r.type}`}
                className="rail__item"
                to={`/papers/${otherId}`}
              >
                <span className="rail__verb">
                  {outgoing ? RELATION_LABEL[r.type] : RELATION_LABEL_INVERSE[r.type]}
                </span>
                <br />
                {paperById[otherId].shortTitle}
              </Link>
            );
          })}
        </div>
        {note && <MarkerIndex markers={note.markers} />}
      </aside>

      {note ? (
        <Prose html={html} />
      ) : (
        <div className="prose">
          <p>The reading note for this paper has not been written yet.</p>
        </div>
      )}
    </article>
  );
}
