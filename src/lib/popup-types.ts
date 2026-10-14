export interface PopupConfig {
  enabled: boolean;
  badgeEn: string;
  badgeAr: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  discountCode?: string;
  discountPercent?: string;
  buttonTextEn: string;
  buttonTextAr: string;
  buttonLink: string;
  dismissTextEn: string;
  dismissTextAr: string;
  image: string;
  delaySeconds: number;
  frequency: "session" | "weekly" | "always";
}

export const DEFAULT_POPUP_CONFIG: PopupConfig = {
  enabled: true,
  badgeEn: "Privilege Invitation",
  badgeAr: "دعوة خاصة وحصرية",
  titleEn: "Enjoy 10% Off Your First Handcrafted Piece",
  titleAr: "استمتع بخصم 10% على أول قطعة مصنوعة يدويًا",
  descriptionEn:
    "Join the Moroccan Travertine circle for early access to limited editions, private workshop releases, and architectural stories from Marrakech.",
  descriptionAr:
    "انضم إلى مجتمع موروكان ترافرتين للحصول على أسبقية الوصول للقطع الحصرية والإصدارات المحدودة لورشة مراكش.",
  discountCode: "",
  discountPercent: "",
  buttonTextEn: "Explore Collection",
  buttonTextAr: "استكشاف المجموعة",
  buttonLink: "/seating",
  dismissTextEn: "Continue browsing",
  dismissTextAr: "متابعة التصفح",
  image: "/images/hero-home.png",
  delaySeconds: 4,
  frequency: "session",
};
