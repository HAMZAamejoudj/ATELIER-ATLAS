import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BLOG_FILTER_TOPICS, type BlogTopic } from "@/lib/blog-data";
import { Input } from "@/components/ui/input";

const TOPIC_KEYS: Record<
  BlogTopic,
  "craft" | "materials" | "spaces" | "people" | "ideas" | "travel" | "interiors"
> = {
  Craft: "craft",
  Materials: "materials",
  Spaces: "spaces",
  People: "people",
  Ideas: "ideas",
  Travel: "travel",
  Interiors: "interiors",
};

export async function BlogFilterBar() {
  const t = await getTranslations("blog.filters");

  return (
    <div className="sticky top-0 z-20 bg-atlas-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BLOG_FILTER_TOPICS.map((topic, index) => (
            <button
              key={topic}
              type="button"
              className={
                index === 0
                  ? "shrink-0 bg-atlas-charcoal px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
                  : "shrink-0 border border-atlas-charcoal/15 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-atlas-charcoal hover:border-atlas-charcoal/35"
              }
            >
              {topic === "All"
                ? t("allArticles")
                : t(`topics.${TOPIC_KEYS[topic]}`)}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs shrink-0 lg:w-56">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-atlas-charcoal/40"
            aria-hidden
          />
          <Input
            type="search"
            name="q"
            placeholder={t("searchPlaceholder")}
            className="h-10 rounded-none border-atlas-charcoal/15 bg-white pl-9 text-sm placeholder:text-atlas-charcoal/40"
            aria-label={t("searchAria")}
          />
        </div>
      </div>
    </div>
  );
}
