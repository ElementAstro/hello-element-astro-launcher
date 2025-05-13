import {
  pluralRules,
  getDateFormatter,
  getNumberFormatter,
  getCurrencyFormatter,
} from "./config";

interface TranslationRecord {
  [key: string]: string | TranslationRecord;
}
export type TranslationValue = string | TranslationRecord;

export interface InterpolationParams {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | InterpolationParams;
}

// Utility to handle pluralization
export function getPluralForm(locale: string, count: number): string {
  if (!pluralRules[locale]) {
    return "other";
  }
  return pluralRules[locale].select(count);
}

// Utility to interpolate variables in translations
export function interpolate(text: string, params: InterpolationParams): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const keys = key.trim().split(".");
    let value: unknown = params;

    for (const k of keys) {
      if (value === undefined || value === null) return "";
      value = (value as Record<string, unknown>)[k];
    }

    return value !== undefined && value !== null ? String(value) : "";
  });
}

// Format date according to locale and region
export function formatDate(
  date: Date | number,
  locale: string,
  region?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const formatter = getDateFormatter(locale, region, options);
  return formatter.format(date);
}

// Format number according to locale and region
export function formatNumber(
  number: number,
  locale: string,
  region?: string,
  options?: Intl.NumberFormatOptions
): string {
  const formatter = getNumberFormatter(locale, region, options);
  return formatter.format(number);
}

// Format currency according to locale and region
export function formatCurrency(
  amount: number,
  locale: string,
  currency: string,
  region?: string
): string {
  const formatter = getCurrencyFormatter(locale, currency, region);
  return formatter.format(amount);
}

// Get translation with context
export function getContextualTranslation(
  translations: Record<string, TranslationValue>,
  key: string,
  context?: string
): TranslationValue | undefined {
  const keys = key.split(".");
  let result: TranslationValue | undefined = translations;

  for (const k of keys) {
    if (result === undefined || result === null) return undefined;
    result = (result as Record<string, TranslationValue>)[k];
  }

  if (
    context &&
    typeof result === "object" &&
    result !== null &&
    result[context] !== undefined
  ) {
    return result[context];
  }

  return result;
}

// Get plural form of translation
export function getPluralTranslation(
  translations: Record<string, TranslationValue>,
  key: string,
  count: number,
  locale: string
): string | undefined {
  const pluralForm = getPluralForm(locale, count);
  const translation = getContextualTranslation(translations, key);

  if (typeof translation === "object" && translation !== null) {
    // If the translation has plural forms
    if (translation[pluralForm] !== undefined) {
      return translation[pluralForm] as string;
    }
    // Fallback to 'other' if specific plural form is not available
    if (translation.other !== undefined) {
      return translation.other as string;
    }
  }

  return typeof translation === "string" ? translation : undefined;
}
