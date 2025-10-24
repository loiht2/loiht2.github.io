import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "Hello, world",
  description:
    "A welcome note outlining upcoming essays on Kubernetes, MLOps, and running calm cloud platforms.",
  openGraph: {
    title: "Hello, world — Thanh-Loi Hoang",
    description:
      "A welcome note outlining upcoming essays on Kubernetes, MLOps, and running calm cloud platforms.",
    type: "article",
    url: "https://loiht2.github.io/posts/hello-world",
  },
};

export default function HelloWorldPost() {
  return (
    <RevealOnScroll
      as="section"
      className="container post-content plain-section"
      variant="fade-up"
    >
      <RevealOnScroll as="article" variant="fade-up" once={false}>
        <header>
          <h1>Hello, world</h1>
          <p className="muted">Published Aug 30, 2025 • 2 min read</p>
        </header>
        <p>
          Welcome! I’m assembling a series of deep dives on the craft of running
          resilient cloud platforms for ML teams—covering everything from
          Kubernetes operations to the people practices that keep systems calm.
        </p>
        <p>
          In the meantime, explore the{" "}
          <Link className="a-clean" href="/projects">
            projects
          </Link>{" "}
          or
          <Link className="a-clean" href="mailto:loi.hoangthanh.24@gmail.com">
            get in touch
          </Link>
          to compare notes. New essays are on the way soon.
        </p>
      </RevealOnScroll>
    </RevealOnScroll>
  );
}
