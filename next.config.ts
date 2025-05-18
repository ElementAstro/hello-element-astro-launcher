import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// 从统一的翻译加载器中导入支持的语言列表
import { supportedLocales } from "./src/i18n/loader";

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin({
  locales: supportedLocales,
  defaultLocale: "en"
});

export default withNextIntl(nextConfig);
