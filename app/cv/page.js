import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "CV",
  description: "CV of Thanh-Loi Hoang — Cloud‑Native, Kubernetes, MLOps.",
};

export default function CVPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Curriculum Vitae</h1>
        <p className="muted">Cloud‑Native • Kubernetes • MLOps • Python • Go</p>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="container section" variant="fade-up">
        <div className="grid cols-2 cv">
          <div>
            <strong>Name</strong>
          </div>
          <div>Thanh‑Loi Hoang</div>
          <div>
            <strong>Email</strong>
          </div>
          <div>
            <Link className="a-clean" href="mailto:loi.hoangthanh.24@gmail.com">
              loi.hoangthanh.24@gmail.com
            </Link>
          </div>
          <div>
            <strong>Location</strong>
          </div>
          <div>Seoul, KR (Soongsil University)</div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="container section" variant="fade-up">
        <h2>Skills</h2>
        <RevealOnScroll as="div" className="card" variant="fade-up" once={false}>
          Kubernetes, Docker, Python, Go, Bash Script, C/C++, JavaScript
        </RevealOnScroll>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="container section" variant="fade-up">
        <h2>Projects</h2>
        <RevealOnScroll
          as="div"
          className="card"
          style={{ marginBottom: "12px" }}
          variant="fade-up"
          once={false}
        >
          <div className="pill">Featured</div>
          <h3 style={{ margin: "6px 0" }}>MLOps Platforms (DCNLab)</h3>
          <ul>
            <li>
              Surveyed mainstream MLOps platforms → selected Kubeflow
            </li>
            <li>Evaluated schedulers for AI/ML workloads → Kueue, Volcano</li>
            <li>Implementation details and outcomes: coming soon</li>
          </ul>
        </RevealOnScroll>
        <RevealOnScroll
          as="div"
          className="card"
          style={{ marginBottom: "12px" }}
          variant="fade-up"
          once={false}
        >
          <h3 style={{ margin: "6px 0" }}>
            Vietcombank Virtualization (FPT IS)
          </h3>
          <p>Enterprise virtualization program. Details to be added.</p>
        </RevealOnScroll>
        <RevealOnScroll as="div" className="card" variant="fade-up" once={false}>
          <h3 style={{ margin: "6px 0" }}>TPBank OpenShift (FPT IS)</h3>
          <p>Deployment and enablement on Red Hat OpenShift. Details to be added.</p>
        </RevealOnScroll>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="container section" variant="fade-up">
        <h2>Education</h2>
        <RevealOnScroll as="div" className="card" variant="fade-up" once={false}>
          Master’s student — Soongsil University
        </RevealOnScroll>
      </RevealOnScroll>
    </>
  );
}
