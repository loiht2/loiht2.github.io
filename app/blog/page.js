import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "Writing",
  description:
    "Writing by Thanh-Loi Hoang — notes on Cloud, Kubernetes, and MLOps.",
};

export default function BlogPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Writing</h1>
        <p className="muted">Notes and write‑ups. More posts coming soon.</p>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="container"
        style={{ padding: "24px 0 60px" }}
        variant="fade-up"
      >
        <RevealOnScroll as="article" className="post" variant="fade-up" once={false}>
          <h2 style={{ margin: "0 0 6px" }}>
            <Link className="a-clean" href="/posts/hello-world">
              Hello, world
            </Link>
          </h2>
          <p className="muted" style={{ margin: "0 0 12px" }}>
            An introduction post — placeholder.
          </p>
          <p>
            This is where I’ll write about Cloud, Kubernetes, and MLOps. Stay
            tuned!
          </p>
        </RevealOnScroll>
      </RevealOnScroll>
    </>
  );
}
