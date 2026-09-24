import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MATERIALS = [
  { label: "Oak", image: "/images/materials/material-oak.png", alt: "Oak wood grain" },
  {
    label: "Walnut",
    image: "/images/materials/material-walnut.png",
    alt: "Walnut wood grain",
  },
  {
    label: "Travertine",
    image: "/images/materials/material-travertine.png",
    alt: "Travertine stone",
  },
  {
    label: "Marble",
    image: "/images/materials/material-marble.png",
    alt: "Marble stone",
  },
  {
    label: "Linen",
    image: "/images/materials/material-linen.png",
    alt: "Linen fabric",
  },
  {
    label: "Bouclé",
    image: "/images/materials/material-boucle.png",
    alt: "Bouclé fabric",
  },
  {
    label: "Leather",
    image: "/images/materials/material-leather.png",
    alt: "Leather",
  },
  {
    label: "Brass",
    image: "/images/materials/material-brass.png",
    alt: "Brushed brass",
  },
  {
    label: "Ceramic",
    image: "/images/materials/material-ceramic.png",
    alt: "Ceramic glaze",
  },
  { label: "Wool", image: "/images/materials/material-wool.png", alt: "Wool textile" },
] as const;

export function MaterialLibrary() {
  return (
    <section
      className="bg-[#f9f8f3] py-14 sm:py-16 lg:py-20"
      aria-labelledby="material-library-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="material-library-heading"
              className="font-serif text-3xl font-semibold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.35rem]"
            >
              The Material Library
            </h2>
            <p className="mt-2 font-serif text-base font-medium text-atlas-charcoal/85 sm:text-lg">
              Extraordinary spaces begin with extraordinary materials.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex shrink-0 items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60 sm:self-auto sm:text-xs"
          >
            Explore our materials
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul
          className="mt-10 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 lg:mt-12 lg:grid lg:grid-cols-10 lg:gap-3 lg:overflow-visible lg:pb-0 xl:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {MATERIALS.map((material) => (
            <li
              key={material.label}
              className="w-[34vw] max-w-[8.5rem] shrink-0 sm:w-[22vw] sm:max-w-[9.5rem] lg:w-full lg:min-w-0 lg:max-w-none"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ebe6dc]">
                <Image
                  src={material.image}
                  alt={material.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 34vw, 10vw"
                />
              </div>
              <p className="mt-3 text-center font-serif text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal sm:text-xs">
                {material.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
