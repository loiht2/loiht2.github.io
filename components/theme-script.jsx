import Script from "next/script";

const THEME_INIT = `
(() => {
  try {
    const stored = window.localStorage.getItem("theme");
    const root = document.documentElement;
    if (stored === "dark") {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  } catch (error) {
    document.documentElement.classList.add("light");
  }
})();
`;

export default function ThemeScript() {
  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {THEME_INIT}
    </Script>
  );
}
