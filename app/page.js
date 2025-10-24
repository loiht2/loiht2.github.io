import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";
import TypewriterRole from "@/components/typewriter-role";

const PHOTOS = [
  {
    src: "/assets/images/rev-ecit-2023.jpg",
    title: "REV-ECIT 2023, Hanoi, Viet Nam",
    subtitle: "Dec 2023",
  },
  {
    src: "/assets/images/vnu-uet-2024.jpg",
    title: "VNU University of Engineering and Technology, Hanoi, Viet Nam",
    subtitle: "July 2024",
  },
  {
    src: "/assets/images/nui-coc-lake-2024.jpg",
    title: "Nui Coc Lake Tourist Area, Thai Nguyen, Viet Nam",
    subtitle: "Oct 2024",
  },
  {
    src: "/assets/images/soongsil-university-March-2025.jpg",
    title: "Soongsil University, Seoul, South Korea",
    subtitle: "March 2025",
  },
  {
    src: "/assets/images/busan-Aug-2025.jpg",
    title: "Busan Station, Busan, South Korea",
    subtitle: "Aug 2025",
  },
];

const CONTACT_LINKS = [
  {
    label: "Email",
    value: "loi.hoangthanh.24@gmail.com",
    href: "mailto:loi.hoangthanh.24@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3.75 5.5h16.5a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3.75a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 7 12 12.5 19.5 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "github.com/loiht2",
    href: "https://github.com/loiht2",
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 .2a8 8 0 0 0-2.53 15.6c.4.07.55-.17.55-.38v-1.34c-2.25.49-2.73-1.08-2.73-1.08-.36-.91-.89-1.15-.89-1.15-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.86.86 2.31.66.07-.52.28-.87.5-1.07-1.8-.2-3.7-.9-3.7-4.03 0-.89.32-1.62.84-2.2-.08-.21-.37-1.06.08-2.2 0 0 .7-.22 2.3.84a7.9 7.9 0 0 1 4.18 0c1.6-1.06 2.3-.84 2.3-.84.45 1.14.16 1.99.08 2.2.52.58.84 1.31.84 2.2 0 3.14-1.9 3.83-3.72 4.03.29.25.54.74.54 1.5v2.22c0 .21.14.46.55.38A8 8 0 0 0 8 .2Z"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    value: "@ThanhLoiHoang02",
    href: "https://twitter.com/ThanhLoiHoang02",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.66 6.18c-.58.26-1.2.43-1.85.51a3.21 3.21 0 0 0 1.41-1.77 6.26 6.26 0 0 1-2.03.78 3.18 3.18 0 0 0-5.43 2.17c0 .25.03.49.08.72a9.04 9.04 0 0 1-6.56-3.33 3.18 3.18 0 0 0 0 4.24c-.48-.01-.94-.15-1.34-.37v.04a3.18 3.18 0 0 0 2.55 3.13 3.2 3.2 0 0 1-1.43.05 3.18 3.18 0 0 0 2.97 2.21A6.38 6.38 0 0 1 4 17.54a8.99 8.99 0 0 0 4.88 1.43c5.85 0 9.05-4.85 9.05-9.05 0-.14 0-.29-.01-.43a6.47 6.47 0 0 0 1.74-1.71Z"
        />
      </svg>
    ),
  },
  {
    label: "X",
    value: "@ThanhLoiHoang02",
    href: "https://x.com/ThanhLoiHoang02",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 3h4.5l3.18 4.62L15.47 3H20l-6.35 7.44L20.5 21H16l-3.54-5.18L8.58 21H4.05l6.62-7.76z"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "facebook.com/loiht2",
    href: "https://facebook.com/loiht2",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13 21v-7h2.5l.5-3H13V9.1c0-.9.25-1.5 1.57-1.5H16V5.1C15.6 5 14.6 5 13.5 5 11 5 9.5 6.4 9.5 8.8V11H7v3h2.5v7h3.5Z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      <RevealOnScroll as="header" className="hero container" variant="fade-in">
        <div className="avatar-wrap">
          <Image
            className="avatar"
            src="/assets/images/loiht2-avatar.png"
            alt="Avatar of Thanh-Loi Hoang"
            width={256}
            height={256}
            priority
          />
        </div>
        <div className="kicker">NO PAIN NO GAIN</div>
        <h1>
          Hi, I’m <TypewriterRole />.
        </h1>
        <p className="sub">
          Master’s Student at Soongsil University
        </p>
        <div className="cta">
          <Link className="btn" href="/blog">
            Read my blog
          </Link>
          <Link className="btn secondary" href="/projects">
            View my work
          </Link>
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="plain-section"
        variant="fade-up"
      >
        <div className="container">
          <RevealOnScroll as="div" variant="fade-right" once={false}>
            <h2>Bio</h2>
            <p>
              I’m Thanh‑Loi Hoang—an engineer focused on designing,
              automating, and operating cloud‑native infrastructure that helps
              machine learning teams move with confidence.
            </p>
            <p>
              My work sits at the intersection of platform reliability,
              Kubernetes, and pragmatic MLOps. I enjoy turning research into
              production-ready tooling, documenting the lessons learned, and
              mentoring teammates along the way.
            </p>
            <p>
              When I’m not shipping code or experiments, you’ll find me
              contributing to community events, writing about dependable
              systems, or exploring new cities camera-in-hand.
            </p>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        className="plain-section"
        variant="fade-up"
        id="contact"
      >
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-header">
              <div>
                <h2>Get in Touch</h2>
                <p className="muted">
                  Have a project in mind or want to collaborate? I&apos;d love to hear from you!
                </p>
              </div>
            </div>
            <div className="contact-panel">
              <ul className="contact-list">
                {CONTACT_LINKS.map(({ label, value, href, icon }) => {
                  const Tag = href ? "a" : "div";
                  const isExternal = href?.startsWith("http");
                  const tagProps = href
                    ? {
                        href,
                        target: isExternal ? "_blank" : undefined,
                        rel: isExternal ? "noopener noreferrer" : undefined,
                      }
                    : {};
                  return (
                    <li key={label}>
                      <Tag className="contact-item" {...tagProps}>
                        <span className="contact-item-icon">{icon}</span>
                        <span className="contact-item-body">
                          <span className="contact-item-label">{label}</span>
                          <span className="contact-item-value">{value}</span>
                        </span>
                        <span className="contact-item-action" aria-hidden="true">
                          →
                        </span>
                      </Tag>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        id="photos"
        className="plain-section"
        variant="fade-up"
      >
        <div className="container">
          <h2>Photos</h2>
          <p className="muted">
            Glimpses from conferences, field trips, and moments that keep me
            inspired.
          </p>
        </div>
        <div className="full-bleed">
          <div
            className="marquee photos-marquee"
            aria-label="Personal photos scrolling"
          >
            <div className="marquee__track">
              {PHOTOS.map((photo) => (
                <figure key={photo.title}>
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    width={720}
                    height={480}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 720px"
                  />
                  <figcaption>
                    <div>{photo.title}</div>
                    <div>{photo.subtitle}</div>
                  </figcaption>
                </figure>
              ))}
              {PHOTOS.map((photo) => (
                <figure key={`${photo.title}-duplicate`} aria-hidden="true">
                  <Image
                    src={photo.src}
                    alt=""
                    width={720}
                    height={480}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 720px"
                  />
                  <figcaption aria-hidden="true">
                    <div>{photo.title}</div>
                    <div>{photo.subtitle}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </>
  );
}
