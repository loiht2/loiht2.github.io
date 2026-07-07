import { PUBLICATIONS, THESES } from "@/content/publications";

export default function PublicationList({ limit }) {
  const papers = limit ? PUBLICATIONS.slice(0, limit) : PUBLICATIONS;
  return (
    <div className="space-y-6">
      {papers.length > 0 && (
        <ol className="dim-list space-y-4">
          {papers.map((p) => (
            <li key={p.title} className="rounded-lg border border-line p-4">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.authors}</p>
              <p className="mt-1 font-mono text-xs text-muted">{p.venue} · {p.year}</p>
              {(p.links?.pdf || p.links?.doi) && (
                <p className="mt-2 flex gap-3 font-mono text-xs">
                  {p.links.pdf && <a className="text-accent underline underline-offset-2" href={p.links.pdf} target="_blank" rel="noopener noreferrer">PDF</a>}
                  {p.links.doi && <a className="text-accent underline underline-offset-2" href={p.links.doi} target="_blank" rel="noopener noreferrer">DOI</a>}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
      <ul className="dim-list space-y-3">
        {THESES.map((t) => (
          <li key={t.degree} className="flex flex-col gap-0.5">
            <span className="text-sm">
              <span className="font-medium">{t.degree}:</span>{" "}
              {t.title ?? <span className="text-muted">In progress</span>}
            </span>
            <span className="font-mono text-xs text-muted">{t.institution} · {t.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
