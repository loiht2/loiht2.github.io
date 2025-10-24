import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";

export const metadata = {
  title: "CV",
  description:
    "Résumé of Thanh-Loi Hoang, highlighting experience in cloud-native infrastructure, Kubernetes, and MLOps delivery.",
};

export default function CVPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Curriculum Vitae</h1>
        <p className="muted">
          Cloud-native platform engineer blending systems thinking, MLOps
          delivery, and collaborative leadership.
        </p>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
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
          <div>Seoul, South Korea · Soongsil University</div>
        </div>
        <p className="muted" style={{ marginTop: "24px", maxWidth: "680px" }}>
          I specialise in building dependable Kubernetes platforms, enabling ML
          workflows, and guiding teams through infrastructure modernisation.
          I thrive in environments where clarity, experimentation, and delivery
          discipline intersect.
        </p>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Skills</h2>
        <RevealOnScroll as="div" className="card" variant="fade-up" once={false}>
          <ul>
            <li>
              <strong>Cloud &amp; Kubernetes:</strong> Production-grade clusters,
              GitOps, observability, and multi-tenant governance.
            </li>
            <li>
              <strong>MLOps:</strong> Kubeflow, model lifecycle orchestration,
              GPU workload scheduling, experiment tracking.
            </li>
            <li>
              <strong>Languages &amp; Tooling:</strong> Python, Go, Bash,
              C/C++, JavaScript, Terraform, CI/CD automation.
            </li>
          </ul>
        </RevealOnScroll>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
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
          <p>
            Leading the design and rollout of a Kubeflow-driven platform that
            supports experiment tracking, reproducible pipelines, and governed
            model deployment for research squads.
          </p>
          <ul>
            <li>Evaluated market offerings → selected and extended Kubeflow</li>
            <li>Benchmarked Kueue vs. Volcano for GPU scheduling guarantees</li>
            <li>Instituted observability, runbooks, and SLOs for ML services</li>
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
          <p>
            Guided a national bank through a phased VMware virtualization
            programme, reducing hardware footprint while increasing service
            resiliency.
          </p>
          <ul>
            <li>Mapped legacy workloads and designed the migration blueprint</li>
            <li>Automated deployment pipelines and backup strategies</li>
            <li>Delivered enablement workshops for on-site engineering teams</li>
          </ul>
        </RevealOnScroll>
        <RevealOnScroll as="div" className="card" variant="fade-up" once={false}>
          <h3 style={{ margin: "6px 0" }}>TPBank OpenShift (FPT IS)</h3>
          <p>
            Architected and launched a Red Hat OpenShift foundation that
            accelerated product teams from provisioning to production.
          </p>
          <ul>
            <li>Integrated CI/CD guardrails and compliance automation</li>
            <li>Defined operational playbooks and escalation paths</li>
            <li>Coached developers on containerisation best practices</li>
          </ul>
        </RevealOnScroll>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Education</h2>
        <RevealOnScroll as="div" className="card" variant="fade-up" once={false}>
          Master of Engineering — Soongsil University, Seoul<br />
          Focus: Cloud-native infrastructure, MLOps research, distributed systems.
        </RevealOnScroll>
      </RevealOnScroll>
    </>
  );
}
