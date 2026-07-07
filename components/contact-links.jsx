import { PROFILE } from "@/content/profile";

const ICONS = {
  email: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 .2a8 8 0 0 0-2.53 15.6c.4.07.55-.17.55-.38v-1.34c-2.25.49-2.73-1.08-2.73-1.08-.36-.91-.89-1.15-.89-1.15-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.86.86 2.31.66.07-.52.28-.87.5-1.07-1.8-.2-3.7-.9-3.7-4.03 0-.89.32-1.62.84-2.2-.08-.21-.37-1.06.08-2.2 0 0 .7-.22 2.3.84a7.9 7.9 0 0 1 4.18 0c1.6-1.06 2.3-.84 2.3-.84.45 1.14.16 1.99.08 2.2.52.58.84 1.31.84 2.2 0 3.14-1.9 3.83-3.72 4.03.29.25.54.74.54 1.5v2.22c0 .21.14.46.55.38A8 8 0 0 0 8 .2Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM4 9h4v12H4zM10 9h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C20.2 8.65 22 10 22 13.24V21h-4v-6.8c0-1.62-.58-2.72-2.04-2.72-1.11 0-1.77.75-2.06 1.47-.11.27-.14.64-.14 1.01V21h-4z" />
    </svg>
  ),
  scholar: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 3 1 9l4 2.18v4.32L12 19l7-3.5v-4.32l2-1.09V15h2V9L12 3Zm0 2.28L18.94 9 12 12.72 5.06 9 12 5.28ZM17 14.26l-5 2.5-5-2.5v-1.9l5 2.72 5-2.72v1.9Z" />
    </svg>
  ),
  orcid: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM7.9 7.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8ZM8.65 17H7.15V8.7h1.5V17Zm2.1-8.3h3.1c2.95 0 4.25 2.1 4.25 4.15 0 2.13-1.66 4.15-4.24 4.15h-3.11V8.7Zm1.5 1.35v5.6h1.55c2.6 0 3.2-1.98 3.2-2.8 0-1.52-.97-2.8-3.26-2.8h-1.49Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M4 3h4.5l3.18 4.62L15.47 3H20l-6.35 7.44L20.5 21H16l-3.54-5.18L8.58 21H4.05l6.62-7.76z" />
    </svg>
  ),
};

export default function ContactLinks() {
  const { emails, links } = PROFILE;
  const items = [
    { label: "Email", href: `mailto:${emails.personal}`, icon: ICONS.email },
    emails.academic && { label: "Academic email", href: `mailto:${emails.academic}`, icon: ICONS.email },
    { label: "GitHub", href: links.github, icon: ICONS.github },
    { label: "LinkedIn", href: links.linkedin, icon: ICONS.linkedin },
    links.scholar && { label: "Google Scholar", href: links.scholar, icon: ICONS.scholar },
    links.orcid && { label: "ORCID", href: links.orcid, icon: ICONS.orcid },
    { label: "X", href: links.x, icon: ICONS.x },
  ].filter(Boolean);

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ label, href, icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-muted hover:text-fg"
          >
            {icon}
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
