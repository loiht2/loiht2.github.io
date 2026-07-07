"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import ThemeToggle from "./theme-toggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/cv", label: "CV" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Close the mobile menu when the route changes (covers link clicks and back/forward).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkClass = (href) =>
    `rounded-md px-3 py-2 text-sm transition-colors ${
      isActive(href) ? "font-medium text-fg" : "text-muted hover:text-fg"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md print:hidden">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Thanh-Loi Hoang
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md border border-line"
          >
            <span className="sr-only">Menu</span>
            <span className={`h-px w-4 bg-fg transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-4 bg-fg transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>
      <div
        id="mobile-nav"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out sm:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 border-t border-line/70 px-4 pb-4 pt-2">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={`${linkClass(l.href)} py-3`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
