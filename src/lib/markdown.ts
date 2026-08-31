import { Marked, type Tokens } from 'marked';
import katex from 'katex';
import {
  MARKER_META,
  markerKindAt,
  type Marker,
  type MarkerKind,
} from './markers';

/**
 * Obsidian markdown -> HTML.
 *
 * The notes in content/ are the source of truth and stay exactly as they are
 * written in the vault. Everything Obsidian-specific is handled here:
 * wiki-links, embedded images, `~` verbatim paper quotes, #tags, $LaTeX$, and
 * the D/Q/A/C/H/O/PRE/POST research markers.
 */

export interface Heading {
  id: string;
  depth: number;
  text: string;
}

export interface RenderedNote {
  html: string;
  frontmatter: Record<string, string>;
  headings: Heading[];
  markers: Marker[];
  /** Wiki-links that resolved to a route on this site. */
  links: string[];
}

export interface RenderContext {
  /** Absolute URL prefix, e.g. "/model-optimization". */
  base: string;
  /** vault note name (lowercased) -> site path, without base. */
  resolve: (target: string) => string | null;
}

const OPEN = '⟦';
const CLOSE = '⟧';

class Vault {
  private items: string[] = [];
  stash(html: string): string {
    this.items.push(html);
    return `${OPEN}${this.items.length - 1}${CLOSE}`;
  }
  restore(html: string): string {
    let out = html;
    for (let pass = 0; pass < 4; pass++) {
      const next = out.replace(
        new RegExp(`(?:<p>\\s*)?${OPEN}(\\d+)${CLOSE}(?:\\s*</p>)?`, 'g'),
        (_m, i) => this.items[Number(i)] ?? '',
      );
      if (next === out) break;
      out = next;
    }
    return out;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function tex(src: string, display: boolean): string {
  try {
    return katex.renderToString(src, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      output: 'html',
    });
  } catch {
    return `<code class="tex-fail">${escapeHtml(src)}</code>`;
  }
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

/** Heading text is captured after inline parsing, so entities come back escaped. */
function decodeEntities(s: string): string {
  return s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function stripFrontmatter(raw: string): {
  body: string;
  frontmatter: Record<string, string>;
} {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { body: raw, frontmatter: {} };
  const frontmatter: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) frontmatter[kv[1]] = kv[2].trim();
  }
  return { body: raw.slice(m[0].length), frontmatter };
}

/** Everything that must not be touched by the line-level rewrites. */
function protect(text: string, vault: Vault): string {
  let out = text;

  // fenced code
  out = out.replace(/^```[\s\S]*?^```$/gm, (block) =>
    vault.stash(
      `<pre class="code"><code>${escapeHtml(
        block.replace(/^```.*\n?/, '').replace(/```$/, ''),
      )}</code></pre>`,
    ),
  );

  // Display math. A note with an unbalanced `$$` would otherwise swallow the
  // rest of the page, so anything containing a heading or rule is left alone
  // and rendered as ordinary text.
  out = out.replace(/\$\$([\s\S]+?)\$\$/g, (whole, body: string) => {
    // Real display math never contains a blank line or a heading.
    if (
      body.length > 2000 ||
      /\n[\t ]*\n/.test(body) ||
      /^\s*(#{1,6}\s|-{3,}\s*$)/m.test(body)
    ) {
      return whole;
    }
    return vault.stash(`<div class="math-display">${tex(body.trim(), true)}</div>`);
  });

  // inline math (single line, no empty $ pairs)
  out = out.replace(/\$([^$\n]+?)\$/g, (_m, body) =>
    vault.stash(tex(body.trim(), false)),
  );

  // inline code
  out = out.replace(/`([^`\n]+)`/g, (_m, body) =>
    vault.stash(`<code>${escapeHtml(body)}</code>`),
  );

  // raw HTML tags the notes use for colour / centring — keep them verbatim
  out = out.replace(/<\/?[a-zA-Z][^>\n]*>/g, (tag) => vault.stash(tag));

  // Obsidian indents with tabs and shows them as nesting, but a tab counts as
  // four spaces in markdown, which turns indented prose into a code block.
  // Two spaces keeps the nesting and keeps the prose prose.
  out = out.replace(/^\t+/gm, (tabs) => '  '.repeat(tabs.length));

  // Obsidian also starts a list straight under a paragraph, with no blank
  // line. CommonMark would fold it into the paragraph.
  const lines = out.split('\n');
  const isList = (l: string) => /^[\t ]*([-*+]|\d+[.)])[\t ]+\S/.test(l);
  for (let i = lines.length - 1; i > 0; i--) {
    const prev = lines[i - 1];
    if (isList(lines[i]) && prev.trim() && !isList(prev) && !/^\s*[>#|]/.test(prev)) {
      lines.splice(i, 0, '');
    }
  }
  out = lines.join('\n');

  return out;
}

function inlineRewrites(text: string, ctx: RenderContext, links: string[]) {
  let out = text;

  // ![[image.png]] — vault attachments are copied to public/notes/. A figure
  // on its own line is padded with blank lines so it stays its own HTML block
  // and does not swallow the markdown that follows it.
  const figure = (file: string) => {
    const src = `${ctx.base}/notes/${encodeURIComponent(file.trim())}`;
    return `<figure class="note-figure"><img src="${src}" alt="${escapeHtml(
      file.trim(),
    )}" loading="lazy" /></figure>`;
  };
  out = out.replace(
    /^[\t ]*!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\][\t ]*$/gm,
    (_m, file: string) => `\n${figure(file)}\n`,
  );
  out = out.replace(/!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g, (_m, file: string) =>
    figure(file),
  );

  // [[Note#anchor|alias]]
  out = out.replace(
    /\[\[([^\]|#]+?)(#[^\]|]+)?(?:\|([^\]]+))?\]\]/g,
    (_m, target: string, anchor: string | undefined, alias: string | undefined) => {
      const label = escapeHtml((alias ?? target).trim());
      const path = ctx.resolve(target.trim());
      if (!path) return `<span class="wikilink wikilink--unwritten" title="No note yet">${label}</span>`;
      links.push(path);
      const hash = anchor ? `#${slugify(anchor.slice(1))}` : '';
      return `<a class="wikilink" href="${ctx.base}${path}${hash}" data-internal="1">${label}</a>`;
    },
  );

  // #tags, but never a markdown heading and never a CSS colour
  out = out.replace(
    /(^|[\s(])#([A-Za-z][\w/-]*)/gm,
    (_m, pre: string, tag: string) =>
      `${pre}<span class="hashtag">#${escapeHtml(tag)}</span>`,
  );

  return out;
}

function dedent(lines: string[]): string {
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/^[\t ]*/)![0].replace(/\t/g, '    ').length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((l) => l.replace(/\t/g, '    ').slice(min))
    .join('\n')
    .trim();
}

const MARKER_LINE = /^([\t ]*)(PRE|POST|D|Q|A|C|H|O)::[\t ]?(.*)$/;

/** A readable one-liner for rails and the synthesis index. */
function plainPreview(src: string): string {
  return src
    .replace(new RegExp(`${OPEN}\\d+${CLOSE}`, 'g'), '…')
    .replace(/!?\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (_m, t, alias) => alias ?? t)
    .replace(/[*_`>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

/**
 * A marker owns its own line plus every following line indented deeper than it,
 * up to the next marker, heading or rule. Handles both the inline form
 * (`D:: one sentence`) and the block form (`PRE::` then an indented list).
 */
function extractMarkers(
  text: string,
  render: (inner: string) => string,
  vault: Vault,
  markers: Marker[],
): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let i = 0;
  let n = 0;

  while (i < lines.length) {
    const m = MARKER_LINE.exec(lines[i]);
    if (!m) {
      out.push(lines[i]);
      i += 1;
      continue;
    }
    const indent = m[1].replace(/\t/g, '    ').length;
    const kind = m[2] as MarkerKind;
    const body: string[] = m[3].trim() ? [m[3]] : [];
    i += 1;

    // A marker written on its own line, with the answer written flush beneath
    // it (the PRE::/POST:: habit), owns everything up to the next rule,
    // heading or marker. Otherwise it owns only what is indented under it.
    const nextNonBlank = lines.slice(i).find((l) => l.trim()) ?? '';
    const nextIndent = nextNonBlank
      .match(/^[\t ]*/)![0]
      .replace(/\t/g, '    ').length;
    const flush =
      body.length === 0 && Boolean(nextNonBlank) && nextIndent <= indent;

    while (i < lines.length) {
      const line = lines[i];
      const lineIndent = line.match(/^[\t ]*/)![0].replace(/\t/g, '    ').length;

      if (flush) {
        if (/^\s*(---+|\*\*\*+|#{1,6}\s)/.test(line) || markerKindAt(line)) break;
        // a line of nothing but #tags belongs to the note, not to the marker
        if (body.length === 0 && /^\s*(#[A-Za-z][\w/-]*\s*)+$/.test(line)) {
          out.push(line);
          i += 1;
          continue;
        }
        body.push(line);
        i += 1;
        continue;
      }

      if (!line.trim()) {
        // a blank line only ends the block if what follows is not deeper
        const nxt = lines[i + 1] ?? '';
        const nxtIndent = nxt.match(/^[\t ]*/)![0].replace(/\t/g, '    ').length;
        if (!nxt.trim() || nxtIndent <= indent) break;
        body.push('');
        i += 1;
        continue;
      }
      if (lineIndent <= indent || markerKindAt(line)) break;
      body.push(line);
      i += 1;
    }

    const inner = dedent(body);
    const id = `mk-${kind.toLowerCase()}-${n++}`;
    markers.push({
      id,
      kind,
      text: plainPreview(inner),
    });
    const meta = MARKER_META[kind];
    const html =
      `<aside class="marker marker--${kind.toLowerCase()}" id="${id}">` +
      `<span class="marker__tag" aria-hidden="true"><span class="marker__glyph">${meta.glyph}</span>${kind}</span>` +
      `<span class="marker__label">${meta.label}</span>` +
      `<div class="marker__body">${render(inner)}</div>` +
      `</aside>`;
    out.push('');
    out.push(vault.stash(html));
    out.push('');
  }
  return out.join('\n');
}

/** `~ *quoted from the paper*` — my convention for verbatim author text. */
function extractVerbatim(
  text: string,
  render: (inner: string) => string,
  vault: Vault,
): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    if (/^[\t ]*~[\t ]+\S/.test(lines[i])) {
      const chunk: string[] = [];
      while (i < lines.length && /^[\t ]*~[\t ]+\S/.test(lines[i])) {
        chunk.push(lines[i].replace(/^[\t ]*~[\t ]+/, ''));
        i += 1;
      }
      out.push('');
      out.push(
        vault.stash(
          `<blockquote class="verbatim"><div class="verbatim__body">${render(
            chunk.join('\n'),
          )}</div><span class="verbatim__note">verbatim</span></blockquote>`,
        ),
      );
      out.push('');
      continue;
    }
    out.push(lines[i]);
    i += 1;
  }
  return out.join('\n');
}

const INLINE_MARKER =
  /^([\t ]*(?:(?:[-*+]|\d+\.)[\t ]+|(?:>[\t ]*)+))(PRE|POST|D|Q|A|C|H|O)::[\t ]?(.*)$/gm;

/**
 * `- Q:: ...` in a list, `> D:: ...` in a quote. Breaking the list or quote
 * apart would read worse than the note does, so these are set inline instead
 * — still marked, still indexed.
 */
function inlineMarkers(text: string, markers: Marker[]): string {
  let n = markers.length;
  return text.replace(
    INLINE_MARKER,
    (_m, bullet: string, kind: string, rest: string) => {
      const k = kind as MarkerKind;
      const id = `mk-${k.toLowerCase()}-i${n++}`;
      markers.push({ id, kind: k, text: plainPreview(rest) });
      return `${bullet}<span class="marker-inline marker-inline--${k.toLowerCase()}" id="${id}">${
        MARKER_META[k].glyph
      } ${k}</span> ${rest}`;
    },
  );
}

export function renderNote(raw: string, ctx: RenderContext): RenderedNote {
  const { body, frontmatter } = stripFrontmatter(raw);
  const vault = new Vault();
  const headings: Heading[] = [];
  const markers: Marker[] = [];
  const links: string[] = [];

  const parser = new Marked({ gfm: true, breaks: false });
  parser.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading): string {
        const { tokens, depth } = token;
        const text = this.parser.parseInline(tokens);
        const id = slugify(text) || `h-${headings.length}`;
        headings.push({
          id,
          depth,
          text: decodeEntities(text.replace(/<[^>]+>/g, '')),
        });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">§</a>${text}</h${depth}>\n`;
      },
    },
  });

  const toHtml = (src: string, depth = 0): string => {
    let t = src;
    if (depth < 3) {
      t = extractMarkers(t, (inner) => toHtml(inner, depth + 1), vault, markers);
      t = extractVerbatim(t, (inner) => toHtml(inner, depth + 1), vault);
    }
    t = inlineMarkers(t, markers);
    t = inlineRewrites(t, ctx, links);
    return parser.parse(t, { async: false }) as string;
  };

  const protectedBody = protect(body, vault);
  const html = vault.restore(toHtml(protectedBody));

  return { html, frontmatter, headings, markers, links };
}
