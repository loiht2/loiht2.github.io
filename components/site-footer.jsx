import { PROFILE } from "@/content/profile";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line/70 print:hidden">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <p className="font-mono text-xs">Crafted with Next.js and an obsession for dependable systems.</p>
      </div>
    </footer>
  );
}
