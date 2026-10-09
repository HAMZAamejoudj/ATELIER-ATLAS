import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DECOR_REFLECTIVE } from "@/lib/decor-data";

export async function DecorReflectiveSpaces() {
  const t = await getTranslations("decor.reflectiveSpaces");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-[#2a2622] text-white"
      aria-labelledby="decor-reflective-heading"
    >
      <div className="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <h2
            id="decor-reflective-heading"
            className="font-serif text-[1.85rem] font-semibold leading-[1.12] tracking-tight sm:text-[2.15rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md font-serif text-base leading-relaxed text-white/80">
            {t("description")}
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-white/70 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-75"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
          {DECOR_REFLECTIVE.map((item) => (
            <li key={item.label} className="bg-[#2a2622]">
              <Link href={item.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="font-serif text-sm font-semibold sm:text-[15px]">
                      {item.label}
                    </p>
                    <p className="mt-1 font-serif text-xs leading-relaxed text-white/75 sm:text-[13px]">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
