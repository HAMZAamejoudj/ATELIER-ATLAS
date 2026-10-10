import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const MATERIAL_KEYS = [
  "oak",
  "walnut",
  "travertine",
  "marble",
  "linen",
  "boucle",
  "leather",
  "brass",
  "ceramic",
  "wool",
] as const;

const MATERIAL_IMAGES: Record<
  (typeof MATERIAL_KEYS)[number],
  string
> = {
  oak: "/images/materials/material-oak.png",
  walnut: "/images/materials/material-walnut.png",
  travertine: "/images/materials/material-travertine.png",
  marble: "/images/materials/material-marble.png",
  linen: "/images/materials/material-linen.png",
  boucle: "/images/materials/material-boucle.png",
  leather: "/images/materials/material-leather.png",
  brass: "/images/materials/material-brass.png",
  ceramic: "/images/materials/material-ceramic.png",
  wool: "/images/materials/material-wool.png",
};

export async function MaterialLibrary() {
  const t = await getTranslations("home.materialLibrary");

  const materials = MATERIAL_KEYS.map((key) => ({
    key,
    label: t(`materials.${key}`),
    image: MATERIAL_IMAGES[key],
    alt: t(`materialAlts.${key}`),
  }));

  return (
    <section
      className="bg-[#f9f8f3] py-14 sm:py-16 lg:py-20"
      aria-labelledby="material-library-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <h2
            id="material-library-heading"
            className="font-serif text-3xl font-bold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.35rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-2 font-serif text-base font-medium text-atlas-charcoal/85 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <ul
          className="mt-10 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 lg:mt-12 lg:grid lg:grid-cols-10 lg:gap-3 lg:overflow-visible lg:pb-0 xl:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {materials.map((material) => (
            <li
              key={material.key}
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
              <p className="mt-3 text-center font-serif text-xs font-bold uppercase tracking-[0.12em] text-atlas-charcoal sm:text-[13px]">
                {material.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60 sm:text-xs"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
