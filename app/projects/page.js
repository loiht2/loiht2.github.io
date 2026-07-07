import Section from "@/components/section";
import ProjectCard from "@/components/project-card";
import { PROJECTS } from "@/content/projects";

export const metadata = {
  title: "Projects",
  description: "Cloud infrastructure, Kubernetes, and MLOps work by Thanh-Loi Hoang.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
        <p className="anim mt-4 max-w-prose text-muted" style={{ "--d": "90ms" }}>
          Platform work across research and industry — lab MLOps stacks and production banking infrastructure.
        </p>
      </header>
      <div className="anim grid gap-4 py-8 sm:grid-cols-2" style={{ "--d": "180ms" }}>
        {PROJECTS.map((p) => <ProjectCard key={p.title} project={p} />)}
      </div>
    </div>
  );
}
