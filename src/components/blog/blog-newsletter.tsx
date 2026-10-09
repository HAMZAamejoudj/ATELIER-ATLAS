import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Input } from "@/components/ui/input";

export async function BlogNewsletter() {
  const t = await getTranslations("blog.newsletter");

  return (
    <section
      className="bg-[#f9f8f3] py-14 sm:py-16"
      aria-labelledby="blog-newsletter-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 text-center sm:px-6 lg:px-10">
        <h2
          id="blog-newsletter-heading"
          className="font-serif text-2xl font-semibold text-atlas-charcoal sm:text-[1.75rem]"
        >
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-atlas-charcoal/75 sm:text-base">
          {t("description")}
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          action="#"
          method="post"
        >
          <Input
            type="email"
            name="email"
            placeholder={t("placeholder")}
            autoComplete="email"
            className="h-11 flex-1 rounded-none border-atlas-charcoal/20 bg-white text-sm"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 bg-[#2c3d32] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
          >
            {t("signUp")}
            <ArrowRight className="size-3.5" />
          </button>
        </form>
        <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-atlas-charcoal/45">
          {t("tagline")}
        </p>
      </div>
    </section>
  );
}
