export const MIRRORS_BREADCRUMB = [
  { href: "/", label: "Home" },
  { href: "/mirrors", label: "Mirrors" },
] as const;

export const MIRRORS_TYPES = [
  {
    href: "/mirrors#arched",
    label: "Arched Mirrors",
    image: "/images/mirrors/product-siena-arched.png",
    alt: "Arched floor mirror",
  },
  {
    href: "/mirrors#floor",
    label: "Floor Mirrors",
    image: "/images/mirrors/product-siena-arched.png",
    alt: "Full-length floor mirror",
  },
  {
    href: "/mirrors#wall",
    label: "Wall Mirrors",
    image: "/images/mirrors/product-marais-round.png",
    alt: "Round wall mirror",
  },
  {
    href: "/mirrors#vanity",
    label: "Vanity Mirrors",
    image: "/images/rooms/room-bedroom.png",
    alt: "Vanity mirror in powder room",
  },
  {
    href: "/mirrors#objects",
    label: "Decorative Objects",
    image: "/images/decor/product-forma-object.png",
    alt: "Decorative sculptural object",
  },
  {
    href: "/mirrors#candleholders",
    label: "Candleholders",
    image: "/images/decor/product-arden-candleholders.png",
    alt: "Brass candleholders",
  },
] as const;

export const MIRRORS_FILTERS = [
  "Style",
  "Shape",
  "Size",
  "Frame Material",
  "Color",
  "Price",
] as const;

export const MIRRORS_FEATURED = [
  {
    name: "The Siena Arched Floor Mirror",
    priceUsd: 2950,
    description:
      "A full-length arched mirror in antique brass. It brings light into a room and a sense of height that feels considered, not decorative.",
    image: "/images/mirrors/product-siena-arched.png",
    heroImage: "/images/mirrors/hero-mirrors-calm.png",
    alt: "The Siena arched floor mirror in a sunlit room",
  },
  {
    name: "The Marais Round Mirror",
    priceUsd: 980,
    description:
      "A round wall mirror in aged bronze. A softer geometry for hallways, vanities, and rooms that want a quieter reflection.",
    image: "/images/mirrors/product-marais-round.png",
    heroImage: "/images/mirrors/product-marais-round.png",
    heroClassName: "object-contain object-right",
    alt: "The Marais round wall mirror",
  },
  {
    name: "The Vale Wall Mirror",
    priceUsd: 1680,
    description:
      "An arched wall mirror that opens an entry the way a window would. Designed to sit with wood, plaster, and the materials of a slower interior.",
    image: "/images/mirrors/product-siena-arched.png",
    heroImage: "/images/mirrors/inspire-foyer-mirror.png",
    alt: "The Vale wall mirror in a foyer",
  },
  {
    name: "The Arden Floor Mirror",
    priceUsd: 2450,
    description:
      "A lean, grounded floor mirror with a quiet brass frame. For bedrooms, dressing spaces, and rooms that need light as much as a reflection.",
    image: "/images/mirrors/product-siena-arched.png",
    heroImage: "/images/mirrors/product-siena-arched.png",
    alt: "The Arden arched floor mirror",
  },
  {
    name: "The Solis Mirror",
    priceUsd: 1420,
    description:
      "A darker arched silhouette for hallways and passages. It frames the room you are leaving — and the one you are walking toward.",
    image: "/images/mirrors/product-marais-round.png",
    heroImage: "/images/decor/inspire-hallway.png",
    alt: "The Solis arched hallway mirror",
  },
] as const;

export type MirrorProduct = {
  href: string;
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  swatches: string[];
  material: string;
};

export const MIRRORS_PRODUCTS: MirrorProduct[] = [
  {
    href: "/mirrors",
    name: "The Siena Arched Floor Mirror",
    priceUsd: 2950,
    image: "/images/mirrors/product-siena-arched.png",
    alt: "The Siena Arched Floor Mirror",
    swatches: ["#c4a882", "#8a7058", "#4a3c30", "#2c221c"],
    material: "Antique Brass +3",
  },
  {
    href: "/mirrors",
    name: "The Vale Wall Mirror",
    priceUsd: 1680,
    image: "/images/mirrors/product-marais-round.png",
    alt: "The Vale Wall Mirror",
    swatches: ["#e8dfd0", "#c9bfb0", "#7a6f63"],
    material: "Travertine +2",
  },
  {
    href: "/mirrors",
    name: "The Arden Floor Mirror",
    priceUsd: 2450,
    image: "/images/mirrors/product-siena-arched.png",
    alt: "The Arden Floor Mirror",
    swatches: ["#5c4a38", "#3a2e24"],
    material: "Walnut +2",
  },
  {
    href: "/mirrors",
    name: "The Marais Round Mirror",
    priceUsd: 980,
    image: "/images/mirrors/product-marais-round.png",
    alt: "The Marais Round Mirror",
    swatches: ["#c4a882", "#706658"],
    material: "Aged Bronze +1",
  },
  {
    href: "/mirrors",
    name: "The Solis Mirror",
    priceUsd: 1420,
    image: "/images/mirrors/product-marais-round.png",
    alt: "The Solis Mirror",
    swatches: ["#ebe4d8", "#c8baa8", "#9a8b7a"],
    material: "Oak +3",
  },
  {
    href: "/mirrors",
    name: "The Kellen Floor Mirror",
    priceUsd: 3100,
    image: "/images/mirrors/product-siena-arched.png",
    alt: "The Kellen Floor Mirror",
    swatches: ["#3d3832", "#6b5344"],
    material: "Blackened Steel +2",
  },
  {
    href: "/mirrors",
    name: "The Lonnir Vanity Mirror",
    priceUsd: 740,
    image: "/images/mirrors/product-marais-round.png",
    alt: "The Lonnir Vanity Mirror",
    swatches: ["#f5f0e8", "#d9cfc0"],
    material: "Brass +1",
  },
  {
    href: "/mirrors",
    name: "The Oriana Wall Mirror",
    priceUsd: 1890,
    image: "/images/mirrors/product-siena-arched.png",
    alt: "The Oriana Wall Mirror",
    swatches: ["#e5ddd2", "#b8a99a", "#5c4f44"],
    material: "Marble +2",
  },
];

export const MIRRORS_SPACE_LINKS = [
  { href: "/blog", label: "Entryways" },
  { href: "/blog", label: "Living Rooms" },
  { href: "/blog", label: "Bedrooms" },
  { href: "/blog", label: "Dining Spaces" },
  { href: "/blog", label: "Bathrooms" },
] as const;

export const MIRRORS_MATERIALS = [
  { title: "Antique Brass", image: "/images/materials/material-brass.png" },
  { title: "Aged Bronze", image: "/images/materials/material-brass.png" },
  { title: "Blackened Steel", image: "/images/materials/material-marble.png" },
  { title: "Walnut", image: "/images/materials/material-walnut.png" },
  { title: "Oak", image: "/images/materials/material-oak.png" },
  { title: "Travertine", image: "/images/materials/material-travertine.png" },
  { title: "Marble", image: "/images/materials/material-marble.png" },
  { title: "Linen", image: "/images/materials/material-linen.png" },
  { title: "Leather", image: "/images/materials/material-leather.png" },
] as const;
