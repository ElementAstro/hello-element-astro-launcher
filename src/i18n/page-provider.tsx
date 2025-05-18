"use client";

import { ReactNode } from "react";
import { TranslationProvider } from "@/components/i18n";
import { translations } from "./loader";

type PageTranslationProviderProps = {
  locale: string;
  page: string;
  children: ReactNode;
};

/**
 * 统一页面翻译提供组件
 * 为每个页面提供统一的翻译加载方式
 */
export function PageTranslationProvider({
  locale,
  children,
}: PageTranslationProviderProps) {
  // 确定有效的语言代码
  const validLocale = locale === "zh-CN" ? "zh-CN" : "en";

  // 获取页面翻译字典
  const pageTranslations = translations[validLocale];

  // 确定区域设置
  const region = validLocale === "zh-CN" ? "CN" : "US";

  return (
    <TranslationProvider
      initialDictionary={pageTranslations}
      lang={validLocale === "zh-CN" ? "zh" : "en"}
      initialRegion={region}
    >
      {children}
    </TranslationProvider>
  );
}

export default PageTranslationProvider;
