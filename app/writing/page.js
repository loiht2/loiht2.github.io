import { Link } from "next-view-transitions";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Writing",
  description: "Essays and field notes on cloud platforms, Kubernetes operations, and MLOps.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">Writing</h1>
        <p className="anim mt-4 max-w-prose text-muted" style={{ "--d": "90ms" }}>
          Essays, debriefs, and practical observations from building cloud-native platforms.
        </p>
      </header>
      <ul className="dim-list anim space-y-2 py-8" style={{ "--d": "180ms" }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`} className="group flex flex-col gap-1 rounded-xl p-4 transition-colors hover:bg-card sm:flex-row sm:items-baseline sm:justify-between">
              <span>
                <span className="font-medium group-hover:text-accent">{p.title}</span>
                <span className="mt-1 block text-sm text-muted">{p.description}</span>
              </span>
              <time dateTime={p.date} className="shrink-0 font-mono text-xs text-muted">{p.date}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
