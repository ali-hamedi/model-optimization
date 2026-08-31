import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE } from '../lib/content';

/**
 * Renders note HTML. Wiki-links that resolved to a page on this site are
 * handed to the router so the reading position is kept, and wide tables get a
 * scroll container so the reading column never breaks.
 */
export default function Prose({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-scroll')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll';
      table.replaceWith(wrap);
      wrap.appendChild(table);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose"
      onClick={(e) => {
        const anchor = (e.target as HTMLElement).closest('a[data-internal]');
        if (!anchor) return;
        const href = anchor.getAttribute('href') ?? '';
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(href.startsWith(BASE) ? href.slice(BASE.length) || '/' : href);
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
