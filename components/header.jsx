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
    href: "https://github.com/loiht2",
    label: "GitHub",
    Icon: GitHubIcon,
  },
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
          <div
            className={`dropdown${dropdownOpen ? " is-open" : ""}`}
            ref={dropdownRef}
          >
            <button
              type="button"
              className="dropbtn"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen ? "true" : "false"}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              Contact <span className="caret" aria-hidden="true">▾</span>
            </button>
            <div className="dropdown-menu" role="menu">
              {CONTACT_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  className="menu-item"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Icon />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
          <a
            className="pill"
            href="https://github.com/loiht2"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
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
  return (
    <svg className="menu-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 .2a8 8 0 0 0-2.53 15.6c.4.07.55-.17.55-.38v-1.34c-2.25.49-2.73-1.08-2.73-1.08-.36-.91-.89-1.15-.89-1.15-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.86.86 2.31.66.07-.52.28-.87.5-1.07-1.8-.2-3.7-.9-3.7-4.03 0-.89.32-1.62.84-2.2-.08-.21-.37-1.06.08-2.2 0 0 .7-.22 2.3.84a7.9 7.9 0 0 1 4.18 0c1.6-1.06 2.3-.84 2.3-.84.45 1.14.16 1.99.08 2.2.52.58.84 1.31.84 2.2 0 3.14-1.9 3.83-3.72 4.03.29.25.54.74.54 1.5v2.22c0 .21.14.46.55.38A8 8 0 0 0 8 .2Z"
      />
    </svg>
  );
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
        d="M3 3h4.6l5 6.9L17 3h4l-6.6 9.2L21 21h-4.6l-5.3-7.4L7 21H3l7.1-10L3 3Z"
      />
    </svg>
  );
}
