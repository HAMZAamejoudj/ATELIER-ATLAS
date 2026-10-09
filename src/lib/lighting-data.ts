export const LIGHTING_BREADCRUMB = [
  { href: "/", label: "Home" },
  { href: "/lighting", label: "Lighting" },
] as const;

export const LIGHTING_SUBCATEGORIES = [
  {
    href: "/lighting#indoor-pendants",
    label: "Indoor Pendants",
    tagline: "Statement Above",
    image: "/images/lighting/sub-indoor-pendants.png",
    alt: "Woven pendant light over a dining table",
  },
  {
    href: "/lighting#table-lamps",
    label: "Table Lamps",
    tagline: "Warmth Within",
    image: "/images/lighting/product-luca-table-lamp.png",
    alt: "Ceramic table lamp on a side table",
  },
  {
    href: "/lighting#wall-sconces",
    label: "Wall Sconces",
    tagline: "Refined Details",
    image: "/images/lighting/product-marin-sconce.png",
    alt: "Bronze wall sconce with soft glow",
  },
  {
    href: "/lighting#floor-lamps",
    label: "Floor Lamps",
    tagline: "Sculptural & Versatile",
    image: "/images/lighting/product-soren-floor-lamp.png",
    alt: "Sculptural floor lamp with linen shade",
  },
  {
    href: "/lighting#outdoor-lanterns",
    label: "Outdoor Lanterns",
    tagline: "Made for the Elements",
    image: "/images/lighting/product-solara-lantern.png",
    alt: "Ceramic outdoor lantern",
  },
  {
    href: "/lighting#courtyard",
    label: "Courtyard Lighting",
    tagline: "Outdoor Atmosphere",
    image: "/images/lighting/hero-lighting-outdoor.png",
    alt: "Courtyard dining lit at twilight",
  },
] as const;

export const LIGHTING_FILTERS = [
  "Category",
  "Style",
  "Material",
  "Color",
  "Location",
  "Price",
] as const;

export const LIGHTING_FEATURED = [
  {
    name: "Rivo Pendant",
    priceUsd: 1850,
    description:
      "A travertine pendant with a quiet, sculptural presence. Hung over a table, it gathers light — and people — at the center of the room.",
    image: "/images/lighting/product-rivo-pendant.png",
    heroImage: "/images/lighting/sub-indoor-pendants.png",
    alt: "Rivo travertine pendant light",
  },
  {
    name: "Luca Table Lamp",
    priceUsd: 680,
    description:
      "Hand-finished ceramic and a linen shade. A lamp that warms a bedside, a desk, or the corner you return to at the end of the day.",
    image: "/images/lighting/product-luca-table-lamp.png",
    heroImage: "/images/lighting/product-luca-table-lamp.png",
    heroClassName: "object-contain object-right",
    alt: "Luca ceramic table lamp",
  },
  {
    name: "Marin Wall Sconce",
    priceUsd: 420,
    description:
      "A bronze sconce with a soft, considered glow. The detail that finishes a hallway, a dining wall, or a reading nook.",
    image: "/images/lighting/product-marin-sconce.png",
    heroImage: "/images/lighting/product-marin-sconce.png",
    heroClassName: "object-contain object-right",
    alt: "Marin bronze wall sconce",
  },
  {
    name: "Soren Floor Lamp",
    priceUsd: 1250,
    description:
      "A sculptural floor lamp in linen and wood. Light you can move with the evening — from conversation to quiet.",
    image: "/images/lighting/product-soren-floor-lamp.png",
    heroImage: "/images/lighting/product-soren-floor-lamp.png",
    heroClassName: "object-contain object-right",
    alt: "Soren floor lamp with linen shade",
  },
  {
    name: "Solara Outdoor Lantern",
    priceUsd: 340,
    description:
      "Ceramic made for the elements. For courtyards, terraces, and the hours after sunset you want to keep.",
    image: "/images/lighting/product-solara-lantern.png",
    heroImage: "/images/lighting/hero-lighting-outdoor.png",
    alt: "Solara outdoor ceramic lantern",
  },
] as const;

export type LightingProduct = {
  href: string;
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  swatches: string[];
  material: string;
};

export const LIGHTING_PRODUCTS: LightingProduct[] = [
  {
    href: "/lighting",
    name: "Rivo Pendant",
    priceUsd: 1850,
    image: "/images/lighting/product-rivo-pendant.png",
    alt: "Rivo travertine pendant light",
    swatches: ["#e8dfd0", "#c9bfb0", "#a89888", "#7a6f63"],
    material: "Travertine +3",
  },
  {
    href: "/lighting",
    name: "Luca Table Lamp",
    priceUsd: 680,
    image: "/images/lighting/product-luca-table-lamp.png",
    alt: "Luca ceramic table lamp",
    swatches: ["#f5f0e8", "#d9cfc0", "#b8a99a"],
    material: "Ceramic +2",
  },
  {
    href: "/lighting",
    name: "Marin Wall Sconce",
    priceUsd: 420,
    image: "/images/lighting/product-marin-sconce.png",
    alt: "Marin bronze wall sconce",
    swatches: ["#c4a882", "#8a7058"],
    material: "Bronze +1",
  },
  {
    href: "/lighting",
    name: "Soren Floor Lamp",
    priceUsd: 1250,
    image: "/images/lighting/product-soren-floor-lamp.png",
    alt: "Soren floor lamp with linen shade",
    swatches: ["#ebe4d8", "#c8baa8", "#9a8b7a", "#706658"],
    material: "Linen +3",
  },
  {
    href: "/lighting",
    name: "Cielo Pendant",
    priceUsd: 1150,
    image: "/images/products/product-odette-lamp.png",
    alt: "Cielo ceramic pendant",
    swatches: ["#f0ebe3", "#d4c8b8", "#a09080", "#6b5344"],
    material: "Ceramic +4",
  },
  {
    href: "/lighting",
    name: "Vale Table Lamp",
    priceUsd: 780,
    image: "/images/lighting/product-luca-table-lamp.png",
    alt: "Vale travertine table lamp",
    swatches: ["#e5ddd2", "#c0b4a4"],
    material: "Travertine +2",
  },
  {
    href: "/lighting",
    name: "Towa Wall Sconce",
    priceUsd: 380,
    image: "/images/lighting/product-marin-sconce.png",
    alt: "Towa ceramic wall sconce",
    swatches: ["#ddd4c8", "#b0a090", "#887868"],
    material: "Ceramic +3",
  },
  {
    href: "/lighting",
    name: "Orin Floor Lamp",
    priceUsd: 1450,
    image: "/images/lighting/product-soren-floor-lamp.png",
    alt: "Orin walnut floor lamp",
    swatches: ["#8b7355", "#5c4a38", "#3a2e24"],
    material: "Walnut +3",
  },
  {
    href: "/lighting",
    name: "Solara Outdoor Lantern",
    priceUsd: 340,
    image: "/images/lighting/product-solara-lantern.png",
    alt: "Solara outdoor ceramic lantern",
    swatches: ["#d9cfc0", "#a89888"],
    material: "Ceramic +2",
  },
  {
    href: "/lighting",
    name: "Vale Table Light",
    priceUsd: 720,
    image: "/images/products/product-odette-lamp.png",
    alt: "Vale table light",
    swatches: ["#e8dfd0", "#c4b8a8"],
    material: "Travertine +2",
  },
  {
    href: "/lighting",
    name: "Luma Outdoor Lantern",
    priceUsd: 420,
    image: "/images/lighting/product-solara-lantern.png",
    alt: "Luma outdoor lantern",
    swatches: ["#f5f0e8", "#c9bfb0"],
    material: "Ceramic +2",
  },
  {
    href: "/lighting",
    name: "Rhea Courtyard Pendant",
    priceUsd: 1050,
    image: "/images/lighting/product-rivo-pendant.png",
    alt: "Rhea courtyard pendant",
    swatches: ["#c4a882", "#8a7058", "#4a3c30"],
    material: "Bronze +3",
  },
];

export const LIGHTING_INSPIRE = [
  {
    href: "/blog",
    label: "Patios & Terraces",
    image: "/images/lighting/hero-lighting-outdoor.png",
    alt: "Patio dining with pendant lights at dusk",
  },
  {
    href: "/blog",
    label: "Entryways",
    image: "/images/rooms/room-living.png",
    alt: "Entryway with wall sconce",
  },
  {
    href: "/blog",
    label: "Dining Rooms",
    image: "/images/rooms/room-dining.png",
    alt: "Dining room with statement pendant",
  },
  {
    href: "/blog",
    label: "Bedrooms",
    image: "/images/rooms/room-bedroom.png",
    alt: "Bedroom with table lamps",
  },
] as const;
