import type { AbstractIntlMessages } from "next-intl";

/** Client `useTranslations` namespaces. Always included so client navigations work. */
const CLIENT_NAMESPACES = [
  "common",
  "cart",
  "wishlist",
  "catalog",
  "seating",
  "tablesConsoles",
  "lighting",
  "decor",
  "mirrors",
  "productDetail",
  "contact",
  "blog",
] as const;

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
): AbstractIntlMessages {
  const picked: AbstractIntlMessages = {};

  for (const ns of CLIENT_NAMESPACES) {
    const slice = pickNamespace(messages, ns);
    if (slice) Object.assign(picked, slice);
  }

  const home = pickHomeBestSellers(messages);
  if (home) Object.assign(picked, home);

  return picked;
}
