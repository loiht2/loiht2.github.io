import RevealOnScroll from "@/components/reveal-on-scroll";
import styles from "./projects.module.css";

export const metadata = {
  title: "Projects",
  description: "Selected projects by Thanh-Loi Hoang in cloud infrastructure, Kubernetes, and MLOps.",
};

const PROJECTS = [
  {
    title: "ML Platform",
    org: "DCNLab, Soongsil University",
    period: "2025 – Present",
    description: "Building a Kubeflow-based MLOps stack for AI/ML research workflows.",
    tags: ["Kubernetes", "Kubeflow", "MLOps"],
  },
  {
    title: "OpenShift Platform",
    org: "TPBank via FPT IS",
    period: "2025",
    description: "Production-ready Red Hat OpenShift foundation for containerized applications.",
    tags: ["OpenShift", "Kubernetes"],
  },
  {
    title: "Banking Virtualization",
    org: "Vietcombank via FPT IS",
    period: "2024",
    description: "VMware virtualization for core banking workloads across nationwide branches.",
    tags: ["VMware", "Infrastructure"],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <h1>Projects</h1>
        <p className="muted">
          My work in cloud infrastructure, Kubernetes, and MLOps.
        </p>
      </RevealOnScroll>

      <section className="plain-section">
        <div className="container">
          <div className={styles.projectList}>
            {PROJECTS.map((project) => (
              <RevealOnScroll
                key={project.title}
                as="article"
                className={styles.projectCard}
                variant="fade-up"
                once={false}
              >
                {project.featured && (
                  <span className={styles.featuredBadge}>Featured</span>
                )}
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <span className={styles.projectPeriod}>{project.period}</span>
                </div>
                <p className={styles.projectOrg}>{project.org}</p>
                <p className={styles.projectDesc}>{project.description}</p>
                <div className={styles.projectTags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
