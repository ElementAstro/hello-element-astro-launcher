/**
 * 代理页面的翻译加载器
 * 合并代理组件的翻译与应用程序的全局翻译
 */

import { launcherTranslations } from "@/components/launcher/translations";
import { translations as proxyTranslationsZh } from "@/components/proxy/translations";
import { translations as proxyTranslationsEn } from "@/components/proxy/translations.en";

// 从 launcherTranslations 中获取基本的翻译字典
const baseDictionaries = {
  'zh-CN': { ...launcherTranslations['zh-CN'] },
  'en-US': { ...launcherTranslations['en-US'] }
};

// 将代理组件的翻译合并到基本翻译字典中
export const proxyPageTranslations = {
  'zh-CN': {
    ...baseDictionaries['zh-CN'],
    ...proxyTranslationsZh
  },
  'en-US': {
    ...baseDictionaries['en-US'],
    ...proxyTranslationsEn
  }
};

export default proxyPageTranslations;
