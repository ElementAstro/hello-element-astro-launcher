/**
 * 代理页面的翻译加载器
 * 使用统一的翻译加载器来加载代理页面翻译
 */

import { translations } from "@/i18n/loader";
import { translations as proxyTranslationsZh } from "@/components/proxy/translations";
import { translations as proxyTranslationsEn } from "@/components/proxy/translations.en";

// 将代理组件的翻译合并到基本翻译字典中
export const proxyPageTranslations = {
  'zh-CN': {
    ...translations['zh-CN'],
    proxy: proxyTranslationsZh
  },
  'en': {
    ...translations['en'],
    proxy: proxyTranslationsEn
  }
};

export default proxyPageTranslations;
