import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "Projects",
  description:
    "Selected projects and initiatives led by Thanh-Loi Hoang across cloud infrastructure, Kubernetes, and MLOps.",
};

export default function ProjectsPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Projects</h1>
        <p className="muted">
          Highlights from the platforms, migrations, and experiments I’ve shepherded
          from idea to measurable impact.
        </p>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="plain-section" variant="fade-up">
        <div className="container">
          <p className="muted" style={{ maxWidth: "640px", marginBottom: "28px" }}>
            Each engagement blends reliability engineering with collaborative
            product thinking—scaling infrastructure while keeping teams aligned
            on outcomes that matter.
          </p>
          <div className="grid cols-3">
            <RevealOnScroll as="article" className="card" variant="fade-up" once={false}>
              <div className="pill">Featured</div>
              <h3>MLOps Platforms (DCNLab)</h3>
              <p className="muted">
                Lead engineer on a Kubeflow-based MLOps stack enabling
                researchers to iterate quickly without sacrificing governance.
              </p>
              <ul className="muted">
                <li>Surveyed mainstream MLOps platforms and championed Kubeflow</li>
                <li>Evaluated workload schedulers (Kueue, Volcano) for latency and fairness</li>
              </ul>
              <p className="muted">
                Currently documenting migration patterns and reliability metrics.
              </p>
            </RevealOnScroll>
            <RevealOnScroll as="article" className="card" variant="fade-up" once={false}>
              <h3>Vietcombank Virtualization (FPT IS)</h3>
              <p className="muted">
                Modernised core banking workloads through a staged VMware
                virtualization programme serving nationwide branches.
              </p>
              <p className="muted">
                Coordinated cross-functional delivery and knowledge transfer for
                on-site operations teams.
              </p>
            </RevealOnScroll>
            <RevealOnScroll as="article" className="card" variant="fade-up" once={false}>
              <h3>TPBank OpenShift (FPT IS)</h3>
              <p className="muted">
                Delivered a production-ready Red Hat OpenShift foundation that
                accelerated application onboarding.
              </p>
              <p className="muted">
                Introduced automation guardrails and runbooks to keep releases
                fast yet predictable.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </RevealOnScroll>
    </>
  );
}
