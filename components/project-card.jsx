export default function ProjectCard({ project }) {
  const Tag = project.href ? "a" : "div";
  const linkProps = project.href
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Tag {...linkProps} className="card block p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold tracking-tight">{project.title}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{project.period}</span>
      </div>
      <p className="mt-0.5 text-sm text-accent">{project.org}</p>
      <p className="mt-2 text-sm text-muted">{project.description}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{t}</li>
        ))}
      </ul>
    </Tag>
  );
}
