export const SEATING_BREADCRUMB = [
  { href: "/", label: "Home" },
  { href: "/seating", label: "Furniture" },
  { href: "/seating", label: "Seating" },
] as const;

export const SEATING_TRUST = [
  {
    label: "Complimentary White Glove Delivery",
    icon: "truck" as const,
  },
  {
    label: "10 Year Craftsmanship Guarantee",
    icon: "shield" as const,
  },
  {
    label: "Sustainably Sourced Materials",
    icon: "leaf" as const,
  },
] as const;

export const SEATING_SUBCATEGORIES = [
  {
    href: "/seating#sofas",
    label: "Sofas",
    image: "/images/products/product-lenoir-sofa.png",
    alt: "Sculptural sofa in neutral upholstery",
  },
  {
    href: "/seating#loveseats",
    label: "Loveseats",
    image: "/images/products/product-vale-chair.png",
    alt: "Compact loveseat in bouclé fabric",
  },
  {
    href: "/seating#armchairs",
    label: "Armchairs",
    image: "/images/products/product-vale-chair.png",
    alt: "Leather lounge armchair",
  },
  {
    href: "/seating#ottomans",
    label: "Ottomans",
    image: "/images/categories/category-seating.png",
    alt: "Upholstered ottoman",
  },
  {
    href: "/seating#dining-chairs",
    label: "Dining Chairs",
    image: "/images/products/product-arden-table.png",
    alt: "Wood and linen dining chair",
  },
] as const;

export const SEATING_FILTERS = [
  "Category",
  "Style",
  "Material",
  "Color",
  "Availability",
  "Price",
] as const;

export type SeatingProduct = {
  href: string;
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  badge?: "BEST SELLER" | "NEW";
  swatches: string[];
  material: string;
};

export const SEATING_FEATURED = [
  {
    name: "The Marlow Swivel Chair",
    priceUsd: 2750,
    description:
      "A modern classic with a sculptural silhouette and inviting comfort. Designed for how you live today — and tomorrow.",
    image: "/images/seating/product-marlow-swivel-chair.png",
    heroImage: "/images/seating/hero-marlow-featured.png",
    alt: "The Marlow Swivel Chair in cream bouclé",
  },
  {
    name: "The Lenoir Sofa",
    priceUsd: 4800,
    description:
      "Generous proportions and a low, grounded profile in performance linen. Built for conversation, reading, and the unhurried rituals of home.",
    image: "/images/products/product-lenoir-sofa.png",
    heroImage: "/images/rooms/room-living.png",
    alt: "The Lenoir Sofa in beige upholstery",
  },
  {
    name: "The Vale Lounge Chair",
    priceUsd: 2950,
    description:
      "A refined lounge chair with a curved back and hand-finished leather. An anchor piece for reading corners and layered living rooms.",
    image: "/images/products/product-vale-chair.png",
    heroImage: "/images/rooms/room-bedroom.png",
    alt: "The Vale leather lounge chair",
  },
  {
    name: "The Colette Loveseat",
    priceUsd: 3400,
    description:
      "Compact enough for smaller rooms, generous enough for two. Soft linen upholstery and a silhouette that feels both relaxed and refined.",
    image: "/images/products/product-lenoir-sofa.png",
    heroImage: "/images/rooms/room-dining.png",
    alt: "The Colette Loveseat",
  },
  {
    name: "The Siena Ottoman",
    priceUsd: 1250,
    description:
      "A sculptural ottoman in bouclé with a quiet presence. Pull it close for lounging or let it anchor an open floor plan.",
    image: "/images/categories/category-seating.png",
    heroImage: "/images/rooms/room-workspace.png",
    alt: "The Siena Ottoman",
  },
] as const;

export const SEATING_PRODUCTS: SeatingProduct[] = [
  {
    href: "/seating",
    name: "The Lenoir Sofa",
    priceUsd: 4800,
    image: "/images/products/product-lenoir-sofa.png",
    alt: "The Lenoir Sofa",
    badge: "BEST SELLER",
    swatches: ["#e8dfd0", "#c4b8a8", "#8a7f72", "#3d3832"],
    material: "Bouclé +4",
  },
  {
    href: "/seating",
    name: "The Marlow Swivel Chair",
    priceUsd: 2750,
    image: "/images/seating/product-marlow-swivel-chair.png",
    alt: "The Marlow Swivel Chair",
    badge: "NEW",
    swatches: ["#f5f0e8", "#d9cfc0", "#a89888"],
    material: "Bouclé +3",
  },
  {
    href: "/seating",
    name: "The Vale Lounge Chair",
    priceUsd: 2950,
    image: "/images/products/product-vale-chair.png",
    alt: "The Vale Lounge Chair",
    swatches: ["#6b5344", "#4a382c", "#2c221c"],
    material: "Leather +2",
  },
  {
    href: "/seating",
    name: "The Lenoir Sectional",
    priceUsd: 6200,
    image: "/images/products/product-lenoir-sofa.png",
    alt: "The Lenoir Sectional",
    swatches: ["#e8dfd0", "#c4b8a8", "#8a7f72"],
    material: "Linen +5",
  },
  {
    href: "/seating",
    name: "The Arden Accent Chair",
    priceUsd: 1850,
    image: "/images/products/product-vale-chair.png",
    alt: "The Arden Accent Chair",
    swatches: ["#f0ebe3", "#c9bfb0", "#7a6f63"],
    material: "Linen +3",
  },
  {
    href: "/seating",
    name: "The Odette Dining Chair",
    priceUsd: 980,
    image: "/images/products/product-arden-table.png",
    alt: "The Odette Dining Chair",
    badge: "NEW",
    swatches: ["#e5ddd2", "#b8a99a", "#5c4f44"],
    material: "Oak +2",
  },
  {
    href: "/seating",
    name: "The Marais Bench",
    priceUsd: 2100,
    image: "/images/products/product-marais-sideboard.png",
    alt: "The Marais Bench",
    swatches: ["#8b7355", "#5c4a38", "#3a2e24"],
    material: "Walnut",
  },
  {
    href: "/seating",
    name: "The Siena Ottoman",
    priceUsd: 1250,
    image: "/images/categories/category-seating.png",
    alt: "The Siena Ottoman",
    swatches: ["#ebe4d8", "#c8baa8", "#9a8b7a"],
    material: "Bouclé +2",
  },
  {
    href: "/seating",
    name: "The Colette Loveseat",
    priceUsd: 3400,
    image: "/images/products/product-lenoir-sofa.png",
    alt: "The Colette Loveseat",
    badge: "BEST SELLER",
    swatches: ["#ddd4c8", "#b0a090", "#706658"],
    material: "Linen +4",
  },
  {
    href: "/seating",
    name: "The Ellis Armchair",
    priceUsd: 2400,
    image: "/images/products/product-vale-chair.png",
    alt: "The Ellis Armchair",
    swatches: ["#f2ece4", "#d4c8b8", "#a09080"],
    material: "Bouclé +3",
  },
  {
    href: "/seating",
    name: "The Rowan Stool",
    priceUsd: 650,
    image: "/images/categories/category-tables.png",
    alt: "The Rowan Stool",
    swatches: ["#c4a882", "#8a7058", "#4a3c30"],
    material: "Travertine",
  },
  {
    href: "/seating",
    name: "The Paloma Settee",
    priceUsd: 3950,
    image: "/images/products/product-lenoir-sofa.png",
    alt: "The Paloma Settee",
    swatches: ["#e8e0d4", "#c0b4a4", "#887868"],
    material: "Linen +3",
  },
];
