import Image from "next/image";
import { Link } from "next-view-transitions";
import Section from "@/components/section";
import ContactLinks from "@/components/contact-links";
import NewsList from "@/components/news-list";
import ProjectCard from "@/components/project-card";
import PublicationList from "@/components/publication-list";
import PhotoGrid from "@/components/photo-grid";
import { PROFILE } from "@/content/profile";
import { NEWS } from "@/content/news";
import { PROJECTS } from "@/content/projects";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const featured = PROJECTS.filter((p) => p.featured);
  const lab = PROFILE.affiliation;
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section className="relative pb-14 pt-16 sm:pt-24">
        <div className="bg-grid absolute inset-x-0 -top-14 -z-10 h-80" aria-hidden="true" />
        <div className="anim flex items-center gap-5">
          <Image
            src="/assets/images/loiht2-avatar.png"
            alt="Portrait of Thanh-Loi Hoang"
            width={88}
            height={88}
            priority
            className="rounded-full border border-line"
          />
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{PROFILE.name}</h1>
            <p className="mt-1.5 font-mono text-sm text-muted">{PROFILE.role} · {PROFILE.location}</p>
          </div>
        </div>
        <p className="anim mt-6 max-w-prose text-pretty text-lg leading-relaxed text-muted" style={{ "--d": "90ms" }}>
          I work on cloud-native infrastructure for AI/ML — Kubernetes, MLOps, and network performance — at{" "}
          {lab.labUrl ? (
            <a href={lab.labUrl} target="_blank" rel="noopener noreferrer" className="u-link text-fg">{lab.lab}, {lab.university}</a>
          ) : (
            <span className="text-fg">{lab.lab}, {lab.university}</span>
          )}
          . {PROFILE.goal}
        </p>
        <div className="anim mt-8 flex flex-wrap gap-3" style={{ "--d": "180ms" }}>
          <Link href="/cv" className="btn btn-primary">View CV</Link>
          <Link href="/projects" className="btn btn-ghost">Projects</Link>
        </div>
        <div className="anim mt-8" style={{ "--d": "270ms" }}>
          <ContactLinks />
        </div>
      </section>

      <Section title="News">
        <NewsList items={NEWS.slice(0, 5)} />
      </Section>

      <Section title="Featured projects" moreHref="/projects" moreLabel="All projects →">
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((p) => <ProjectCard key={p.title} project={p} />)}
        </div>
      </Section>

      <Section title="Publications" moreHref="/research" moreLabel="Research →">
        <PublicationList limit={3} />
      </Section>

      <Section title="Photos">
        <p className="mb-5 -mt-2 text-sm text-muted">Conferences, campuses, and places in between.</p>
        <PhotoGrid />
      </Section>
    </div>
  );
}
