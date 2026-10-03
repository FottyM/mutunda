import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

/**
 * Normalizes a URL pathname into a canonical route for a given locale.
 * Default locale ("en") has no prefix (prefixDefaultLocale: false).
 * Secondary locales ("fr", "et") have prefix (e.g. "/fr", "/et").
 */
export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  // Normalize trailing slash and ensure leading slash
  let clean = pathname.trim();
  if (!clean.startsWith("/")) clean = `/${clean}`;

  // Remove existing locale prefixes if any
  for (const loc of LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    if (clean === `/${loc}` || clean === `/${loc}/`) {
      clean = "/";
      break;
    }
    if (clean.startsWith(`/${loc}/`)) {
      clean = clean.slice(loc.length + 1);
      break;
    }
  }

  // Ensure clean starts with "/"
  if (!clean.startsWith("/")) clean = `/${clean}`;

  if (targetLocale === DEFAULT_LOCALE) {
    return clean;
  }

  return clean === "/" ? `/${targetLocale}` : `/${targetLocale}${clean}`;
}

/**
 * Returns the nearest safe localized destination when a content translation
 * does not exist. Detail and tag routes fall back to their collection index.
 */
export function getLocaleFallbackPath(pathname: string, targetLocale: Locale): string {
  const defaultPath = getLocalizedPath(pathname, DEFAULT_LOCALE);

  if (/^\/writing\/(?:tags\/)?[^/]+/.test(defaultPath)) {
    return getLocalizedPath("/writing", targetLocale);
  }

  if (/^\/projects\/[^/]+/.test(defaultPath)) {
    return getLocalizedPath("/projects", targetLocale);
  }

  return getLocalizedPath(defaultPath, targetLocale);
}

/**
 * Formats a Date object according to locale conventions.
 */
export function formatLocalizedDate(date: Date, locale: Locale): string {
  const localeTag = locale === "et" ? "et-EE" : locale === "fr" ? "fr-FR" : "en-US";
  return new Intl.DateTimeFormat(localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export interface AlternateLink {
  hreflang: string;
  href: string;
}

/**
 * Computes canonical URL and hreflang alternate links for SEO and discovery.
 */
export function getLocaleMetadata(
  site: URL | string | undefined,
  currentPathname: string,
  overrides?: Partial<Record<Locale, string>>
): {
  canonicalUrl: string;
  alternates: AlternateLink[];
} {
  const baseSite = typeof site === "string" ? site : site?.href ?? "https://mutunda.me";
  const baseUrl = baseSite.replace(/\/+$/, "");

  const toAbsolute = (path: string) => {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path.endsWith("/") || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const hasExtension = /\.[a-z0-9]+$/i.test(cleanPath);
    const withTrailing = cleanPath.endsWith("/") || hasExtension ? cleanPath : `${cleanPath}/`;
    return `${baseUrl}${withTrailing}`;
  };

  const canonicalUrl = toAbsolute(currentPathname);

  const alternateLocales = overrides ? LOCALES.filter((locale) => overrides[locale]) : LOCALES;
  const alternates: AlternateLink[] = alternateLocales.map((locale) => {
    const localePath = overrides?.[locale] ?? getLocalizedPath(currentPathname, locale);
    return {
      hreflang: locale,
      href: toAbsolute(localePath),
    };
  });

  const defaultPath = overrides?.[DEFAULT_LOCALE] ?? (overrides
    ? getLocaleFallbackPath(currentPathname, DEFAULT_LOCALE)
    : getLocalizedPath(currentPathname, DEFAULT_LOCALE));
  alternates.push({
    hreflang: "x-default",
    href: toAbsolute(defaultPath),
  });

  return { canonicalUrl, alternates };
}
