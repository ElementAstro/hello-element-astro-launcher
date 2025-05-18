import { getRequestConfig } from "next-intl/server";
import { supportedLocales, defaultLocale, translations } from "@/i18n/loader";

export default getRequestConfig(async ({ locale }) => {
  const validLocale =
    locale && supportedLocales.includes(locale) ? locale : defaultLocale;

  // 使用统一的翻译加载器获取所有翻译
  const mergedTranslations = translations[validLocale as keyof typeof translations] || {};

  return {
    locale: validLocale,
    messages: mergedTranslations,
  };
});
