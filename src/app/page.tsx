"use client"

import { AppLayout } from "@/components/app-layout"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Home,
  Download,
  Layers,
  Box,
  Cpu,
  PenToolIcon as Tool,
  Settings,
  RotateCcw,
  Power,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Grid,
  List,
  ArrowUpDown,
  Clock,
  Star,
  Telescope,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

// Mock data for software items
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50]

const MOCK_SOFTWARE = [
  {
    id: 1,
    name: "N.I.N.A",
    description: "NIGHTTIME IMAGING 'N' ASTRONOMY - An astrophotography imaging suite",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Website",
    featured: true,
    downloads: 15420,
    lastUpdated: "2023-12-15",
  },
  {
    id: 2,
    name: "APT",
    description:
      "Can control DSLR & CMOS camera, includes image acquisition tools. Now ToupTek Astro Camera is fully compatible with this software",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Website",
    featured: false,
    downloads: 12350,
    lastUpdated: "2023-11-20",
  },
  {
    id: 3,
    name: "MaximDL",
    description: "Maxim DL is the complete integrated solution for all of your astronomical imaging needs.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Website",
    featured: true,
    downloads: 9870,
    lastUpdated: "2023-10-05",
  },
  {
    id: 4,
    name: "MaximDL 汉化",
    description: "Maxim DL is the complete integrated solution for all of your astronomical imaging needs.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Download",
    featured: false,
    downloads: 5430,
    lastUpdated: "2023-09-18",
  },
  {
    id: 5,
    name: "THESky",
    description: "An essential tool for astronomical discovery and observation.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Website",
    featured: false,
    downloads: 8760,
    lastUpdated: "2023-08-30",
  },
  {
    id: 6,
    name: "Voyager",
    description: "A systems integration software, interfacing third-part software products.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Website",
    featured: false,
    downloads: 6540,
    lastUpdated: "2023-07-22",
  },
  {
    id: 7,
    name: "SGP",
    description: "The best in class automation software for astrophotography.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "deepspace",
    actionLabel: "Website",
    featured: true,
    downloads: 11230,
    lastUpdated: "2023-12-01",
  },
  {
    id: 8,
    name: "PHD2",
    description: "Push Here Dummy Guiding - Simple, modern, and powerful autoguiding for telescopes.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "guiding",
    actionLabel: "Website",
    featured: true,
    downloads: 14560,
    lastUpdated: "2023-11-15",
  },
  {
    id: 9,
    name: "SharpCap",
    description: "Webcam and Astronomy Camera Capture Tool with many advanced features.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "planets",
    actionLabel: "Website",
    featured: true,
    downloads: 13250,
    lastUpdated: "2023-12-10",
  },
  {
    id: 10,
    name: "FireCapture",
    description: "Planetary capture software with high-speed recording capabilities.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "planets",
    actionLabel: "Website",
    featured: false,
    downloads: 9870,
    lastUpdated: "2023-10-28",
  },
  {
    id: 11,
    name: "PixInsight",
    description: "Advanced image processing software for astrophotography.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "analysis",
    actionLabel: "Website",
    featured: true,
    downloads: 8760,
    lastUpdated: "2023-11-05",
  },
  {
    id: 12,
    name: "ASCOM Platform",
    description: "Standard interface for astronomical equipment and software.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "drivers",
    actionLabel: "Download",
    featured: true,
    downloads: 18900,
    lastUpdated: "2023-12-05",
  },
  {
    id: 13,
    name: "Stellarium",
    description: "Free open source planetarium for your computer.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "utilities",
    actionLabel: "Website",
    featured: true,
    downloads: 25670,
    lastUpdated: "2023-12-12",
  },
  {
    id: 14,
    name: "Celestron PWI",
    description: "Official software for Celestron computerized telescopes.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "vendor",
    actionLabel: "Download",
    featured: false,
    downloads: 7650,
    lastUpdated: "2023-09-15",
  },
  {
    id: 15,
    name: "ZWO ASIStudio",
    description: "Official capture software for ZWO cameras.",
    icon: "/placeholder.svg?height=40&width=40",
    category: "vendor",
    actionLabel: "Download",
    featured: false,
    downloads: 12340,
    lastUpdated: "2023-11-20",
  },
]

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
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
                    <Button size="lg">
                      Launch Software
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/download">
                    <Button variant="outline" size="lg">
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

        {/* Featured Software */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Software</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Discover the most popular astronomy and astrophotography applications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <FeaturedSoftwareCard
                title="N.I.N.A"
                description="NIGHTTIME IMAGING 'N' ASTRONOMY - An astrophotography imaging suite"
                icon="/placeholder.svg?height=60&width=60"
                downloads="15,420"
                category="Imaging"
              />
              <FeaturedSoftwareCard
                title="PixInsight"
                description="Advanced image processing software for astrophotography"
                icon="/placeholder.svg?height=60&width=60"
                downloads="8,760"
                category="Processing"
              />
              <FeaturedSoftwareCard
                title="Stellarium"
                description="Free open source planetarium for your computer"
                icon="/placeholder.svg?height=60&width=60"
                downloads="25,670"
                category="Planning"
              />
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/launcher">
                <Button variant="outline">
                  View All Software
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Software Categories</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Browse software by category to find exactly what you need
                </p>
              </div>
            </div>

            <Tabs defaultValue="imaging" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="imaging">Imaging</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
              </TabsList>
              <TabsContent value="imaging" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategoryCard
                    title="Deep Space"
                    description="Software for capturing deep space objects like galaxies and nebulae"
                    icon={<Telescope className="h-8 w-8" />}
                    count={7}
                  />
                  <CategoryCard
                    title="Planetary"
                    description="Applications specialized for planetary, lunar, and solar imaging"
                    icon={<Telescope className="h-8 w-8" />}
                    count={5}
                  />
                </div>
              </TabsContent>
              <TabsContent value="processing" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategoryCard
                    title="Image Processing"
                    description="Advanced tools for processing and enhancing astronomical images"
                    icon={<Zap className="h-8 w-8" />}
                    count={4}
                  />
                  <CategoryCard
                    title="Analysis"
                    description="Software for scientific analysis of astronomical data"
                    icon={<Zap className="h-8 w-8" />}
                    count={3}
                  />
                </div>
              </TabsContent>
              <TabsContent value="planning" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategoryCard
                    title="Planetarium"
                    description="Interactive star charts and celestial object databases"
                    icon={<Star className="h-8 w-8" />}
                    count={6}
                  />
                  <CategoryCard
                    title="Session Planning"
                    description="Tools for planning observation and imaging sessions"
                    icon={<Star className="h-8 w-8" />}
                    count={4}
                  />
                </div>
              </TabsContent>
              <TabsContent value="equipment" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategoryCard
                    title="Telescope Control"
                    description="Software for controlling and automating telescopes"
                    icon={<Telescope className="h-8 w-8" />}
                    count={8}
                  />
                  <CategoryCard
                    title="Camera Control"
                    description="Applications for controlling astronomical cameras"
                    icon={<Telescope className="h-8 w-8" />}
                    count={6}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

function FeaturedSoftwareCard({
  title,
  description,
  icon,
  downloads,
  category,
}: {
  title: string
  description: string
  icon: string
  downloads: string
  category: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        <Image src={icon || "/placeholder.svg"} alt={title} width={60} height={60} className="rounded-md" />
        <div>
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary" className="mt-1">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="text-sm text-muted-foreground">{downloads} downloads</div>
        <Link href={`/launcher?software=${title.toLowerCase()}`}>
          <Button variant="outline" size="sm">
            Launch
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function CategoryCard({
  title,
  description,
  icon,
  count,
}: {
  title: string
  description: string
  icon: React.ReactNode
  count: number
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
        <div>
          <CardTitle>{title}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">{count} software items</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-end items-center border-t">
        <Link href={`/launcher?category=${title.toLowerCase()}`}>
          <Button variant="outline" size="sm">
            Browse Category
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function LauncherPage() {
  // State management
  const [currentTab, setCurrentTab] = useState("deepspace")
  const [searchVisible, setSearchVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [sortBy, setSortBy] = useState<"name" | "downloads" | "lastUpdated">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(5) // seconds per page
  const [filterFeatured, setFilterFeatured] = useState(false)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Filter and sort software items
  const filteredSoftware = MOCK_SOFTWARE.filter(
    (item) =>
      (item.category === currentTab || currentTab === "all") &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filterFeatured || item.featured),
  ).sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "downloads") {
      return sortDirection === "asc" ? a.downloads - b.downloads : b.downloads - a.downloads
    } else {
      return sortDirection === "asc"
        ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    }
  })

  // Pagination
  const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSoftware = filteredSoftware.slice(startIndex, startIndex + itemsPerPage)

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll) {
      autoScrollTimerRef.current = setInterval(() => {
        setCurrentPage((prev) => {
          if (prev < totalPages) {
            return prev + 1
          } else {
            return 1 // Loop back to first page
          }
        })
      }, scrollSpeed * 1000)
    } else if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [autoScroll, scrollSpeed, totalPages])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, currentTab, itemsPerPage, filterFeatured, sortBy, sortDirection])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow left/right for pagination
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1)
      }

      // Ctrl+F for search focus
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault()
        document.getElementById("search-input")?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, totalPages])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col items-center w-16 py-4 border-r bg-muted/30">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mb-6">
                <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SidebarItem icon={<Box className="h-5 w-5" />} label="Launcher" active={true} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Launcher</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SidebarItem icon={<Download className="h-5 w-5" />} label="Download" active={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SidebarItem icon={<Layers className="h-5 w-5" />} label="Environment" active={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Environment</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SidebarItem icon={<Cpu className="h-5 w-5" />} label="Blocks" active={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Blocks</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SidebarItem icon={<Box className="h-5 w-5" />} label="Proxy" active={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Proxy</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SidebarItem icon={<Tool className="h-5 w-5" />} label="Tools" active={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Tools</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SidebarItem icon={<Settings className="h-5 w-5" />} label="Settings" active={false} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SidebarItem icon={<RotateCcw className="h-5 w-5" />} label="Reload" active={false} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Reload</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SidebarItem icon={<Power className="h-5 w-5" />} label="Shutdown" active={false} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Shutdown</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background border-t z-10">
        <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active={false} />
        <SidebarItem icon={<Box className="h-5 w-5" />} label="Launcher" active={true} />
        <SidebarItem icon={<Download className="h-5 w-5" />} label="Download" active={false} />
        <SidebarItem icon={<Settings className="h-5 w-5" />} label="Settings" active={false} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* Search Bar */}
        <div className={cn("p-4 border-b", !searchVisible && "hidden")}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                id="search-input"
                placeholder="Search software..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 md:flex-none">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="flex-1 md:flex-none"
                onClick={() => setSearchVisible(!searchVisible)}
              >
                {searchVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Search
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Search
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Select value={currentTab} onValueChange={setCurrentTab}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="deepspace">Deep Space</SelectItem>
                <SelectItem value="planets">Planets</SelectItem>
                <SelectItem value="guiding">Guiding</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="drivers">Drivers</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="featured-only" className="text-sm cursor-pointer">
                Featured Only
              </Label>
              <Switch id="featured-only" checked={filterFeatured} onCheckedChange={setFilterFeatured} />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                {viewMode === "list" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("name")
                        setSortDirection("asc")
                      }}
                    >
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("name")
                        setSortDirection("desc")
                      }}
                    >
                      Name (Z-A)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("downloads")
                        setSortDirection("desc")
                      }}
                    >
                      Most Downloads
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("lastUpdated")
                        setSortDirection("desc")
                      }}
                    >
                      Recently Updated
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("lastUpdated")
                        setSortDirection("asc")
                      }}
                    >
                      Oldest Updated
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 overflow-hidden">
          <div className="px-4 border-b overflow-x-auto">
            <TabsList className="h-14 w-full justify-start">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                All
              </TabsTrigger>
              <TabsTrigger
                value="deepspace"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Home className="h-4 w-4 mr-2" />
                Deep Space
              </TabsTrigger>
              <TabsTrigger
                value="planets"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Box className="h-4 w-4 mr-2" />
                Planets
              </TabsTrigger>
              <TabsTrigger
                value="guiding"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Box className="h-4 w-4 mr-2" />
                Guiding
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Box className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger
                value="drivers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Box className="h-4 w-4 mr-2" />
                Drivers
              </TabsTrigger>
              <TabsTrigger value="vendor" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Box className="h-4 w-4 mr-2" />
                Vendor
              </TabsTrigger>
              <TabsTrigger
                value="utilities"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Box className="h-4 w-4 mr-2" />
                Utilities
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Auto-scroll Controls */}
          <div className="px-4 py-2 border-b flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant={autoScroll ? "default" : "outline"} size="sm" onClick={() => setAutoScroll(!autoScroll)}>
                {autoScroll ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Auto-Scroll
                  </>
                )}
              </Button>

              {autoScroll && (
                <div className="flex items-center gap-2 ml-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[scrollSpeed]}
                    min={1}
                    max={10}
                    step={1}
                    className="w-24"
                    onValueChange={(value) => setScrollSpeed(value[0])}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{scrollSpeed}s</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
                Items per page:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
              >
                <SelectTrigger id="items-per-page" className="w-16">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Software List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredSoftware.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p>No software found matching your criteria</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterFeatured(false)
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results summary */}
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSoftware.length)} of{" "}
                  {filteredSoftware.length} results
                </div>

                {/* Software items */}
                <div
                  className={cn(
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4",
                  )}
                >
                  {paginatedSoftware.map((software) => (
                    <SoftwareItem key={software.id} software={software} viewMode={viewMode} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageToShow
                  if (totalPages <= 5) {
                    pageToShow = i + 1
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i
                  } else {
                    pageToShow = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageToShow}
                      variant={currentPage === pageToShow ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(pageToShow)}
                      className="w-8 h-8"
                    >
                      {pageToShow}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
        active && "text-primary",
      )}
    >
      <div className={cn("p-2 rounded-md", active && "bg-primary/10")}>{icon}</div>
      <span className="mt-1">{label}</span>
    </div>
  )
}

interface SoftwareItemProps {
  software: {
    id: number
    name: string
    description: string
    icon: string
    category: string
    actionLabel: string
    featured: boolean
    downloads: number
    lastUpdated: string
  }
  viewMode: "grid" | "list"
}

function SoftwareItem({ software, viewMode }: SoftwareItemProps) {
  const formattedDate = new Date(software.lastUpdated).toLocaleDateString()

  if (viewMode === "grid") {
    return (
      <div className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 flex items-center gap-3 border-b bg-muted/20">
          <Image
            src={software.icon || "/placeholder.svg"}
            alt={software.name}
            width={40}
            height={40}
            className="rounded"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium truncate">{software.name}</h3>
              {software.featured && (
                <Badge variant="secondary" className="ml-auto">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">{software.description}</p>
        </div>
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>{software.downloads.toLocaleString()} downloads</span>
            <span>Updated: {formattedDate}</span>
          </div>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            {software.actionLabel}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 mr-4">
        <Image
          src={software.icon || "/placeholder.svg"}
          alt={software.name}
          width={40}
          height={40}
          className="rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">{software.name}</h3>
          {software.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{software.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>{software.downloads.toLocaleString()} downloads</span>
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          {software.actionLabel}
        </Button>
      </div>
    </div>
  )
}

