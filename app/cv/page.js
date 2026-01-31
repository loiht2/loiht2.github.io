import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";
import styles from "./cv.module.css";

export const metadata = {
  title: "CV",
  description:
    "Résumé of Thanh-Loi Hoang, highlighting experience in cloud-native infrastructure, Kubernetes, and MLOps delivery.",
};

export default function CVPage() {
  return (
    <>
      {/* Hero Section */}
      <RevealOnScroll as="header" className="container hero-compact" variant="fade-in">
        <div className={styles.heroContent}>
          <h1>Thanh-Loi Hoang</h1>
          <p className={styles.tagline}>
            Cloud-Native Platform Engineer &amp; MLOps Specialist
          </p>
          <div className={styles.contactRow}>
            <Link href="mailto:loi.hoangthanh.24@gmail.com" className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              loi.hoangthanh.24@gmail.com
            </Link>
            <Link href="https://github.com/loiht2" target="_blank" className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              loiht2
            </Link>
            <span className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Seoul, South Korea
            </span>
          </div>
        </div>
      </RevealOnScroll>

      {/* Summary Section */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>About Me</h2>
        <div className={styles.summaryCard}>
          <p>
            A passionate platform engineer with expertise in building scalable Kubernetes infrastructure, 
            designing MLOps platforms, and leading cloud modernization initiatives. I thrive at the 
            intersection of systems thinking, automation, and collaborative leadership—transforming 
            complex infrastructure challenges into elegant, maintainable solutions.
          </p>
        </div>
      </RevealOnScroll>

      {/* Experience Timeline */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Experience</h2>
        <div className={styles.timeline}>
          <RevealOnScroll as="div" className={styles.timelineItem} variant="fade-up" once={false}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <h3>Graduate Student Researcher</h3>
                <span className={styles.timelineDate}>Mar 2024 — Present</span>
              </div>
              <div className={styles.timelineOrg}>DCN Lab, Soongsil University · Seoul, South Korea</div>
              <ul>
                <li>Leading MLOps platform design and deployment using Kubeflow for reproducible ML pipelines</li>
                <li>Benchmarking GPU scheduling solutions (Kueue vs. Volcano) for research workloads</li>
                <li>Establishing observability standards, runbooks, and SLOs for ML services</li>
                <li>Collaborating with research teams to optimize experiment tracking workflows</li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="div" className={styles.timelineItem} variant="fade-up" once={false}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <h3>Cloud Infrastructure Engineer</h3>
                <span className={styles.timelineDate}>Jun 2022 — Feb 2024</span>
              </div>
              <div className={styles.timelineOrg}>FPT Information System · Hanoi, Vietnam</div>
              <ul>
                <li>Architected Red Hat OpenShift platform for TPBank, accelerating deployment pipelines</li>
                <li>Led VMware virtualization program for Vietcombank, reducing hardware footprint by 40%</li>
                <li>Implemented CI/CD guardrails and compliance automation for banking environments</li>
                <li>Delivered technical enablement workshops for on-site engineering teams</li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="div" className={styles.timelineItem} variant="fade-up" once={false}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <h3>System Administrator Intern</h3>
                <span className={styles.timelineDate}>Jan 2022 — May 2022</span>
              </div>
              <div className={styles.timelineOrg}>FPT Information System · Hanoi, Vietnam</div>
              <ul>
                <li>Supported enterprise Linux server administration and monitoring</li>
                <li>Assisted in virtualization deployments and backup automation</li>
                <li>Developed scripts for operational efficiency improvements</li>
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>

      {/* Skills Section */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Technical Skills</h2>
        <div className={styles.skillsGrid}>
          <RevealOnScroll as="div" className={styles.skillCategory} variant="fade-up" once={false}>
            <div className={styles.skillIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <h3>Cloud &amp; Infrastructure</h3>
            <div className={styles.skillTags}>
              <span>Kubernetes</span>
              <span>OpenShift</span>
              <span>VMware vSphere</span>
              <span>AWS</span>
              <span>GCP</span>
              <span>Docker</span>
              <span>Helm</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="div" className={styles.skillCategory} variant="fade-up" once={false}>
            <div className={styles.skillIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h3>MLOps &amp; DevOps</h3>
            <div className={styles.skillTags}>
              <span>Kubeflow</span>
              <span>MLflow</span>
              <span>GitOps</span>
              <span>ArgoCD</span>
              <span>Jenkins</span>
              <span>Terraform</span>
              <span>Ansible</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="div" className={styles.skillCategory} variant="fade-up" once={false}>
            <div className={styles.skillIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h3>Languages &amp; Tools</h3>
            <div className={styles.skillTags}>
              <span>Python</span>
              <span>Go</span>
              <span>Bash</span>
              <span>C/C++</span>
              <span>JavaScript</span>
              <span>SQL</span>
              <span>YAML</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="div" className={styles.skillCategory} variant="fade-up" once={false}>
            <div className={styles.skillIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3>Observability</h3>
            <div className={styles.skillTags}>
              <span>Prometheus</span>
              <span>Grafana</span>
              <span>ELK Stack</span>
              <span>Jaeger</span>
              <span>OpenTelemetry</span>
            </div>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>

      {/* Education Section */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Education</h2>
        <div className={styles.educationGrid}>
          <RevealOnScroll as="div" className={styles.educationCard} variant="fade-up" once={false}>
            <div className={styles.degreeIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div className={styles.educationDetails}>
              <h3>Master of Engineering</h3>
              <div className={styles.school}>Soongsil University</div>
              <div className={styles.educationMeta}>
                <span>Seoul, South Korea</span>
                <span>Mar 2024 — Present</span>
              </div>
              <p>
                Research focus: Cloud-native infrastructure, MLOps systems, and distributed computing. 
                Member of DCN Lab conducting research on scalable ML platforms.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="div" className={styles.educationCard} variant="fade-up" once={false}>
            <div className={styles.degreeIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div className={styles.educationDetails}>
              <h3>Bachelor of Engineering</h3>
              <div className={styles.school}>Posts and Telecommunications Institute of Technology</div>
              <div className={styles.educationMeta}>
                <span>Hanoi, Vietnam</span>
                <span>2018 — 2022</span>
              </div>
              <p>
                Major in Information Technology. Foundation in computer science, networking, 
                and systems programming.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>

      {/* Certifications Section */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Certifications</h2>
        <div className={styles.certGrid}>
          <RevealOnScroll as="div" className={styles.certCard} variant="fade-up" once={false}>
            <div className={styles.certBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span>Certified Kubernetes Administrator (CKA)</span>
          </RevealOnScroll>
          <RevealOnScroll as="div" className={styles.certCard} variant="fade-up" once={false}>
            <div className={styles.certBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span>Red Hat Certified System Administrator (RHCSA)</span>
          </RevealOnScroll>
          <RevealOnScroll as="div" className={styles.certCard} variant="fade-up" once={false}>
            <div className={styles.certBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span>VMware Certified Professional (VCP)</span>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>

      {/* Languages Section */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <h2>Languages</h2>
        <div className={styles.languagesRow}>
          <div className={styles.languageItem}>
            <span className={styles.languageName}>Vietnamese</span>
            <span className={styles.languageLevel}>Native</span>
          </div>
          <div className={styles.languageItem}>
            <span className={styles.languageName}>English</span>
            <span className={styles.languageLevel}>Professional Working</span>
          </div>
          <div className={styles.languageItem}>
            <span className={styles.languageName}>Korean</span>
            <span className={styles.languageLevel}>Intermediate</span>
          </div>
        </div>
      </RevealOnScroll>

      {/* Download CTA */}
      <RevealOnScroll
        as="section"
        className="container section plain-section"
        variant="fade-up"
      >
        <div className={styles.downloadSection}>
          <p className="muted">Want a copy for your records?</p>
          <Link href="/assets/loiht2-cv.pdf" className="btn" target="_blank" download>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </Link>
        </div>
      </RevealOnScroll>
    </>
  );
}
