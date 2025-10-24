import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "Writing",
  description:
    "Articles and field notes from Thanh-Loi Hoang on cloud platforms, Kubernetes operations, and MLOps strategy.",
};

export default function BlogPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Writing</h1>
        <p className="muted">
          Essays, debriefs, and practical observations from building cloud and
          ML platforms.
        </p>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="container plain-section"
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
            A quick hello while I gather longer-form case studies and guides.
          </p>
          <p>
            Expect deep dives into Kubernetes, scheduling AI/ML workloads, and
            the human systems required to keep platforms healthy. Stay tuned!
          </p>
        </RevealOnScroll>
      </RevealOnScroll>
    </>
  );
}
