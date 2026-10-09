import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function RoomsWithPurpose() {
  const t = await getTranslations("home.rooms");

  const rooms = [
    {
      label: t("livingRoom"),
      href: "/seating",
      image: "/images/rooms/room-living.png",
      alt: t("alts.living"),
    },
    {
      label: t("diningRoom"),
      href: "/tables-consoles",
      image: "/images/rooms/room-dining.png",
      alt: t("alts.dining"),
    },
    {
      label: t("bedroom"),
      href: "/decor",
      image: "/images/rooms/room-bedroom.png",
      alt: t("alts.bedroom"),
    },
    {
      label: t("workspace"),
      href: "/lighting",
      image: "/images/rooms/room-workspace.png",
      alt: t("alts.workspace"),
    },
  ];

  return (
    <section
      className="border-y border-atlas-charcoal/10"
      aria-labelledby="rooms-with-purpose-heading"
    >
      <div
        className="flex h-[19rem] snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:h-[20rem] lg:grid lg:h-[clamp(17.5rem,22vw,23rem)] lg:grid-cols-5 lg:snap-none lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="relative flex h-full min-w-[70vw] shrink-0 snap-start flex-col justify-center gap-6 border-r border-white/15 bg-[#3f4a38] px-7 py-8 text-white sm:min-w-[38%] sm:gap-7 sm:px-9 sm:py-9 lg:min-w-0 lg:justify-between lg:gap-0 lg:px-9 lg:py-10 xl:px-10"
        >
          <div>
            <h2
              id="rooms-with-purpose-heading"
              className="font-serif text-[1.65rem] font-semibold uppercase leading-[1.08] tracking-[0.06em] sm:text-3xl lg:text-[1.85rem] xl:text-[2rem]"
            >
              {t("titleLine1")}
              <span className="block">{t("titleLine2")}</span>
            </h2>
            <p className="mt-4 max-w-[14rem] font-serif text-sm leading-relaxed text-white/90 sm:text-base">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 border border-white/85 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        {rooms.map((room) => (
          <Link
            key={room.label}
            href={room.href}
            className="group relative block h-full min-w-[46vw] shrink-0 snap-start border-r border-white/15 last:border-r-0 sm:min-w-[28%] lg:min-w-0"
          >
            <Image
              src={room.image}
              alt={room.alt}
              fill
              className="object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 72vw, 20vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
              aria-hidden
            />
            <p
              className="absolute inset-x-0 bottom-0 px-2 pb-4 text-center font-serif text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:pb-5 sm:text-xs"
            >
              {room.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
