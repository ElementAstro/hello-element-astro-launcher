import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/components/i18n";
import { homeTranslations } from "@/components/home/translations";

export default getRequestConfig(async ({ locale }) => {
  const validLocale =
    locale && locales.includes(locale) ? locale : defaultLocale;

  // 合并所有组件的翻译
  const mergedTranslations = {
    ...(homeTranslations[validLocale as keyof typeof homeTranslations] || {}),
  };

  return {
    locale: validLocale,
    messages: mergedTranslations,
  };
});
