import type { LocalizedString } from "@/lib/i18n-content";

export const TABLES_FEATURED_COPY: Record<
  string,
  { description: LocalizedString; alt: LocalizedString }
> = {
  "The Arden Dining Table": {
    description: {
      en: "A round travertine top on a sculpted walnut base — made for long dinners and the conversations that follow.",
      ar: "سطح ترافرتين دائري على قاعدة جوز منحوتة — للعشاء الطويل والحوار الذي يليه.",
    },
    alt: {
      en: "The Arden round dining table",
      ar: "طاولة أردن للطعام المستديرة",
    },
  },
  "The Marais Sideboard": {
    description: {
      en: "Generous storage behind hand-finished walnut doors. A quiet anchor for dining rooms and open living spaces.",
      ar: "تخزين واسع خلف أبواب جوز منتهية يدوياً. ركيزة هادئة لغرف الطعام والمساحات المفتوحة.",
    },
    alt: {
      en: "The Marais wood sideboard",
      ar: "خزانة ماريه من الخشب",
    },
  },
  "The Lenoir Console": {
    description: {
      en: "Travertine slab and hammered metal legs in a slim profile — for entryways, halls, and layered vignettes.",
      ar: "لوح ترافرتين وأرجل معدنية مطرقة بخط رفيع — للمداخل والممرات والتنسيقات المتعددة.",
    },
    alt: {
      en: "The Lenoir console table",
      ar: "طاولة كونسول لينوار",
    },
  },
  "The Rivo Dining Table": {
    description: {
      en: "An oval travertine top with a grounded pedestal base — sculptural presence for eight or more.",
      ar: "سطح ترافرتين بيضاوي على قاعدة عمودية ثابتة — حضور نحتي لثمانية ضيوف أو أكثر.",
    },
    alt: {
      en: "The Rivo oval dining table",
      ar: "طاولة طعام ريفو البيضاوية",
    },
  },
};
