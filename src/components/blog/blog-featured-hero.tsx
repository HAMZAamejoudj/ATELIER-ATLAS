import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getBlogIndexPrimary } from "@/lib/blog-data";
import { getLocale } from "@/lib/get-locale";

export async function BlogFeaturedHero() {
  const locale = await getLocale();
  const t = await getTranslations("blog.list");
  const primary = getBlogIndexPrimary(locale);

  return (
    <section className="bg-atlas-cream">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Link
          href={`/blog/${primary.slug}`}
          className="group flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-atlas-charcoal/55">
            {t("featuredEyebrow")}
          </p>
          <h2 className="mt-4 font-serif text-[1.85rem] font-semibold leading-[1.1] text-atlas-charcoal sm:text-[2.15rem] lg:text-[2.35rem]">
            {primary.title}
          </h2>
          <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-atlas-charcoal/82">
            {primary.excerpt}
          </p>
          <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-atlas-charcoal/30 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-opacity group-hover:opacity-60">
            {t("readStory")}
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
        <Link
          href={`/blog/${primary.slug}`}
          className="relative block min-h-[16rem] sm:min-h-[20rem] lg:min-h-full"
        >
          <Image
            src={primary.image}
            alt={primary.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        </Link>
      </div>
    </section>
  );
}
