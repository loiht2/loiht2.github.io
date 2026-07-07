import Image from "next/image";
import { PHOTOS } from "@/content/photos";

export default function PhotoGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PHOTOS.map((p) => (
        <li key={p.src} className="relative overflow-hidden rounded-xl border border-line">
          <figure className="group relative overflow-hidden">
            <Image
              src={p.src}
              alt={p.caption}
              width={480}
              height={360}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6 text-[11px] leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {p.caption} · {p.date}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
