export const TABLES_SUBCATEGORIES = [
  {
    href: "/tables-consoles#dining",
    label: "Dining Tables",
    image: "/images/products/product-arden-table.png",
    alt: "Round travertine dining table",
  },
  {
    href: "/tables-consoles#consoles",
    label: "Console Tables",
    image: "/images/products/product-marais-sideboard.png",
    alt: "Walnut console with travertine top",
  },
  {
    href: "/tables-consoles#sideboards",
    label: "Sideboards",
    image: "/images/products/product-marais-sideboard.png",
    alt: "Sculptural wood sideboard",
  },
  {
    href: "/tables-consoles#coffee",
    label: "Coffee Tables",
    image: "/images/categories/category-tables.png",
    alt: "Low travertine coffee table",
  },
  {
    href: "/tables-consoles#side",
    label: "Side Tables",
    image: "/images/categories/category-tables.png",
    alt: "Pedestal side table in stone",
  },
] as const;

export type TablesProduct = {
  href: string;
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  badge?: "BEST SELLER" | "NEW";
  swatches: string[];
  material: string;
};

export const TABLES_FEATURED = [
  {
    name: "The Arden Dining Table",
    priceUsd: 3250,
    description:
      "A round travertine top on a sculpted walnut base — made for long dinners and the conversations that follow.",
    image: "/images/products/product-arden-table.png",
    heroImage: "/images/products/product-arden-table.png",
    alt: "The Arden round dining table",
    heroClassName: "object-contain object-right",
  },
  {
    name: "The Marais Sideboard",
    priceUsd: 4200,
    description:
      "Generous storage behind hand-finished walnut doors. A quiet anchor for dining rooms and open living spaces.",
    image: "/images/products/product-marais-sideboard.png",
    heroImage: "/images/products/product-marais-sideboard.png",
    alt: "The Marais wood sideboard",
    heroClassName: "object-contain object-right",
  },
  {
    name: "The Lenoir Console",
    priceUsd: 3850,
    description:
      "Travertine slab and hammered metal legs in a slim profile — for entryways, halls, and layered vignettes.",
    image: "/images/products/product-marais-sideboard.png",
    heroImage: "/images/rooms/room-dining.png",
    alt: "The Lenoir console table",
    heroClassName: "object-cover object-center",
  },
  {
    name: "The Rivo Dining Table",
    priceUsd: 5400,
    description:
      "An oval travertine top with a grounded pedestal base — sculptural presence for eight or more.",
    image: "/images/products/product-arden-table.png",
    heroImage: "/images/rooms/room-dining.png",
    alt: "The Rivo oval dining table",
    heroClassName: "object-cover object-[60%_50%]",
  },
] as const;

export const TABLES_PRODUCTS: TablesProduct[] = [
  {
    href: "/tables-consoles",
    name: "The Arden Dining Table",
    priceUsd: 3250,
    image: "/images/products/product-arden-table.png",
    alt: "The Arden round dining table",
    badge: "BEST SELLER",
    swatches: ["#e8e0d4", "#c4b8a8", "#8a7f72"],
    material: "Travertine +2",
  },
  {
    href: "/tables-consoles",
    name: "The Marais Sideboard",
    priceUsd: 4200,
    image: "/images/products/product-marais-sideboard.png",
    alt: "The Marais wood sideboard",
    swatches: ["#8b7355", "#5c4a38", "#3a2e24"],
    material: "Walnut",
  },
  {
    href: "/tables-consoles",
    name: "The Lenoir Console",
    priceUsd: 3850,
    image: "/images/products/product-marais-sideboard.png",
    alt: "The Lenoir console table",
    badge: "NEW",
    swatches: ["#ddd4c8", "#a89888", "#5c5348"],
    material: "Travertine + Metal",
  },
  {
    href: "/tables-consoles",
    name: "The Rivo Dining Table",
    priceUsd: 5400,
    image: "/images/products/product-arden-table.png",
    alt: "The Rivo oval dining table",
    badge: "NEW",
    swatches: ["#ebe4d8", "#c9bfb0", "#7a6f63"],
    material: "Travertine",
  },
  {
    href: "/tables-consoles",
    name: "The Vale Coffee Table",
    priceUsd: 2100,
    image: "/images/categories/category-tables.png",
    alt: "The Vale coffee table",
    swatches: ["#e5ddd2", "#b8a99a", "#6b5f54"],
    material: "Travertine + Oak",
  },
  {
    href: "/tables-consoles",
    name: "The Colette Side Table",
    priceUsd: 890,
    image: "/images/categories/category-tables.png",
    alt: "The Colette side table",
    swatches: ["#f0ebe3", "#c4b8a8", "#8a7f72"],
    material: "Oak",
  },
  {
    href: "/tables-consoles",
    name: "The Siena Console",
    priceUsd: 3150,
    image: "/images/products/product-marais-sideboard.png",
    alt: "The Siena console",
    swatches: ["#d9cfc0", "#a09080", "#4a4038"],
    material: "Walnut + Brass",
  },
  {
    href: "/tables-consoles",
    name: "The Ellis Nesting Tables",
    priceUsd: 1650,
    image: "/images/categories/category-tables.png",
    alt: "The Ellis nesting tables",
    swatches: ["#c4a882", "#8a7058", "#4a3c30"],
    material: "Travertine",
  },
  {
    href: "/tables-consoles",
    name: "The Paloma Console",
    priceUsd: 3600,
    image: "/images/products/product-marais-sideboard.png",
    alt: "The Paloma console",
    swatches: ["#e8dfd0", "#b0a090", "#706658"],
    material: "Marble + Walnut",
  },
  {
    href: "/tables-consoles",
    name: "The Rowan Pedestal Table",
    priceUsd: 2400,
    image: "/images/products/product-arden-table.png",
    alt: "The Rowan pedestal table",
    swatches: ["#ebe4d8", "#c8baa8", "#9a8b7a"],
    material: "Travertine",
  },
];
