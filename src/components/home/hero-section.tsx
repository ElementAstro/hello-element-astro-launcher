import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-muted/30 transition-all">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Astronomy Software Hub
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Your one-stop platform for discovering, managing, and launching astronomy and astrophotography
                software.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/launcher">
                <Button size="lg" aria-label="Launch software applications">
                  Launch Software
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/download">
                <Button variant="outline" size="lg" aria-label="Access download center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Center
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Astronomy Software Hub"
              width={400}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}