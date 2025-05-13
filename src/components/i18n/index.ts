// Export all i18n components and utilities
export { useTranslations, TranslationProvider, RegionSelector } from './client';
export { locales, defaultLocale, regions, directions } from './config';
export {
  interpolate,
  formatDate,
  formatNumber,
  formatCurrency,
  getContextualTranslation,
  getPluralTranslation,
} from './utils';
export type { TranslationValue, InterpolationParams } from './utils';
