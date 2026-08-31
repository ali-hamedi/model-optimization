import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chrome from './components/Chrome';
import MapView from './routes/MapView';
import NotFound from './routes/NotFound';

/**
 * The map is the landing experience, so it ships on its own. Everything that
 * renders markdown (and therefore pulls in KaTeX and the notes) is split off.
 */
const PaperView = lazy(() => import('./routes/PaperView'));
const NoteView = lazy(() => import('./routes/NoteView'));
const TrenchView = lazy(() => import('./routes/TrenchView'));
const SynthesisView = lazy(() => import('./routes/SynthesisView'));
const HistoryView = lazy(() => import('./routes/HistoryView'));

function Loading() {
  return (
    <div className="wrap">
      <p className="eyebrow">Loading note…</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Chrome>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/papers/:id" element={<PaperView />} />
            <Route path="/notes/:slug" element={<NoteView />} />
            <Route path="/trench" element={<TrenchView />} />
            <Route path="/synthesis" element={<SynthesisView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Chrome>
    </BrowserRouter>
  );
}
