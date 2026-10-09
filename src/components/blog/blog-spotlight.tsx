import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getBlogSpotlight } from "@/lib/blog-data";
import { getLocale } from "@/lib/get-locale";

export async function BlogSpotlight() {
  const locale = await getLocale();
  const t = await getTranslations("blog.spotlight");
  const post = getBlogSpotlight(locale);

  return (
    <section className="bg-[#2c3d32] text-white" aria-labelledby="blog-spotlight-heading">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
        <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem]">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
            {t("eyebrow")}
          </p>
          <h2
            id="blog-spotlight-heading"
            className="mt-4 font-serif text-[1.75rem] font-semibold leading-[1.12] sm:text-[2rem]"
          >
            {post.title}
          </h2>
          <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-white/85">
            {post.excerpt}
          </p>
          <Link
            href={`/blog/${post.slug}`}
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-white/60 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:opacity-80"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
