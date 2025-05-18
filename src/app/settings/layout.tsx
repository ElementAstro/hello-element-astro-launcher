"use client";

import { ReactNode } from "react";
import { PageTranslationProvider } from "@/i18n/page-provider";
import { useLocale } from "next-intl"; // Use the client-side hook instead

export default function SettingsLayout({ children }: { children: ReactNode }) {
  // Use the hook instead of the server function
  const locale = useLocale();

  return (
    <PageTranslationProvider locale={locale} page="settings">
      {children}
    </PageTranslationProvider>
  );
}
