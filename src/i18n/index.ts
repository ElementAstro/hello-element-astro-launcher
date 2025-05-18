/**
 * i18n统一导出
 * 提供所有页面可以使用的翻译功能
 */

// 导出统一的翻译加载器
export {
  supportedLocales,
  defaultLocale,
  translations,
  getPageTranslations,
  getComponentTranslations
} from './loader';

// 导出页面翻译提供组件
export { PageTranslationProvider } from './page-provider';

// 导出工具函数
export { default as request } from './request';
