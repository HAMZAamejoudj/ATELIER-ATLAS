import {

  priceBucketFromUsd,

  primaryMaterial,

  swatchColorFamily,

  type CatalogProductLike,

} from "@/lib/catalog-filters";



function nameIncludes(name: string, patterns: RegExp): boolean {

  return patterns.test(name);

}



export function getLightingFilterValues(product: CatalogProductLike) {

  const { name, material } = product;

  let category = "Table Lamps";

  if (nameIncludes(name, /pendant|rivo|cielo|rhea/i)) category = "Pendants";

  else if (nameIncludes(name, /sconce|marin|towa/i)) category = "Wall Sconces";

  else if (nameIncludes(name, /floor|soren|orin/i)) category = "Floor Lamps";

  else if (nameIncludes(name, /lantern|outdoor|solara|luma/i))

    category = "Outdoor";



  const style = nameIncludes(name, /soren|orin|rivo/i)

    ? "Sculptural"

    : nameIncludes(name, /marin|solara/i)

      ? "Classic"

      : "Contemporary";



  const location = category === "Outdoor" ? "Outdoor" : "Indoor";



  return {

    category,

    style,

    material: primaryMaterial(material),

    color: swatchColorFamily(product.swatches),

    location,

    price: priceBucketFromUsd(product.priceUsd),

  };

}



export function getSeatingFilterValues(

  product: CatalogProductLike & { badge?: string },

) {

  const { name, material, badge } = product;

  let category = "Armchairs";

  if (nameIncludes(name, /sofa|sectional/i)) category = "Sofas";

  else if (nameIncludes(name, /loveseat|settee|paloma/i)) category = "Loveseats";

  else if (nameIncludes(name, /ottoman|siena ottoman/i)) category = "Ottomans";

  else if (nameIncludes(name, /dining|odette/i)) category = "Dining Chairs";

  else if (nameIncludes(name, /bench|stool|rowan/i)) category = "Benches & Stools";

  else if (nameIncludes(name, /swivel|marlow/i)) category = "Swivel Chairs";



  const style = nameIncludes(name, /marlow|ellis|swivel/i)

    ? "Contemporary"

    : nameIncludes(name, /lenoir|colette|paloma/i)

      ? "Relaxed"

      : "Classic";



  return {

    category,

    style,

    material: primaryMaterial(material),

    color: swatchColorFamily(product.swatches),

    availability: badge === "NEW" ? "New arrivals" : "In stock",

    price: priceBucketFromUsd(product.priceUsd),

  };

}



export function getDecorFilterValues(product: CatalogProductLike) {

  const { name, material, priceUsd } = product;

  let category = "Objects";

  if (nameIncludes(name, /mirror/i)) category = "Mirrors";

  else if (nameIncludes(name, /vase|bowl|nera|alba|cassia/i))

    category = "Vases";

  else if (nameIncludes(name, /tray|luca/i)) category = "Trays";

  else if (nameIncludes(name, /candle/i)) category = "Candleholders";

  else if (nameIncludes(name, /object|forma|knot/i)) category = "Objects";



  const size =

    priceUsd >= 1000 ? "Large" : priceUsd >= 400 ? "Medium" : "Small";



  return {

    category,

    material: primaryMaterial(material),

    color: swatchColorFamily(product.swatches),

    style: nameIncludes(name, /sienna|elio|arden/i) ? "Heritage" : "Modern",

    size,

    availability: "In stock",

    price: priceBucketFromUsd(priceUsd),

  };

}



export function getTablesFilterValues(
  product: CatalogProductLike & { badge?: string },
) {
  const { name, material, badge } = product;

  let category = "Side Tables";
  if (nameIncludes(name, /dining|arden|rivo|pedestal/i))
    category = "Dining Tables";
  else if (nameIncludes(name, /sideboard|marais/i)) category = "Sideboards";
  else if (nameIncludes(name, /console|lenoir|siena|paloma/i))
    category = "Console Tables";
  else if (nameIncludes(name, /coffee|vale coffee/i)) category = "Coffee Tables";
  else if (nameIncludes(name, /nesting|colette|side table/i))
    category = "Side Tables";

  const style = nameIncludes(name, /rivo|arden|rowan/i)
    ? "Sculptural"
    : nameIncludes(name, /marais|siena|paloma/i)
      ? "Classic"
      : "Contemporary";

  return {
    category,
    style,
    material: primaryMaterial(material),
    color: swatchColorFamily(product.swatches),
    availability: badge === "NEW" ? "New arrivals" : "In stock",
    price: priceBucketFromUsd(product.priceUsd),
  };
}

export function getMirrorsFilterValues(product: CatalogProductLike) {

  const { name, material, priceUsd } = product;

  const shape = nameIncludes(name, /arched|siena|oriana|kellen/i)

    ? "Arched"

    : nameIncludes(name, /round|marais|solis|lonnir/i)

      ? "Round"

      : "Rectangular";



  const size =

    priceUsd >= 2500

      ? "Extra large"

      : priceUsd >= 1500

        ? "Large"

        : priceUsd >= 900

          ? "Medium"

          : "Small";



  const style = nameIncludes(name, /sienna|arden|kellen/i)

    ? "Statement"

    : nameIncludes(name, /marais|lonnir/i)

      ? "Minimal"

      : "Classic";



  return {

    style,

    shape,

    size,

    "frame material": primaryMaterial(material),

    color: swatchColorFamily(product.swatches),

    price: priceBucketFromUsd(priceUsd),

  };

}


