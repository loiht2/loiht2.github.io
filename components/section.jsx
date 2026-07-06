import { Link } from "next-view-transitions";

export default function Section({ title, moreHref, moreLabel, children }) {
  return (
    <section className="anim-view border-t border-line/70 py-12">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {moreHref ? (
          <Link href={moreHref} className="u-link font-mono text-xs text-muted hover:text-fg">
            {moreLabel ?? "See all →"}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
