/**
 * 统一翻译加载器
 * 负责合并所有组件的翻译并提供统一的访问接口
 */

import { launcherTranslations } from "../components/launcher/translations";
import { homeTranslations } from "../components/home/translations";
import { translations as toolsTranslations } from "../components/tools/translations";
import { translations as environmentTranslationsZh } from "../components/environment/translations.zh-CN";
import { translations as environmentTranslationsEn } from "../components/environment/translations.en";
import { translations as proxyTranslationsZh } from "../components/proxy/translations";
import { translations as proxyTranslationsEn } from "../components/proxy/translations.en";
import { commonTranslations } from "../components/i18n/common-translations";

// 定义支持的语言
export const supportedLocales = ["en", "zh-CN"];
export const defaultLocale = "en";

// 构建基础翻译字典
const baseTranslations = {
  "zh-CN": {
    ...commonTranslations["zh-CN"],
    ...(launcherTranslations["zh-CN"] || {}),
    ...homeTranslations["zh-CN"],
    ...(toolsTranslations["zh-CN"] || {}),
  },
  en: {
    ...commonTranslations["en-US"], // 英文基础翻译使用en-US
    ...(launcherTranslations["en"] || {}),
    ...homeTranslations["en"],
    ...(toolsTranslations["en"] || {}),
  },
};

// 合并所有翻译
export const translations = {
  "zh-CN": {
    ...baseTranslations["zh-CN"],
    proxy: proxyTranslationsZh,
    environment: environmentTranslationsZh,
  },
  en: {
    ...baseTranslations["en"],
    proxy: proxyTranslationsEn,
    environment: environmentTranslationsEn,
  },
};

/**
 * 获取指定页面的翻译
 * @param page 页面名称
 * @param locale 语言代码
 * @returns 页面翻译字典
 */
export function getPageTranslations(
  page: string,
  locale: string = defaultLocale
) {
  const validLocale = supportedLocales.includes(locale)
    ? locale
    : defaultLocale;

  // 基础翻译
  const baseDict = {
    ...baseTranslations[validLocale as keyof typeof baseTranslations],
  };

  // 根据页面名称返回特定的翻译
  switch (page) {
    case "proxy":
      return {
        ...baseDict,
        proxy:
          validLocale === "zh-CN" ? proxyTranslationsZh : proxyTranslationsEn,
      };
    case "home":
      return baseDict;
    case "tools":
      return {
        ...baseDict,
        tools: toolsTranslations[validLocale as keyof typeof toolsTranslations],
      };    case "environment":
      return {
        ...baseDict,
        environment: validLocale === "zh-CN" ? environmentTranslationsZh : environmentTranslationsEn,
      };
    default:
      return baseDict;
  }
}

/**
 * 获取特定组件的翻译
 * @param component 组件名称
 * @param locale 语言代码
 * @returns 组件翻译字典
 */
export function getComponentTranslations(
  component: string,
  locale: string = defaultLocale
) {
  const validLocale = supportedLocales.includes(locale)
    ? locale
    : defaultLocale;

  switch (component) {
    case "proxy":
      return validLocale === "zh-CN"
        ? proxyTranslationsZh
        : proxyTranslationsEn;
    case "launcher":
      return launcherTranslations[
        validLocale as keyof typeof launcherTranslations
      ];
    case "home":
      return homeTranslations[validLocale as keyof typeof homeTranslations];
    case "tools":
      return toolsTranslations[validLocale as keyof typeof toolsTranslations];    case "environment":
      return validLocale === "zh-CN" ? environmentTranslationsZh : environmentTranslationsEn;
    default:
      return {};
  }
}

export default translations;
