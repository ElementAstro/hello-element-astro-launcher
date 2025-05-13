// Central configuration for i18n system
export const locales = ["en", "fr", "es", "de", "ja", "ar"];
export const defaultLocale = "en";

// Define language regions for regional variations
export const regions = {
  en: ["US", "GB", "CA", "AU"],
  fr: ["FR", "CA", "BE", "CH"],
  es: ["ES", "MX", "AR", "CO"],
  de: ["DE", "AT", "CH"],
  ja: ["JP"],
  ar: ["SA", "EG", "AE"],
};

// Define writing directions for languages
export const directions = {
  en: "ltr",
  fr: "ltr",
  es: "ltr",
  de: "ltr",
  ja: "ltr",
  ar: "rtl",
};

// Define pluralization rules for each language
export const pluralRules: Record<string, Intl.PluralRules> = {};

// Initialize plural rules for each locale
locales.forEach((locale) => {
  try {
    pluralRules[locale] = new Intl.PluralRules(locale);
  } catch {
    console.warn(`Could not initialize plural rules for ${locale}`);
    // Fallback to English plural rules
    pluralRules[locale] = new Intl.PluralRules("en");
  }
});

// Define date and number formatters
export const getDateFormatter = (
  locale: string,
  region?: string,
  options?: Intl.DateTimeFormatOptions
) => {
  const localeWithRegion = region ? `${locale}-${region}` : locale;
  return new Intl.DateTimeFormat(localeWithRegion, options);
};

export const getNumberFormatter = (
  locale: string,
  region?: string,
  options?: Intl.NumberFormatOptions
) => {
  const localeWithRegion = region ? `${locale}-${region}` : locale;
  return new Intl.NumberFormat(localeWithRegion, options);
};

// Define currency formatters
export const getCurrencyFormatter = (
  locale: string,
  currency: string,
  region?: string
) => {
  const localeWithRegion = region ? `${locale}-${region}` : locale;
  return new Intl.NumberFormat(localeWithRegion, {
    style: "currency",
    currency,
  });
};
