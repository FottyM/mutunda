export const DEFAULT_LOCALE = "en" as const;
export const LOCALES = ["en", "fr", "et"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, { label: string; nativeName: string }> = {
  en: { label: "English", nativeName: "English" },
  fr: { label: "French", nativeName: "Français" },
  et: { label: "Estonian", nativeName: "Eesti" },
};

export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale);
}
