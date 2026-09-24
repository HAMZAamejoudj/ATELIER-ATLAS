import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative min-h-[calc(100vh-8.5rem)] w-full overflow-hidden lg:min-h-[calc(100vh-9.5rem)]">
      <Image
        src="/images/hero-home.png"
        alt="Sculptural living room with curved velvet seating and travertine coffee table"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10"
        aria-hidden
      />

      <div className="relative mx-auto flex h-full min-h-[inherit] max-w-[1600px] flex-col justify-center px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl text-white">
            <p className="font-serif text-base italic text-white/90 sm:text-lg md:text-xl">
              Objects for a more human tomorrow.
            </p>
            <h1 className="mt-5 max-w-[14ch] font-serif text-[2.65rem] leading-[1.04] tracking-tight sm:text-6xl sm:max-w-none md:text-7xl lg:text-[5.35rem] lg:leading-[1.02] xl:text-[5.85rem]">
              Furniture with a longer horizon.
            </h1>
            <Link
              href="/seating"
              className="mt-8 inline-flex items-center gap-2 bg-atlas-burgundy px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-atlas-burgundy-light"
            >
              Explore the collection
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <div className="hidden items-end gap-4 lg:flex">
            <span className="mb-1 h-24 w-px bg-white/50" aria-hidden />
            <p className="max-w-[10rem] pb-1 text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-white/90">
              Spaces shaped by time, not trends.
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-xs text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-white/85 lg:hidden">
          Spaces shaped by time, not trends.
        </p>
      </div>
    </section>
  );
}
