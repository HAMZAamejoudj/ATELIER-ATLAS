import type { AbstractIntlMessages } from "next-intl";

const GLOBAL_NAMESPACES = ["common", "cart", "wishlist"] as const;

const ROUTE_NAMESPACES: { prefix: string; namespaces: string[] }[] = [
  { prefix: "/seating", namespaces: ["seating", "catalog"] },
  { prefix: "/tables-consoles", namespaces: ["tablesConsoles", "catalog"] },
  { prefix: "/lighting", namespaces: ["lighting", "catalog"] },
  { prefix: "/decor", namespaces: ["decor", "catalog"] },
  { prefix: "/mirrors", namespaces: ["mirrors", "catalog"] },
  { prefix: "/products/", namespaces: ["productDetail"] },
  { prefix: "/contact", namespaces: ["contact"] },
  { prefix: "/blog", namespaces: ["blog"] },
  { prefix: "/wishlist", namespaces: [] },
  { prefix: "/", namespaces: ["home"] },
];

function pickNamespace(
  messages: AbstractIntlMessages,
  namespace: string,
): AbstractIntlMessages | undefined {
  const value = messages[namespace];
  if (value && typeof value === "object") {
    return { [namespace]: value };
  }
  return undefined;
}

function pickHomeBestSellers(
  messages: AbstractIntlMessages,
): AbstractIntlMessages | undefined {
  const home = messages.home;
  if (!home || typeof home !== "object") return undefined;
  const bestSellers = (home as Record<string, unknown>).bestSellers;
  if (!bestSellers || typeof bestSellers !== "object") return undefined;
  return {
    home: {
      bestSellers: bestSellers as AbstractIntlMessages,
    },
  };
}

/** Strip server-only copy (seo, footer, about, nav) from the client intl payload. */
export function getClientMessages(
  messages: AbstractIntlMessages,
  pathname: string,
): AbstractIntlMessages {
  const path = pathname.split("?")[0] || "/";
  const isHome = path === "/";

  const namespaces = new Set<string>(GLOBAL_NAMESPACES);
  for (const route of ROUTE_NAMESPACES) {
    if (route.prefix === "/") {
      if (isHome) {
        for (const ns of route.namespaces) namespaces.add(ns);
      }
      continue;
    }
    if (path === route.prefix || path.startsWith(`${route.prefix}/`)) {
      for (const ns of route.namespaces) namespaces.add(ns);
    }
  }

  const picked: AbstractIntlMessages = {};
  for (const ns of namespaces) {
    if (ns === "home") {
      const slice = pickHomeBestSellers(messages);
      if (slice) Object.assign(picked, slice);
      continue;
    }
    const slice = pickNamespace(messages, ns);
    if (slice) Object.assign(picked, slice);
  }

  return picked;
}
