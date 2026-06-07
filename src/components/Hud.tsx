/** Fixed overlay chrome: title block, legend, and control hint. */
export default function Hud() {
  return (
    <>
      <header className="hud hud--title">
        <p className="eyebrow">THE TRENCH · NEURAL FOLD</p>
        <h1 className="hud__h1">
          Compression as a probe of <em>computation</em>
        </h1>
        <p className="hud__question">
          Which parts of trained neural networks carry the computation, and why
          does removing parts sometimes help and sometimes hurt?
        </p>
      </header>

      <div className="hud hud--legend">
        <div className="legend__row">
          <span className="legend__dot legend__dot--read" />
          read
          <span className="legend__dot legend__dot--queued" />
          queued
        </div>
        <div className="legend__row legend__row--tiers">
          <span className="legend__tier legend__tier--s" />
          <span className="legend__tier legend__tier--m" />
          <span className="legend__tier legend__tier--l" />
          <span className="legend__tier-label">tier — small to large</span>
        </div>
      </div>

      <div className="hud hud--hint">
        drag to orbit · scroll to zoom · click a node
      </div>
    </>
  );
}
