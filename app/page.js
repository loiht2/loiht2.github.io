import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/reveal-on-scroll";
import TypewriterRole from "@/components/typewriter-role";

const PHOTOS = [
  {
    src: "/assets/images/rev-ecit-2023.jpg",
    title: "REV-ECIT 2023",
    subtitle: "Dec 2023",
  },
  {
    src: "/assets/images/vnu-uet-2024.jpg",
    title: "VNU University of Engineering and Technology",
    subtitle: "July 2024",
  },
  {
    src: "/assets/images/buon-ma-thuot-2024.jpg",
    title: "Buon Ma Thuot, DakLak, Vietnam",
    subtitle: "Sep 2024",
  },
  {
    src: "/assets/images/nui-coc-lake-2024.jpg",
    title: "Nui Coc Lake Tourist Area, Thai Nguyen, Viet Nam",
    subtitle: "Oct 2024",
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
            Read my writing
          </Link>
          <Link className="btn secondary" href="/projects">
            See my work
          </Link>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" variant="fade-up">
        <div className="container grid cols-2">
          <RevealOnScroll as="div" variant="fade-right" once={false}>
            <h2>Bio</h2>
            <p>
              I’m Thanh‑Loi Hoang. I enjoy designing and operating cloud‑native
              systems, and building practical ML platforms on Kubernetes.
            </p>
            <p>
              Current interests include MLOps tooling, scheduling AI/ML
              workloads, and platform reliability.
            </p>
          </RevealOnScroll>
          <RevealOnScroll as="div" className="card" variant="fade-left" once={false}>
            <h3>Skills</h3>
            <ul>
              <li>Kubernetes, Docker</li>
              <li>Python, Go, Bash Script</li>
              <li>C/C++, JavaScript</li>
              <li>Cloud‑Native, MLOps</li>
            </ul>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="photos" variant="fade-up">
        <div className="container">
          <h2>Photos</h2>
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
