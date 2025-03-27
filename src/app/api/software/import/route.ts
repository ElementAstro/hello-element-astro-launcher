import { type NextRequest, NextResponse } from "next/server"
import type { Software, SoftwareImportResult } from "@/types"

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON data from the request
    const data = await request.json()

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of software items." }, { status: 400 })
    }

    // Validate the software items
    const validatedSoftware: Software[] = []
    const failedItems: { name: string; reason: string }[] = []

    data.forEach((item, index) => {
      // Check required fields
      if (!item.name) {
        failedItems.push({ name: `Item ${index}`, reason: "Missing required field: name" })
        return
      }

      if (!item.description) {
        failedItems.push({ name: item.name, reason: "Missing required field: description" })
        return
      }

      if (!item.category) {
        failedItems.push({ name: item.name, reason: "Missing required field: category" })
        return
      }

      // Add default values for missing fields
      const softwareItem: Software = {
        id: 0, // This will be assigned by the store
        name: item.name,
        description: item.description,
        category: item.category,
        icon: item.icon || "/placeholder.svg?height=40&width=40",
        actionLabel: item.installed ? "Launch" : "Install",
        featured: item.featured || false,
        downloads: item.downloads || 0,
        lastUpdated: item.lastUpdated || new Date().toISOString().split("T")[0],
        version: item.version || "1.0.0",
        size: item.size || "0 MB",
        developer: item.developer || "Unknown",
        website: item.website || "",
        installed: item.installed || false,
        dependencies: item.dependencies || [],
        tags: item.tags || [],
        rating: item.rating || 0,
        releaseNotes: item.releaseNotes || "",
      }

      validatedSoftware.push(softwareItem)
    })

    // In a real application, you would save this to a database
    // For now, we'll just return the validated software
    const result: SoftwareImportResult = {
      success: true,
      message: `Successfully validated ${validatedSoftware.length} software items`,
      importedCount: validatedSoftware.length,
      updatedCount: 0,
      failedCount: failedItems.length,
      failedItems: failedItems.length > 0 ? failedItems : undefined,
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: validatedSoftware,
      result,
    })
  } catch (error) {
    console.error("Error importing software:", error)
    return NextResponse.json(
      { error: "Failed to import software", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

