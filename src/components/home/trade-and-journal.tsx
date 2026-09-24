import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const JOURNAL_POSTS = [
  {
    slug: "the-power-of-patina",
    title: "The Power of Patina",
    excerpt: "Why time makes things more beautiful.",
    image: "/images/journal/journal-patina.png",
    alt: "Ceramic vessels with natural patina",
  },
  {
    slug: "a-home-in-harmony",
    title: "A Home in Harmony",
    excerpt: "Nature as a design partner.",
    image: "/images/journal/journal-harmony.png",
    alt: "Green hills landscape",
  },
  {
    slug: "collected-not-curated",
    title: "Collected, Not Curated",
    excerpt: "On surrounding yourself with meaning.",
    image: "/images/journal/journal-collected.png",
    alt: "Books and objects on a shelf",
  },
] as const;

export function TradeAndJournal() {
  return (
    <section className="flex flex-col lg:flex-row" aria-label="Trade program and journal">
      <div className="flex min-h-[22rem] w-full flex-col bg-[#f9f8f3] sm:min-h-0 sm:flex-row lg:w-1/2">
        <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
          <h2 className="font-serif text-2xl font-semibold uppercase tracking-[0.06em] text-atlas-charcoal sm:text-3xl">
            Trade Program
          </h2>
          <p className="mt-4 max-w-xs font-serif text-base font-medium leading-relaxed text-atlas-charcoal/85 sm:text-lg">
            Thoughtful partnerships for inspired spaces.
          </p>
          <Link
            href="/contact#trade"
            className="mt-8 inline-flex w-fit items-center gap-2 border border-atlas-charcoal/80 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-colors hover:bg-atlas-charcoal/5"
          >
            Learn more
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:h-auto sm:min-h-[22rem] sm:w-[42%] sm:shrink-0 lg:min-h-[26rem] lg:w-[45%]">
          <Image
            src="/images/trade/trade-program.png"
            alt="Trade program interior with desk and lamp"
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, 22vw"
          />
        </div>
      </div>

      <div
        className="w-full bg-[#3e232e] px-6 py-12 text-white sm:px-8 sm:py-14 lg:w-1/2 lg:px-10 lg:py-16"
        aria-labelledby="atlas-journal-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="atlas-journal-heading"
              className="font-serif text-2xl font-semibold uppercase tracking-[0.06em] sm:text-3xl"
            >
              The Atlas Journal
            </h2>
            <p className="mt-2 font-serif text-sm font-medium text-white/85 sm:text-base">
              Ideas, interiors and a more considered way of living.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 self-start text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-70 sm:self-auto sm:text-xs"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-4 lg:mt-10 lg:gap-5">
          {JOURNAL_POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/20">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 90vw, 16vw"
                  />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold leading-snug text-white sm:text-[1.05rem]">
                  {post.title}
                </h3>
                <p className="mt-1.5 font-serif text-sm font-medium text-white/75">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
