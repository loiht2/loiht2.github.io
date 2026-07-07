import Section from "@/components/section";
import PublicationList from "@/components/publication-list";
import { PROFILE } from "@/content/profile";
import { EDUCATION } from "@/content/education";

export const metadata = {
  title: "Research",
  description: "Research interests, thesis work, and publications of Thanh-Loi Hoang.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  const msc = EDUCATION.find((e) => e.degree === "MSc");
  const { links } = PROFILE;
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">Research</h1>
        <p className="anim mt-4 max-w-prose leading-relaxed text-muted" style={{ "--d": "90ms" }}>
          {PROFILE.researchInterests ??
            "I study cloud-native infrastructure for AI/ML at DCNLab, Soongsil University — a full research statement is coming soon."}
        </p>
        {(links.scholar || links.orcid) && (
          <p className="anim mt-4 flex gap-4 font-mono text-sm" style={{ "--d": "180ms" }}>
            {links.scholar && <a className="u-link text-accent" href={links.scholar} target="_blank" rel="noopener noreferrer">Google Scholar</a>}
            {links.orcid && <a className="u-link text-accent" href={links.orcid} target="_blank" rel="noopener noreferrer">ORCID</a>}
          </p>
        )}
      </header>

      <Section title="Thesis">
        <div className="card p-5">
          <p className="text-sm">
            <span className="font-medium">MSc thesis:</span>{" "}
            {msc.thesis ?? <span className="text-muted">Topic to be announced — in progress</span>}
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            {msc.school}
            {msc.advisor ? ` · Advisor: ${msc.advisor}` : ""}
            {msc.expectedGraduation ? ` · Expected ${msc.expectedGraduation}` : ""}
          </p>
        </div>
      </Section>

      <Section title="Publications">
        <PublicationList />
      </Section>
    </div>
  );
}
