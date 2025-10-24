import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "Projects",
  description: "Selected projects by Thanh-Loi Hoang.",
};

export default function ProjectsPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Projects</h1>
        <p className="muted">Selected work and experiments.</p>
      </RevealOnScroll>

      <RevealOnScroll as="section" variant="fade-up">
        <div className="container">
          <div className="grid cols-3">
            <RevealOnScroll as="article" className="card" variant="fade-up" once={false}>
              <div className="pill">Featured</div>
              <h3>MLOps Platforms (DCNLab)</h3>
              <p className="muted">
                Exploring and implementing end‑to‑end MLOps on Kubernetes.
              </p>
              <ul className="muted">
                <li>Surveyed mainstream MLOps platforms → chose Kubeflow</li>
                <li>Evaluated AI/ML workload schedulers → Kueue, Volcano</li>
              </ul>
              <p className="muted">Details coming soon.</p>
            </RevealOnScroll>
            <RevealOnScroll as="article" className="card" variant="fade-up" once={false}>
              <h3>Vietcombank Virtualization (FPT IS)</h3>
              <p className="muted">
                Enterprise virtualization project — details to be added.
              </p>
              <p className="muted">Case study coming soon.</p>
            </RevealOnScroll>
            <RevealOnScroll as="article" className="card" variant="fade-up" once={false}>
              <h3>TPBank OpenShift (FPT IS)</h3>
              <p className="muted">
                Red Hat OpenShift deployment and enablement — details to be
                added.
              </p>
              <p className="muted">Write‑up coming soon.</p>
            </RevealOnScroll>
          </div>
        </div>
      </RevealOnScroll>
    </>
  );
}
