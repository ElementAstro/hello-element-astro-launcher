"use client"

import { AppLayout } from "@/components/app-layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { TranslationProvider } from "@/components/i18n"
import { commonTranslations } from "@/components/i18n/common-translations"

function HomePageContent() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0 transition-all">
        <HeroSection />
        <FeaturedSection />
        <CategoriesSection />
      </div>
    </AppLayout>
  )
}

export default function HomePage() {
  // 检测浏览器语言，设置为英文或中文
  const userLanguage = typeof navigator !== 'undefined' ? 
    (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US') : 'en-US';
  
  // 从用户区域确定地区
  const userRegion = userLanguage === 'zh-CN' ? 'CN' : 'US';
  
  return (
    <TranslationProvider 
      initialDictionary={commonTranslations[userLanguage] || commonTranslations['en-US']}
      lang={userLanguage.split('-')[0]}
      initialRegion={userRegion}
    >
      <HomePageContent />
    </TranslationProvider>
  )
}
