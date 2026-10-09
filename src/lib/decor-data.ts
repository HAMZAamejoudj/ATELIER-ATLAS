export const DECOR_BREADCRUMB = [
  { href: "/", label: "Home" },
  { href: "/decor", label: "Decor" },
] as const;

export const DECOR_CATEGORIES = [
  {
    href: "/decor#mirrors",
    label: "Mirrors",
    image: "/images/decor/product-sienna-mirror.png",
    alt: "Arched mirror in a sunlit room",
  },
  {
    href: "/decor#wall-decor",
    label: "Wall Decor",
    image: "/images/decor/cat-wall-decor.png",
    alt: "Textured wall art panel",
  },
  {
    href: "/decor#vases",
    label: "Vases",
    image: "/images/decor/product-cassia-vase.png",
    alt: "Group of ceramic vases",
  },
  {
    href: "/decor#objects",
    label: "Objects",
    image: "/images/decor/product-forma-object.png",
    alt: "Sculptural stone object",
  },
  {
    href: "/decor#trays",
    label: "Trays",
    image: "/images/decor/product-luca-tray.png",
    alt: "Marble serving tray",
  },
  {
    href: "/decor#candleholders",
    label: "Candleholders",
    image: "/images/decor/product-arden-candleholders.png",
    alt: "Brass candleholder set",
  },
] as const;

export const DECOR_FILTERS = [
  "Category",
  "Material",
  "Color",
  "Style",
  "Size",
  "Availability",
  "Price",
] as const;

export { DECOR_FEATURED } from "./decor-featured";

export type DecorProduct = {
  href: string;
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  swatches: string[];
  material: string;
};

export const DECOR_PRODUCTS: DecorProduct[] = [
  {
    href: "/decor",
    name: "The Sienna Mirror",
    priceUsd: 2450,
    image: "/images/decor/product-sienna-mirror.png",
    alt: "The Sienna Mirror",
    swatches: ["#c4a882", "#8a7058", "#4a3c30"],
    material: "Bronze +2",
  },
  {
    href: "/decor",
    name: "The Vale Mirror",
    priceUsd: 1980,
    image: "/images/decor/product-sienna-mirror.png",
    alt: "The Vale Mirror",
    swatches: ["#e8dfd0", "#c9bfb0", "#7a6f63"],
    material: "Travertine +3",
  },
  {
    href: "/decor",
    name: "The Cassia Vase",
    priceUsd: 420,
    image: "/images/decor/product-cassia-vase.png",
    alt: "The Cassia Vase",
    swatches: ["#d9cfc0", "#a89888", "#6b5344"],
    material: "Ceramic +2",
  },
  {
    href: "/decor",
    name: "The Forma Object",
    priceUsd: 380,
    image: "/images/decor/product-forma-object.png",
    alt: "The Forma Object",
    swatches: ["#ebe4d8", "#c8baa8", "#9a8b7a"],
    material: "Stone +1",
  },
  {
    href: "/decor",
    name: "The Luca Tray",
    priceUsd: 290,
    image: "/images/decor/product-luca-tray.png",
    alt: "The Luca Tray",
    swatches: ["#f5f0e8", "#e5ddd2"],
    material: "Marble",
  },
  {
    href: "/decor",
    name: "The Arden Candleholder Set",
    priceUsd: 340,
    image: "/images/decor/product-arden-candleholders.png",
    alt: "The Arden Candleholder Set",
    swatches: ["#c4a882", "#8a7058"],
    material: "Brass +1",
  },
  {
    href: "/decor",
    name: "The Nera Vase",
    priceUsd: 520,
    image: "/images/decor/product-cassia-vase.png",
    alt: "The Nera Vase",
    swatches: ["#3d3832", "#5c4f44", "#8a7f72"],
    material: "Ceramic +3",
  },
  {
    href: "/decor",
    name: "The Alba Bowl",
    priceUsd: 260,
    image: "/images/testimonial/testimonial-vase.png",
    alt: "The Alba Bowl",
    swatches: ["#f0ebe3", "#d4c8b8"],
    material: "Travertine",
  },
  {
    href: "/decor",
    name: "The Knot Object",
    priceUsd: 450,
    image: "/images/decor/product-forma-object.png",
    alt: "The Knot Object",
    swatches: ["#8b7355", "#5c4a38"],
    material: "Walnut +2",
  },
  {
    href: "/decor",
    name: "The Elio Mirror",
    priceUsd: 2120,
    image: "/images/decor/product-sienna-mirror.png",
    alt: "The Elio Mirror",
    swatches: ["#c9bfb0", "#706658", "#3a2e24"],
    material: "Bronze +2",
  },
];

export const DECOR_REFLECTIVE = [
  {
    href: "/blog",
    label: "Hallway",
    caption: "A welcoming first impression.",
    image: "/images/decor/inspire-hallway.png",
    alt: "Hallway with arched mirror",
  },
  {
    href: "/blog",
    label: "Powder Room",
    caption: "Add depth and drama.",
    image: "/images/rooms/room-bedroom.png",
    alt: "Powder room with mirror",
  },
  {
    href: "/blog",
    label: "Bedroom",
    caption: "Soft light, a calmer space.",
    image: "/images/rooms/room-bedroom.png",
    alt: "Bedroom with mirror",
  },
  {
    href: "/blog",
    label: "Living Room",
    caption: "Layer with art and objects.",
    image: "/images/rooms/room-living.png",
    alt: "Living room with mirror and decor",
  },
] as const;

export const DECOR_MATERIALS = [
  {
    title: "Natural Stone",
    description: "Organic beauty shaped by hand and time.",
    image: "/images/materials/material-travertine.png",
    alt: "Natural stone texture close-up",
  },
  {
    title: "Metal Finishes",
    description: "Heritage techniques, enduring luster.",
    image: "/images/materials/material-brass.png",
    alt: "Brushed metal finish",
  },
  {
    title: "Natural Wood",
    description: "Texture and grain that warm a room.",
    image: "/images/materials/material-walnut.png",
    alt: "Natural wood grain",
  },
  {
    title: "Ceramics",
    description: "Handcrafted forms with quiet character.",
    image: "/images/materials/material-ceramic.png",
    alt: "Ceramic glaze texture",
  },
  {
    title: "Timeless Textures",
    description: "Layered materials for depth and balance.",
    image: "/images/materials/material-linen.png",
    alt: "Woven linen texture",
  },
] as const;

export const DECOR_VALUES = [
  "A more considered home",
  "Beautiful spaces",
  "Lasting quality",
  "A kinder tomorrow",
] as const;
