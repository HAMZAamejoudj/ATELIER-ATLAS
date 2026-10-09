/** Filter facet keys and option values per collection (aligned with catalog-filter-configs). */

export type CollectionSystemSlug =
  | "seating"
  | "tables-consoles"
  | "lighting"
  | "mirrors"
  | "decor";

export type FilterFacetField = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

const seatingFacets: FilterFacetField[] = [
  {
    key: "category",
    label: "Category",
    options: [
      { value: "Sofa", label: "Sofa" },
      { value: "Swivel Chair", label: "Swivel Chair" },
      { value: "Dining Chair", label: "Dining Chair" },
      { value: "Bench", label: "Bench" },
      { value: "Stool", label: "Stool" },
    ],
  },
  {
    key: "style",
    label: "Style",
    options: [
      { value: "Contemporary", label: "Contemporary" },
      { value: "Sculptural", label: "Sculptural" },
      { value: "Classic", label: "Classic" },
    ],
  },
  {
    key: "availability",
    label: "Availability",
    options: [
      { value: "In Stock", label: "In Stock" },
      { value: "Made to Order", label: "Made to Order" },
    ],
  },
];

const tablesFacets: FilterFacetField[] = [
  ...seatingFacets.filter((f) => f.key !== "category"),
  {
    key: "category",
    label: "Category",
    options: [
      { value: "Dining Table", label: "Dining Table" },
      { value: "Console", label: "Console" },
      { value: "Sideboard", label: "Sideboard" },
      { value: "Coffee Table", label: "Coffee Table" },
      { value: "Side Table", label: "Side Table" },
    ],
  },
];

const lightingFacets: FilterFacetField[] = [
  {
    key: "category",
    label: "Category",
    options: [
      { value: "Pendants", label: "Pendants" },
      { value: "Table Lamps", label: "Table Lamps" },
      { value: "Wall Sconces", label: "Wall Sconces" },
      { value: "Floor Lamps", label: "Floor Lamps" },
      { value: "Outdoor", label: "Outdoor" },
    ],
  },
  {
    key: "location",
    label: "Location",
    options: [
      { value: "Indoor", label: "Indoor" },
      { value: "Outdoor", label: "Outdoor" },
    ],
  },
  { key: "style", label: "Style", options: seatingFacets[1]!.options },
];

const mirrorsFacets: FilterFacetField[] = [
  {
    key: "shape",
    label: "Shape",
    options: [
      { value: "Round", label: "Round" },
      { value: "Arched", label: "Arched" },
      { value: "Rectangular", label: "Rectangular" },
    ],
  },
  {
    key: "size",
    label: "Size",
    options: [
      { value: "Small", label: "Small" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
    ],
  },
  { key: "style", label: "Style", options: seatingFacets[1]!.options },
];

const decorFacets: FilterFacetField[] = [
  {
    key: "category",
    label: "Category",
    options: [
      { value: "Mirrors", label: "Mirrors" },
      { value: "Vases", label: "Vases" },
      { value: "Trays", label: "Trays" },
      { value: "Objects", label: "Objects" },
      { value: "Candleholders", label: "Candleholders" },
    ],
  },
  {
    key: "size",
    label: "Size",
    options: [
      { value: "Small", label: "Small" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
    ],
  },
  { key: "availability", label: "Availability", options: seatingFacets[2]!.options },
];

const colorFacet: FilterFacetField = {
  key: "color",
  label: "Color family",
  options: [
    { value: "Neutral", label: "Neutral" },
    { value: "Warm", label: "Warm" },
    { value: "Dark", label: "Dark" },
  ],
};

const materialFacet: FilterFacetField = {
  key: "material",
  label: "Material",
  options: [
    { value: "Travertine", label: "Travertine" },
    { value: "Walnut", label: "Walnut" },
    { value: "Bronze", label: "Bronze" },
    { value: "Ceramic", label: "Ceramic" },
    { value: "Linen", label: "Linen" },
  ],
};

export function getFilterFacetsForCollection(
  systemSlug: string,
): FilterFacetField[] {
  const base = (() => {
    switch (systemSlug) {
      case "seating":
        return [...seatingFacets];
      case "tables-consoles":
        return [...tablesFacets];
      case "lighting":
        return [...lightingFacets];
      case "mirrors":
        return [...mirrorsFacets];
      case "decor":
        return [...decorFacets];
      default:
        return [];
    }
  })();

  const keys = new Set(base.map((f) => f.key));
  if (!keys.has("material")) base.push(materialFacet);
  if (!keys.has("color")) base.push(colorFacet);
  return base;
}
