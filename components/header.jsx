"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./theme-provider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/cv", label: "CV" },
];

const CONTACT_LINKS = [
  {
    href: "https://www.linkedin.com/in/thanh-loi-hoang/",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: "https://x.com/ThanhLoiHoang02",
    label: "Twitter/X",
    Icon: XIcon,
  },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const themePressed = theme === "dark" ? "true" : "false";

  const navLinkProps = useMemo(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        ariaCurrent:
          link.href === "/"
            ? pathname === "/" ? "page" : undefined
            : pathname.startsWith(link.href)
              ? "page"
              : undefined,
      })),
    [pathname],
  );

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <div className="brand">
          <Link href="/">Thanh-Loi Hoang</Link>
        </div>
        <div
          id="menu"
          className={`menu${menuOpen ? " is-open" : ""}`}
          role="navigation"
          aria-label="Main"
        >
          {navLinkProps.map(({ href, label, ariaCurrent }) => (
            <Link
              key={href}
              href={href}
              aria-current={ariaCurrent}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            className="toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            aria-pressed={themePressed}
          >
            🌓
          </button>
        </div>
        <button
          type="button"
          className="hamburger"
          onClick={() =>
            setMenuOpen((open) => {
              const next = !open;
              if (!next) {
                setDropdownOpen(false);
              }
              return next;
            })
          }
          aria-controls="menu"
          aria-expanded={menuOpen ? "true" : "false"}
        >
          Menu
        </button>
      </div>
    </nav>
  );
}

function GitHubIcon() {
  return null;
}

function LinkedInIcon() {
  return (
    <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM4 9h4v12H4zM10 9h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C20.2 8.65 22 10 22 13.24V21h-4v-6.8c0-1.62-.58-2.72-2.04-2.72-1.11 0-1.77.75-2.06 1.47-.11.27-.14.64-.14 1.01V21h-4z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 3h4.5l3.18 4.62L15.47 3H20l-6.35 7.44L20.5 21H16l-3.54-5.18L8.58 21H4.05l6.62-7.76z"
      />
    </svg>
  );
}
