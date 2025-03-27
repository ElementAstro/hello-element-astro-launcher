import { type NextRequest, NextResponse } from "next/server"
import type { ToolUpdateParams } from "@/types/tool"

// This would normally be imported from a database
// For this example, we'll use the tools array from the main route
// In a real app, you would use a database
const tools = [
  {
    id: "1",
    name: "Exposure Calculator",
    description: "Calculate optimal exposure settings based on equipment and target",
    category: "calculation",
    icon: "/placeholder.svg?height=40&width=40",
    lastUsed: "2023-12-15T20:30:00Z",
    favorite: true,
    inputs: [
      {
        id: "i1",
        name: "camera",
        description: "Camera model",
        type: "select",
        required: true,
        options: [
          { label: "ZWO ASI294MC Pro", value: "asi294mc" },
          { label: "ZWO ASI1600MM Pro", value: "asi1600mm" },
          { label: "Canon EOS R5", value: "eosr5" },
        ],
      },
      {
        id: "i2",
        name: "telescope",
        description: "Telescope or lens",
        type: "select",
        required: true,
        options: [
          { label: "Sky-Watcher ED80", value: "ed80" },
          { label: "Celestron C8", value: "c8" },
          { label: "Takahashi FSQ-85ED", value: "fsq85" },
        ],
      },
      {
        id: "i3",
        name: "target",
        description: "Target object",
        type: "text",
        required: true,
      },
      {
        id: "i4",
        name: "targetBrightness",
        description: "Target brightness (magnitude)",
        type: "number",
        required: false,
        validation: {
          min: -30,
          max: 30,
        },
      },
    ],
    outputs: [
      {
        id: "o1",
        name: "exposureTime",
        description: "Recommended exposure time (seconds)",
        type: "number",
      },
      {
        id: "o2",
        name: "iso",
        description: "Recommended ISO setting",
        type: "number",
      },
      {
        id: "o3",
        name: "gain",
        description: "Recommended gain setting",
        type: "number",
      },
      {
        id: "o4",
        name: "frameCount",
        description: "Recommended number of frames",
        type: "number",
      },
    ],
  },
  {
    id: "2",
    name: "Polar Alignment Assistant",
    description: "Helps with accurate polar alignment of your mount",
    category: "utility",
    icon: "/placeholder.svg?height=40&width=40",
    lastUsed: "2023-12-10T19:15:00Z",
    favorite: false,
    inputs: [
      {
        id: "i5",
        name: "location",
        description: "Your observing location",
        type: "text",
        required: true,
      },
      {
        id: "i6",
        name: "date",
        description: "Observation date",
        type: "date",
        required: true,
        default: new Date().toISOString().split("T")[0],
      },
      {
        id: "i7",
        name: "time",
        description: "Observation time",
        type: "time",
        required: true,
        default: new Date().toTimeString().split(" ")[0].substring(0, 5),
      },
    ],
    outputs: [
      {
        id: "o5",
        name: "polarStarPosition",
        description: "Position of Polaris relative to NCP",
        type: "image",
      },
      {
        id: "o6",
        name: "azimuth",
        description: "Azimuth adjustment",
        type: "text",
      },
      {
        id: "o7",
        name: "altitude",
        description: "Altitude adjustment",
        type: "text",
      },
    ],
  },
  {
    id: "3",
    name: "Imaging Session Planner",
    description: "Plan your imaging session based on target visibility and weather",
    category: "planning",
    icon: "/placeholder.svg?height=40&width=40",
    lastUsed: "2023-12-14T21:00:00Z",
    favorite: true,
    inputs: [
      {
        id: "i8",
        name: "location",
        description: "Your observing location",
        type: "text",
        required: true,
      },
      {
        id: "i9",
        name: "date",
        description: "Observation date",
        type: "date",
        required: true,
        default: new Date().toISOString().split("T")[0],
      },
      {
        id: "i10",
        name: "targets",
        description: "List of targets (comma separated)",
        type: "text",
        required: true,
      },
    ],
    outputs: [
      {
        id: "o8",
        name: "visibilityChart",
        description: "Target visibility chart",
        type: "chart",
      },
      {
        id: "o9",
        name: "optimalTimes",
        description: "Optimal imaging times for each target",
        type: "table",
      },
      {
        id: "o10",
        name: "weatherForecast",
        description: "Weather forecast for the session",
        type: "text",
      },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const tool = tools.find((t) => t.id === id)

    if (!tool) {
      return NextResponse.json({ error: "Tool not found", message: `Tool with id ${id} not found` }, { status: 404 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({ tool })
  } catch (error) {
    console.error(`Error fetching tool ${params.id}:`, error)
    return NextResponse.json(
      { error: "Failed to fetch tool", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates: ToolUpdateParams = await request.json()

    const toolIndex = tools.findIndex((t) => t.id === id)
    if (toolIndex === -1) {
      return NextResponse.json({ error: "Tool not found", message: `Tool with id ${id} not found` }, { status: 404 })
    }

    // Update tool
    const updatedTool = {
      ...tools[toolIndex],
      ...updates,
    }

    tools[toolIndex] = updatedTool

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({ tool: updatedTool })
  } catch (error) {
    console.error(`Error updating tool ${params.id}:`, error)
    return NextResponse.json(
      { error: "Failed to update tool", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const toolIndex = tools.findIndex((t) => t.id === id)
    if (toolIndex === -1) {
      return NextResponse.json({ error: "Tool not found", message: `Tool with id ${id} not found` }, { status: 404 })
    }

    // Remove tool
    tools.splice(toolIndex, 1)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting tool ${params.id}:`, error)
    return NextResponse.json(
      { error: "Failed to delete tool", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

