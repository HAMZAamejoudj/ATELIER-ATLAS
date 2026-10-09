import { SEATING_FEATURED, SEATING_SUBCATEGORIES } from "@/lib/seating-data";
import { SEATING_FEATURED_COPY } from "@/lib/seating-featured-copy";
import { TABLES_FEATURED, TABLES_SUBCATEGORIES } from "@/lib/tables-data";
import { TABLES_FEATURED_COPY } from "@/lib/tables-featured-copy";
import { LIGHTING_FEATURED, LIGHTING_SUBCATEGORIES } from "@/lib/lighting-data";
import { LIGHTING_FEATURED_COPY } from "@/lib/lighting-featured-copy";
import { MIRRORS_FEATURED, MIRRORS_TYPES } from "@/lib/mirrors-data";
import { MIRRORS_FEATURED_COPY } from "@/lib/mirrors-featured-copy";
import { DECOR_FEATURED } from "@/lib/decor-featured";
import { DECOR_CATEGORIES } from "@/lib/decor-data";
import { DECOR_FEATURED_COPY } from "@/lib/decor-featured-copy";

export interface HeroSlideItem {
  name: string;
  priceUsd: number;
  image: string;
  heroImage: string;
  altEn: string;
  altAr: string;
  descriptionEn: string;
  descriptionAr: string;
  heroClassName?: string;
}

export interface SubcategoryItem {
  href: string;
  labelEn: string;
  labelAr: string;
  taglineEn?: string;
  taglineAr?: string;
  image: string;
  altEn?: string;
  altAr?: string;
}

export interface HomeHeroConfig {
  titleEn: string;
  titleAr: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaLink: string;
  image: string;
  imageAltEn: string;
  imageAltAr: string;
}

export interface CollectionSectionData {
  heroSlides: HeroSlideItem[];
  subcategories: SubcategoryItem[];
}

export interface AllSectionsConfig {
  homeHero: HomeHeroConfig;
  seating: CollectionSectionData;
  tables: CollectionSectionData;
  lighting: CollectionSectionData;
  mirrors: CollectionSectionData;
  decor: CollectionSectionData;
}

export function getDefaultSectionsConfig(): AllSectionsConfig {
  return {
    homeHero: {
      titleEn: "Sculptural Living, Made by Hand in Marrakech",
      titleAr: "حياة منحوتة، صُنعت يدويًا في مراكش",
      ctaTextEn: "Explore Seating",
      ctaTextAr: "استكشف المقاعد",
      ctaLink: "/seating",
      image: "/images/hero-home.png",
      imageAltEn: "Living space with handmade Moroccan furniture",
      imageAltAr: "مساحة معيشة بأثاث مغربي مصنوع يدوياً",
    },
    seating: {
      heroSlides: SEATING_FEATURED.map((p) => {
        const copy = SEATING_FEATURED_COPY[p.name];
        return {
          name: p.name,
          priceUsd: p.priceUsd,
          image: p.image,
          heroImage: p.heroImage,
          altEn: copy?.alt?.en || p.alt,
          altAr: copy?.alt?.ar || p.alt,
          descriptionEn: copy?.description?.en || p.description,
          descriptionAr: copy?.description?.ar || p.description,
          heroClassName: (p as any).heroClassName,
        };
      }),
      subcategories: SEATING_SUBCATEGORIES.map((s) => ({
        href: s.href,
        labelEn: s.label,
        labelAr:
          s.label === "Sofas"
            ? "أرائك"
            : s.label === "Loveseats"
              ? "أرائك ثنائية"
              : s.label === "Armchairs"
                ? "كراسي بذراعين"
                : s.label === "Ottomans"
                  ? "مساند للقدمين"
                  : "كراسي طعام",
        image: s.image,
        altEn: s.alt,
        altAr: s.alt,
      })),
    },
    tables: {
      heroSlides: TABLES_FEATURED.map((p) => {
        const copy = TABLES_FEATURED_COPY[p.name];
        return {
          name: p.name,
          priceUsd: p.priceUsd,
          image: p.image,
          heroImage: p.heroImage,
          altEn: copy?.alt?.en || p.alt,
          altAr: copy?.alt?.ar || p.alt,
          descriptionEn: copy?.description?.en || p.description,
          descriptionAr: copy?.description?.ar || p.description,
          heroClassName: (p as any).heroClassName,
        };
      }),
      subcategories: TABLES_SUBCATEGORIES.map((s) => ({
        href: s.href,
        labelEn: s.label,
        labelAr:
          s.label === "Dining Tables"
            ? "طاولات طعام"
            : s.label === "Console Tables"
              ? "طاولات كونسول"
              : s.label === "Sideboards"
                ? "خزائن جانبية"
                : s.label === "Coffee Tables"
                  ? "طاولات قهوة"
                  : "طاولات جانبية",
        image: s.image,
        altEn: s.alt,
        altAr: s.alt,
      })),
    },
    lighting: {
      heroSlides: LIGHTING_FEATURED.map((p) => {
        const copy = LIGHTING_FEATURED_COPY[p.name];
        return {
          name: p.name,
          priceUsd: p.priceUsd,
          image: p.image,
          heroImage: p.heroImage,
          altEn: copy?.alt?.en || p.alt,
          altAr: copy?.alt?.ar || p.alt,
          descriptionEn: copy?.description?.en || p.description,
          descriptionAr: copy?.description?.ar || p.description,
          heroClassName: (p as any).heroClassName,
        };
      }),
      subcategories: LIGHTING_SUBCATEGORIES.map((s) => ({
        href: s.href,
        labelEn: s.label,
        labelAr:
          s.label === "Indoor Pendants"
            ? "معلقات داخلية"
            : s.label === "Table Lamps"
              ? "مصابيح طاولة"
              : s.label === "Wall Sconces"
                ? "مصابيح جدارية"
                : s.label === "Floor Lamps"
                  ? "مصابيح أرضية"
                  : s.label === "Outdoor Lanterns"
                    ? "فوانيس خارجية"
                    : "إضاءة الفناء",
        taglineEn: s.tagline,
        taglineAr: s.tagline,
        image: s.image,
        altEn: s.alt,
        altAr: s.alt,
      })),
    },
    mirrors: {
      heroSlides: MIRRORS_FEATURED.map((p) => {
        const copy = MIRRORS_FEATURED_COPY[p.name];
        return {
          name: p.name,
          priceUsd: p.priceUsd,
          image: p.image,
          heroImage: p.heroImage,
          altEn: copy?.alt?.en || p.alt,
          altAr: copy?.alt?.ar || p.alt,
          descriptionEn: copy?.description?.en || p.description,
          descriptionAr: copy?.description?.ar || p.description,
          heroClassName: (p as any).heroClassName,
        };
      }),
      subcategories: MIRRORS_TYPES.map((s) => ({
        href: s.href,
        labelEn: s.label,
        labelAr:
          s.label === "Arched Mirrors"
            ? "مرايا مقوسة"
            : s.label === "Floor Mirrors"
              ? "مرايا أرضية"
              : s.label === "Wall Mirrors"
                ? "مرايا جدارية"
                : s.label === "Vanity Mirrors"
                  ? "مرايا التزيين"
                  : s.label === "Decorative Objects"
                    ? "تحف ديكورية"
                    : "حوامل شموع",
        image: s.image,
        altEn: s.alt,
        altAr: s.alt,
      })),
    },
    decor: {
      heroSlides: DECOR_FEATURED.map((p) => {
        const copy = DECOR_FEATURED_COPY[p.name];
        return {
          name: p.name,
          priceUsd: p.priceUsd,
          image: p.image,
          heroImage: p.heroImage,
          altEn: copy?.alt?.en || p.alt,
          altAr: copy?.alt?.ar || p.alt,
          descriptionEn: copy?.description?.en || p.description,
          descriptionAr: copy?.description?.ar || p.description,
          heroClassName: (p as any).heroClassName,
        };
      }),
      subcategories: DECOR_CATEGORIES.map((s) => ({
        href: s.href,
        labelEn: s.label,
        labelAr:
          s.label === "Mirrors"
            ? "مرايا"
            : s.label === "Wall Decor"
              ? "ديكور جداري"
              : s.label === "Vases"
                ? "مزهريات"
                : s.label === "Objects"
                  ? "قطع وتحف"
                  : s.label === "Trays"
                    ? "صواني"
                    : "حوامل شموع",
        image: s.image,
        altEn: s.alt,
        altAr: s.alt,
      })),
    },
  };
}

export function formatHeroSlides(slides: HeroSlideItem[]) {
  const products = slides.map((s) => ({
    name: s.name,
    priceUsd: s.priceUsd,
    description: s.descriptionEn,
    image: s.image,
    heroImage: s.heroImage,
    alt: s.altEn,
    heroClassName: s.heroClassName,
  }));

  const copy: Record<
    string,
    { description: { en: string; ar: string }; alt: { en: string; ar: string } }
  > = {};

  for (const s of slides) {
    copy[s.name] = {
      description: { en: s.descriptionEn, ar: s.descriptionAr },
      alt: { en: s.altEn, ar: s.altAr },
    };
  }

  return { products, copy };
}
