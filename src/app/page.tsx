"use client"

import { AppLayout } from "@/components/app-layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { CategoriesSection } from "@/components/home/categories-section"

export default function HomePage() {
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
