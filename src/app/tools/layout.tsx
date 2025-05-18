"use client";

import { ReactNode } from "react";
import { PageTranslationProvider } from "@/i18n/page-provider";
import { ToolsTranslationProvider } from "@/components/tools/i18n-provider";

export default function ToolsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Using useLocale hook instead of getLocale since we can't use async in client components
  const locale = "en"; // Replace with appropriate client-side method to get locale

  return (
    <PageTranslationProvider locale={locale} page="tools">
      <ToolsTranslationProvider>{children}</ToolsTranslationProvider>
    </PageTranslationProvider>
  );
}
