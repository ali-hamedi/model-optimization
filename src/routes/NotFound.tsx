import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Nothing filed here.</h1>
      <p className="lead">
        This page is not part of the map. <Link to="/">Return to the map</Link>.
      </p>
    </div>
  );
}
