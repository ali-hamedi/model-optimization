import { getNote } from '../lib/content';
import Prose from '../components/Prose';

/**
 * The world-model history, read as a timeline: V0 and then one Δ per paper
 * that moved the question.
 */
export default function HistoryView() {
  const note = getNote('history');
  const steps = (note?.headings ?? []).filter((h) => h.depth <= 2);

  return (
    <article className="doc timeline">
      <header className="doc__head">
        <p className="eyebrow">How the question changed</p>
        <h1 className="page-title">World-model history</h1>
        <p className="lead" style={{ marginTop: '0.8rem' }}>
          Not a reading log. Each Δ is a place where a paper forced the trench
          question itself to move.
        </p>
      </header>

      <aside className="paper__rail" aria-label="Timeline">
        <div className="rail__head">Deltas</div>
        {steps.map((h) => (
          <a key={h.id} className="rail__item" href={`#${h.id}`}>
            {h.text}
          </a>
        ))}
      </aside>

      {note && <Prose html={note.html} />}
    </article>
  );
}
