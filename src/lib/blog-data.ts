/**
 * Mock blog content — replace with CMS / admin API when the dashboard is ready.
 */

import { BLOG_POSTS_AR } from "@/lib/blog-posts-ar";
import type { Locale } from "@/lib/locale";

export type BlogTopic =
  | "Craft"
  | "Materials"
  | "Spaces"
  | "People"
  | "Ideas"
  | "Travel"
  | "Interiors";

export type BlogPostFormat = "Story" | "Interview" | "Essay";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  topic: BlogTopic;
  format: BlogPostFormat;
  image: string;
  alt: string;
  author: string;
  readTimeMinutes: number;
  body: string[];
};

export const BLOG_FILTER_TOPICS: readonly (BlogTopic | "All")[] = [
  "All",
  "Craft",
  "Materials",
  "Spaces",
  "People",
  "Ideas",
  "Travel",
  "Interiors",
] as const;

const BLOG_TOPIC_AR: Record<BlogTopic, string> = {
  Craft: "الحِرَف",
  Materials: "المواد",
  Spaces: "المساحات",
  People: "الأشخاص",
  Ideas: "أفكار",
  Travel: "السفر",
  Interiors: "التصميم الداخلي",
};

const BLOG_FORMAT_AR: Record<BlogPostFormat, string> = {
  Story: "قصة",
  Interview: "حوار",
  Essay: "مقال",
};

function blogDateLocale(locale: Locale): string {
  return locale === "ar" ? "ar-MA" : "en-US";
}

export function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale === "en") return post;
  const ar = BLOG_POSTS_AR[post.slug];
  if (!ar) return post;
  return {
    ...post,
    title: ar.title,
    excerpt: ar.excerpt,
    alt: ar.alt,
    body: ar.body,
  };
}

export function translateBlogTopic(topic: BlogTopic, locale: Locale): string {
  if (locale === "en") return topic;
  return BLOG_TOPIC_AR[topic];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "the-beauty-of-a-slower-world",
    title: "The Beauty of a Slower World",
    excerpt:
      "In a culture of constant motion, we return to terraces, tablescapes, and the unhurried rituals that make a house feel like home.",
    date: "2024-05-02",
    topic: "Travel",
    format: "Story",
    image: "/images/blog/featured-slower-world.png",
    alt: "Stone terrace overlooking a sunlit landscape",
    author: "Atelier Atlas",
    readTimeMinutes: 8,
    body: [
      "Slow is not lazy — it is attentive. On a terrace overlooking dry hills, breakfast lasts longer than necessary, and that is the point.",
      "We design for those pauses: a bench wide enough for two, stone that stays cool under bare feet, shade that arrives before the heat does.",
      "A slower world is not somewhere else. It is the hour you protect inside the home you already have.",
    ],
  },
  {
    slug: "the-hands-behind-the-heirloom",
    title: "The Hands Behind the Heirloom",
    excerpt:
      "Meet the makers whose craft turns raw stone and timber into pieces meant to outlast seasons — and stories.",
    date: "2024-04-18",
    topic: "People",
    format: "Interview",
    image: "/images/blog/featured-heirloom-hands.png",
    alt: "Artisan working material in a workshop",
    author: "Atelier Atlas",
    readTimeMinutes: 7,
    body: [
      "Heirloom begins in the hands — calloused, careful, knowing where pressure should land and where it should not.",
      "Our workshops in Marrakech are loud with water and stone, then quiet while a edge is checked by touch alone.",
      "What you receive is not merely furniture. It is the accumulated judgment of people who would not sign their name to work they would not keep.",
    ],
  },
  {
    slug: "the-quiet-power-of-natural-stone",
    title: "The Quiet Power of Natural Stone",
    excerpt:
      "Travertine, marble, and limestone carry geology into daily life — weight, texture, and honesty underfoot.",
    date: "2024-04-05",
    topic: "Materials",
    format: "Essay",
    image: "/images/blog/featured-natural-stone.png",
    alt: "Ancient stone arch in warm light",
    author: "Atelier Atlas",
    readTimeMinutes: 6,
    body: [
      "Stone does not apologize for its pits or its weight. It asks you to accept imperfection as character.",
      "In interiors, stone grounds a room the way bass notes ground a song — beneath everything else, holding the tune together.",
      "We select blocks for variation, not uniformity. The goal is a surface that looks grown, not printed.",
    ],
  },
  {
    slug: "what-makes-a-home-truly-last",
    title: "What Makes a Home Truly Last",
    excerpt:
      "Beyond trend cycles: proportion, material honesty, and the patience to live with fewer, better things.",
    date: "2024-03-22",
    topic: "Ideas",
    format: "Essay",
    image: "/images/rooms/room-living.png",
    alt: "Living room with enduring materials",
    author: "Atelier Atlas",
    readTimeMinutes: 9,
    body: [
      "Homes that last share a trait: they tolerate change. Neutral palettes, solid joinery, rooms that can be read differently as life shifts.",
      "Lasting is not frozen. It is resilient — surfaces that can be refinished, textiles that age gracefully, layouts that accept new rituals.",
      "We measure success in decades, not seasons. If a piece still earns its place after ten years, it was worth making.",
    ],
  },
  {
    slug: "the-power-of-reflection",
    title: "Light, Space & the Art of Placement",
    excerpt:
      "How thoughtful layouts and reflective surfaces reshape the rhythm of everyday rooms.",
    date: "2024-04-12",
    topic: "Spaces",
    format: "Story",
    image: "/images/journal/journal-harmony.png",
    alt: "Sunlit interior with mirror",
    author: "Atelier Atlas",
    readTimeMinutes: 5,
    body: [
      "A mirror is the fastest way to change a room without moving walls. It doubles daylight, extends a view, and gives the eye a place to rest.",
      "Scale matters: in a low ceiling, a tall arched mirror lifts; in a narrow hall, a horizontal form widens.",
      "Place mirrors where they reflect something worth seeing twice: greenery, artwork, the curve of a staircase.",
    ],
  },
  {
    slug: "the-power-of-patina",
    title: "The Power of Patina",
    excerpt:
      "Why brass, leather, and stone grow more beautiful when they are lived with — not locked away.",
    date: "2024-04-02",
    topic: "Materials",
    format: "Essay",
    image: "/images/journal/journal-patina.png",
    alt: "Ceramic vessels with natural patina",
    author: "Atelier Atlas",
    readTimeMinutes: 5,
    body: [
      "Patina is not damage — it is memory written in surface.",
      "We design for that arc. Finishes are chosen knowing they will look better in five years than on the day they arrive.",
      "Caring for patina means less polishing and more presence.",
    ],
  },
  {
    slug: "a-home-in-harmony",
    title: "A Home in Harmony",
    excerpt:
      "Nature as a design partner — ochre earth, sage shadow, and the palette of the landscape indoors.",
    date: "2024-03-18",
    topic: "Interiors",
    format: "Story",
    image: "/images/journal/journal-harmony.png",
    alt: "Green hills and soft daylight",
    author: "Atelier Atlas",
    readTimeMinutes: 6,
    body: [
      "Harmony is not matching everything — it is rhythm.",
      "We look to landscape the way others look to trend boards.",
      "Start with one natural anchor and build outward.",
    ],
  },
  {
    slug: "collected-not-curated",
    title: "Collected, Not Curated",
    excerpt:
      "On surrounding yourself with objects that carry memory — and leaving room for what comes next.",
    date: "2024-02-26",
    topic: "Ideas",
    format: "Story",
    image: "/images/journal/journal-collected.png",
    alt: "Books and objects on a shelf",
    author: "Atelier Atlas",
    readTimeMinutes: 4,
    body: [
      "A curated room can feel like a magazine. A collected room feels like a life.",
      "We encourage clients to keep the bowl from a trip, the chair inherited twice.",
      "Our pieces are made to join that conversation.",
    ],
  },
  {
    slug: "framing-the-everyday",
    title: "Framing the Everyday",
    excerpt:
      "Entryways, powder rooms, and the mirrors that welcome you home.",
    date: "2024-03-28",
    topic: "Spaces",
    format: "Story",
    image: "/images/journal/journal-collected.png",
    alt: "Collected objects on a console",
    author: "Atelier Atlas",
    readTimeMinutes: 4,
    body: [
      "Entryways set the tone in seconds.",
      "We favor silhouettes that feel architectural: arches, soft rounds, thin frames.",
      "Pair with one surface below and one light source.",
    ],
  },
  {
    slug: "light-after-sunset",
    title: "Light After Sunset",
    excerpt:
      "Layering indoor and outdoor fixtures so evenings stretch a little longer.",
    date: "2024-03-05",
    topic: "Interiors",
    format: "Story",
    image: "/images/lighting/hero-lighting-outdoor.png",
    alt: "Outdoor patio with pendant lights at dusk",
    author: "Atelier Atlas",
    readTimeMinutes: 6,
    body: [
      "Good lighting extends the day without shouting.",
      "Think in layers: overhead for orientation, mid-level for dining.",
      "Materials that weather belong outside; inside, keep glare soft.",
    ],
  },
  {
    slug: "travertine-in-the-workshop",
    title: "Travertine in the Workshop",
    excerpt:
      "From block to bench — how stone is read, cut, and finished by hand in Marrakech.",
    date: "2024-01-20",
    topic: "Craft",
    format: "Story",
    image: "/images/materials/material-travertine.png",
    alt: "Travertine texture close-up",
    author: "Atelier Atlas",
    readTimeMinutes: 7,
    body: [
      "Travertine arrives with its own map — pits, veins, shifts in tone.",
      "In the workshop, water keeps dust down and blades cool.",
      "What leaves the atelier is never identical to the last.",
    ],
  },
  {
    slug: "a-kinder-tomorrow",
    title: "A Kinder Tomorrow",
    excerpt:
      "Sourcing, longevity, and the case for fewer, better things in every room.",
    date: "2024-01-08",
    topic: "Ideas",
    format: "Essay",
    image: "/images/rooms/room-living.png",
    alt: "Living room with natural materials",
    author: "Atelier Atlas",
    readTimeMinutes: 5,
    body: [
      "Sustainability here is not a badge — it is duration.",
      "We source stone and timber from partners we can visit.",
      "Buying less but better is a cliché until you live with it.",
    ],
  },
];

/** Index layout — swap slugs when admin CMS is wired up */
export const BLOG_INDEX = {
  primarySlug: "the-beauty-of-a-slower-world",
  secondarySlugs: [
    "the-hands-behind-the-heirloom",
    "the-quiet-power-of-natural-stone",
  ] as const,
  spotlightSlug: "what-makes-a-home-truly-last",
  latestCount: 8,
} as const;

export const BLOG_MAKERS = [
  {
    href: "/blog/the-hands-behind-the-heirloom",
    title: "The Artisans",
    subtitle: "Voices from the workshop",
    image: "/images/blog/featured-heirloom-hands.png",
    alt: "Artisan at work",
  },
  {
    href: "/blog/travertine-in-the-workshop",
    title: "The Materials",
    subtitle: "Stone, wood & metal",
    image: "/images/materials/material-travertine.png",
    alt: "Travertine sample",
  },
  {
    href: "/blog/the-quiet-power-of-natural-stone",
    title: "The Process",
    subtitle: "From raw to refined",
    image: "/images/materials/material-marble.png",
    alt: "Marble texture",
  },
  {
    href: "/blog/the-power-of-patina",
    title: "The Finish",
    subtitle: "Patina & time",
    image: "/images/materials/material-brass.png",
    alt: "Brass finish",
  },
] as const;

export function getAllBlogPosts(locale: Locale = "en"): BlogPost[] {
  return [...BLOG_POSTS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => localizeBlogPost(post, locale));
}

export function getBlogPostBySlug(
  slug: string,
  locale: Locale = "en",
): BlogPost | undefined {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return post ? localizeBlogPost(post, locale) : undefined;
}

export function getBlogPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}

export function getHomeJournalPosts(
  count = 3,
  locale: Locale = "en",
): BlogPost[] {
  return getAllBlogPosts(locale).slice(0, count);
}

export function getBlogIndexPrimary(locale: Locale = "en"): BlogPost {
  const post = getBlogPostBySlug(BLOG_INDEX.primarySlug, locale);
  if (!post) throw new Error("Missing primary blog post");
  return post;
}

export function getBlogIndexSecondary(locale: Locale = "en"): BlogPost[] {
  return BLOG_INDEX.secondarySlugs
    .map((slug) => getBlogPostBySlug(slug, locale))
    .filter((p): p is BlogPost => Boolean(p));
}

export function getBlogSpotlight(locale: Locale = "en"): BlogPost {
  const post = getBlogPostBySlug(BLOG_INDEX.spotlightSlug, locale);
  if (!post) throw new Error("Missing spotlight blog post");
  return post;
}

export function getBlogLatestPosts(locale: Locale = "en"): BlogPost[] {
  const pinned = new Set<string>([
    BLOG_INDEX.primarySlug,
    BLOG_INDEX.spotlightSlug,
  ]);
  return getAllBlogPosts(locale)
    .filter((p) => !pinned.has(p.slug))
    .slice(0, BLOG_INDEX.latestCount);
}

export function formatBlogDate(
  isoDate: string,
  locale: Locale = "en",
): string {
  return new Intl.DateTimeFormat(blogDateLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function formatBlogTopicDate(
  post: BlogPost,
  locale: Locale = "en",
): string {
  const date = new Intl.DateTimeFormat(blogDateLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.date));

  if (locale === "ar") {
    return `${translateBlogTopic(post.topic, locale)} · ${date}`;
  }

  return `${post.topic.toUpperCase()} ${date.toUpperCase()}`;
}

export function formatBlogKicker(
  post: BlogPost,
  locale: Locale = "en",
): string {
  if (locale === "ar") {
    return `${translateBlogTopic(post.topic, locale)} • ${BLOG_FORMAT_AR[post.format]}`;
  }

  return `${post.topic.toUpperCase()} • ${post.format.toUpperCase()}`;
}
