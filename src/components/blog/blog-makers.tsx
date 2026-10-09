import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BLOG_MAKERS } from "@/lib/blog-data";

export async function BlogMakers() {
  const t = await getTranslations("blog.makers");

  return (
    <section
      className="bg-[#f9f8f3] py-10 sm:py-12"
      aria-labelledby="blog-makers-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="shrink-0 lg:max-w-[14rem]">
            <h2
              id="blog-makers-heading"
              className="font-serif text-xl font-semibold text-atlas-charcoal sm:text-2xl"
            >
              {t("title")}
            </h2>
            <p className="mt-3 font-serif text-sm leading-relaxed text-atlas-charcoal/75">
              {t("description")}
            </p>
            <Link
              href="/blog/the-hands-behind-the-heirloom"
              className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal hover:opacity-60"
            >
              {t("cta")}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {BLOG_MAKERS.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-[#f0ebe3]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 45vw, 12vw"
                    />
                  </div>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal">
                    {item.title}
                  </p>
                  <p className="mt-1 font-serif text-xs text-atlas-charcoal/65">
                    {item.subtitle}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
