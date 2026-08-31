import { Link, useParams } from 'react-router-dom';
import { getNote, noteBySlug } from '../lib/content';
import Prose from '../components/Prose';
import MarkerIndex from '../components/MarkerIndex';
import NotFound from './NotFound';

/** Notes that are not papers on the map: foundations, queued reads, terminology. */
export default function NoteView() {
  const { slug = '' } = useParams();
  const file = noteBySlug[slug];
  const note = getNote(slug);
  if (!file || !note) return <NotFound />;

  return (
    <article className="doc">
      <header className="doc__head">
        <Link className="paper__back" to="/">
          ← Back to the map
        </Link>
        <p className="eyebrow" style={{ marginTop: '0.9rem' }}>
          {file.group === 'foundations' ? 'Foundations' : 'Note'}
        </p>
      </header>
      <aside className="paper__rail" aria-label="Note apparatus">
        <MarkerIndex markers={note.markers} />
      </aside>
      <Prose html={note.html} />
    </article>
  );
}
