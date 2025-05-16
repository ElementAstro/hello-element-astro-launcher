// filepoath: d:\Project\hello-element-astro-launcher\src\components\tools\i18n-provider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { translations } from "./translations";
import { useLocale } from "next-intl";

// 创建翻译上下文
type ToolsTranslationContextType = {
  t: (key: string, params?: Record<string, unknown>) => string;
  locale: string;
};

type TranslationValue = string | Record<string, unknown>;

const ToolsTranslationContext = createContext<ToolsTranslationContextType>({
  t: (key: string) => key,
  locale: "en",
});

export function ToolsTranslationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const appLocale = useLocale();
  const locale = appLocale === "zh-CN" ? "zh-CN" : "en"; // 默认使用英文，支持中文
  const t = (key: string, params?: Record<string, unknown>): string => {
    const keys = key.split(".");
    let value: TranslationValue = translations[locale];

    for (const k of keys) {
      if (!value || typeof value !== "object") return key;
      value = value[k] as TranslationValue;
    }

    if (typeof value !== "string") return key;

    // 替换参数
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, name) => {
        const paramValue = params[name];
        return paramValue !== undefined ? String(paramValue) : `{${name}}`;
      });
    }

    return value;
  };

  return (
    <ToolsTranslationContext.Provider value={{ t, locale }}>
      {children}
    </ToolsTranslationContext.Provider>
  );
}

export function useToolsTranslations() {
  const context = useContext(ToolsTranslationContext);
  if (!context) {
    throw new Error(
      "useToolsTranslations must be used within a ToolsTranslationProvider"
    );
  }
  return context;
}
