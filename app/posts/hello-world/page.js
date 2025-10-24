import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "Hello, world",
  description: "An introduction post — placeholder.",
  openGraph: {
    title: "Hello, world — Thanh-Loi Hoang",
    description: "An introduction post — placeholder.",
    type: "article",
    url: "https://loiht2.github.io/posts/hello-world",
  },
};

export default function HelloWorldPost() {
  return (
    <RevealOnScroll as="section" className="container post-content" variant="fade-up">
      <RevealOnScroll as="article" variant="fade-up" once={false}>
        <header>
          <h1>Hello, world</h1>
          <p className="muted">Published Aug 30, 2025 • 2 min read</p>
        </header>
        <p>
          Welcome! This is a placeholder post. I’ll write about Cloud,
          Kubernetes, and MLOps here soon.
        </p>
        <p>
          In the meantime, check out the{" "}
          <Link className="a-clean" href="/projects">
            projects
          </Link>{" "}
          or{" "}
          <Link className="a-clean" href="mailto:loi.hoangthanh.24@gmail.com">
            get in touch
          </Link>
          .
        </p>
      </RevealOnScroll>
    </RevealOnScroll>
  );
}
