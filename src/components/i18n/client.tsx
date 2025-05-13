"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  interpolate,
  formatDate,
  formatNumber,
  formatCurrency,
  getContextualTranslation,
  getPluralTranslation,
  type TranslationValue,
} from "./utils";
import { regions, directions } from "./config";
import type { InterpolationParams } from "./utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enhanced translation context type
type TranslationContextType = {
  dictionary: Record<string, TranslationValue>;
  locale: string;
  region: string;
  direction: "ltr" | "rtl";
  t: (key: string, options?: TranslationOptions) => string;
  tPlural: (key: string, count: number, options?: TranslationOptions) => string;
  tContext: (
    key: string,
    context: string,
    options?: TranslationOptions
  ) => string;
  formatDate: (
    date: Date | number,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency: string) => string;
  setRegion: (region: string) => void;
  refreshTranslations: () => Promise<void>;
};

interface TranslationParamObject {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | TranslationParamObject;
}

type TranslationParam =
  | string
  | number
  | boolean
  | null
  | undefined
  | TranslationParamObject;

// Options for translation functions
type TranslationOptions = {
  params?: Record<string, TranslationParam>;
  defaultValue?: string;
};

// 为 regions 和 directions 对象创建类型安全的索引签名
type RegionMap = typeof regions & { [key: string]: string[] | undefined };
type DirectionMap = typeof directions & { [key: string]: string | undefined };

const TranslationContext = createContext<TranslationContextType | null>(null);

// Enhanced hook to use translations
export function useTranslations() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      "useTranslations must be used within a TranslationProvider"
    );
  }
  return context;
}

type TranslationProviderProps = {
  initialDictionary: Record<string, TranslationValue>;
  lang: string;
  initialRegion?: string;
  children: ReactNode;
};

export function TranslationProvider({
  initialDictionary,
  lang,
  initialRegion,
  children,
}: TranslationProviderProps) {
  const [dictionary, setDictionary] = useState(initialDictionary);
  const [region, setRegion] = useState(
    initialRegion || (regions as RegionMap)[lang]?.[0] || ""
  );
  const direction =
    ((directions as DirectionMap)[lang] as "ltr" | "rtl") || "ltr";

  // 使用useCallback包装refreshTranslations以避免无限循环
  const refreshTranslations = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/translations/get?lang=${lang}&region=${region}&t=${Date.now()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }

      const freshDictionary = await response.json();
      setDictionary(freshDictionary);
    } catch (error) {
      console.error("Error refreshing translations:", error);
    }
  }, [lang, region]);

  // Basic translation function with interpolation
  const t = (key: string, options?: TranslationOptions): string => {
    const translation = getContextualTranslation(dictionary, key);

    if (typeof translation !== "string") {
      return options?.defaultValue || key;
    }

    return options?.params
      ? interpolate(translation, options.params as InterpolationParams)
      : translation;
  };

  // Pluralized translation function
  const tPlural = (
    key: string,
    count: number,
    options?: TranslationOptions
  ): string => {
    const translation = getPluralTranslation(dictionary, key, count, lang);

    if (typeof translation !== "string") {
      return options?.defaultValue || key;
    }

    const params = { count, ...(options?.params || {}) };
    return interpolate(translation, params as InterpolationParams);
  };

  // Context-aware translation function
  const tContext = (
    key: string,
    context: string,
    options?: TranslationOptions
  ): string => {
    const translation = getContextualTranslation(dictionary, key, context);

    if (typeof translation !== "string") {
      return options?.defaultValue || key;
    }

    return options?.params
      ? interpolate(translation, options.params as InterpolationParams)
      : translation;
  };

  // Format date with current locale and region
  const formatDateWithLocale = (
    date: Date | number,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    return formatDate(date, lang, region, options);
  };

  // Format number with current locale and region
  const formatNumberWithLocale = (
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    return formatNumber(number, lang, region, options);
  };

  // Format currency with current locale and region
  const formatCurrencyWithLocale = (
    amount: number,
    currency: string
  ): string => {
    return formatCurrency(amount, lang, currency, region);
  };

  // Set up polling for hot reloading (in development)
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const interval = setInterval(refreshTranslations, 5000);
      return () => clearInterval(interval);
    }
  }, [refreshTranslations]); // 现在refreshTranslations是依赖项，但由于useCallback，它只会在lang或region变化时才重新创建

  return (
    <TranslationContext.Provider
      value={{
        dictionary,
        locale: lang,
        region,
        direction,
        t,
        tPlural,
        tContext,
        formatDate: formatDateWithLocale,
        formatNumber: formatNumberWithLocale,
        formatCurrency: formatCurrencyWithLocale,
        setRegion,
        refreshTranslations,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Region selector component using the custom Select component
export function RegionSelector() {
  const { locale, region, setRegion } = useTranslations();
  const availableRegions = (regions as RegionMap)[locale] || [];

  if (availableRegions.length <= 1) return null;

  return (
    <Select value={region} onValueChange={setRegion}>
      <SelectTrigger className="w-auto text-sm" size="sm">
        <SelectValue placeholder="Select region" />
      </SelectTrigger>
      <SelectContent>
        {availableRegions.map((r: string) => (
          <SelectItem key={r} value={r}>
            {locale}-{r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
