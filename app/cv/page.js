import ContactLinks from "@/components/contact-links";
import PublicationList from "@/components/publication-list";
import { PROFILE } from "@/content/profile";
import { EXPERIENCE } from "@/content/experience";
import { EDUCATION } from "@/content/education";
import { SKILLS, CERTIFICATIONS, LANGUAGES } from "@/content/skills";

export const metadata = {
  title: "CV",
  description: "Curriculum vitae of Thanh-Loi Hoang — cloud-native infrastructure, Kubernetes, and MLOps.",
  alternates: { canonical: "/cv" },
};

function CvSection({ title, children }) {
  return (
    <section className="border-t border-line/70 py-8">
      <h2 className="mb-5 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="flex flex-col gap-5 pb-8 pt-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{PROFILE.name}</h1>
          <p className="mt-1.5 font-mono text-sm text-muted">{PROFILE.role} · {PROFILE.location}</p>
        </div>
        {PROFILE.cvPdf && (
          <a href={PROFILE.cvPdf} download className="btn btn-primary print-hidden">Download PDF</a>
        )}
      </header>

      <div className="pb-8 print-hidden"><ContactLinks /></div>

      <CvSection title="Summary">
        {PROFILE.bio.map((p) => <p key={p.slice(0, 24)} className="mb-3 max-w-prose text-sm leading-relaxed text-muted">{p}</p>)}
      </CvSection>

      <CvSection title="Experience">
        <ol className="dim-list relative space-y-8 border-l border-line pl-6">
          {EXPERIENCE.map((job) => (
            <li key={`${job.title}-${job.org}`} className="relative">
              <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" aria-hidden="true" />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-medium">{job.title}</h3>
                <span className="font-mono text-xs text-muted">{job.period}</span>
              </div>
              <p className="text-sm text-accent">{job.org} · {job.location}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                {job.bullets.map((b) => <li key={b.slice(0, 24)}>{b}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </CvSection>

      <CvSection title="Education">
        <div className="space-y-5">
          {EDUCATION.map((e) => (
            <div key={e.degree} className="card p-5">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-medium">{e.degree}, {e.field}</h3>
                <span className="font-mono text-xs text-muted">{e.period}</span>
              </div>
              <p className="text-sm text-muted">{e.school} · {e.location}</p>
              <dl className="mt-3 space-y-1 text-sm">
                {e.honors && <div><dt className="inline font-medium">Honors: </dt><dd className="inline text-muted">{e.honors}</dd></div>}
                {e.thesis && <div><dt className="inline font-medium">Thesis: </dt><dd className="inline text-muted">{e.thesis}</dd></div>}
                {e.gpa && <div><dt className="inline font-medium">GPA: </dt><dd className="inline text-muted">{e.gpa}</dd></div>}
                {e.expectedGraduation && <div><dt className="inline font-medium">Expected graduation: </dt><dd className="inline text-muted">{e.expectedGraduation}</dd></div>}
              </dl>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {e.focus.map((f) => <li key={f} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </CvSection>

      <CvSection title="Publications">
        <PublicationList />
      </CvSection>

      <CvSection title="Skills">
        <div className="grid gap-5 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <div key={s.group}>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">{s.group}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {s.items.map((i) => <li key={i} className="rounded-full border border-line px-2.5 py-0.5 text-sm">{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </CvSection>

      {CERTIFICATIONS.length > 0 && (
        <CvSection title="Certifications">
          <ul className="space-y-2 text-sm">
            {CERTIFICATIONS.map((c) => (
              <li key={c.name}><span className="font-medium">{c.name}</span> <span className="text-muted">— {c.issuer}, {c.year}</span></li>
            ))}
          </ul>
        </CvSection>
      )}

      <CvSection title="Languages">
        <ul className="space-y-2 text-sm">
          {LANGUAGES.map((l) => (
            <li key={l.name} className="flex justify-between gap-4 sm:justify-start">
              <span className="w-28 font-medium">{l.name}</span>
              <span className="text-muted">{l.level}</span>
            </li>
          ))}
        </ul>
      </CvSection>
    </div>
  );
}
