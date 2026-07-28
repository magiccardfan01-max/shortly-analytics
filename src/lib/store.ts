export interface ClickEvent {
  id: string;
  timestamp: string;
  referrer: string;
  device: string;
  browser: string;
  country?: string;
}

export interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
  clicks: ClickEvent[];
  title?: string;
}

const STORAGE_KEY = "shortly_links_v1";

export function getLinks(): ShortLink[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLinks(links: ShortLink[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function getLinkBySlug(slug: string): ShortLink | undefined {
  return getLinks().find((l) => l.slug === slug);
}

export function createLink(
  originalUrl: string,
  customSlug?: string,
  expiresAt?: string,
  title?: string
): ShortLink {
  const links = getLinks();
  const slug = customSlug || generateUniqueSlug(links);
  const link: ShortLink = {
    id: crypto.randomUUID(),
    slug,
    originalUrl,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || undefined,
    clicks: [],
    title,
  };
  links.unshift(link);
  saveLinks(links);
  return link;
}

function generateUniqueSlug(existing: ShortLink[]): string {
  let slug = "";
  do {
    slug = Math.random().toString(36).substring(2, 8);
  } while (existing.some((l) => l.slug === slug));
  return slug;
}

export function recordClick(slug: string, event: Omit<ClickEvent, "id" | "timestamp">) {
  const links = getLinks();
  const idx = links.findIndex((l) => l.slug === slug);
  if (idx === -1) return;
  const click: ClickEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  };
  links[idx].clicks.push(click);
  saveLinks(links);
}

export function deleteLink(id: string) {
  const links = getLinks().filter((l) => l.id !== id);
  saveLinks(links);
}

export function isExpired(link: ShortLink): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt) < new Date();
}
