import { type NextRequest, NextResponse } from "next/server";
import type { Tool, ToolCreateParams } from "@/types/tool";
import { v4 as uuidv4 } from "uuid";

// Mock data for tools
const tools: Tool[] = [
  {
    id: "1",
    name: "Exposure Calculator",
    description:
      "Calculate optimal exposure settings based on equipment and target",
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
    description:
      "Plan your imaging session based on target visibility and weather",
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
];

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tools",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ToolCreateParams = await request.json();

    // Validate required fields
    if (!data.name || !data.category || !data.inputs || !data.outputs) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Name, category, inputs, and outputs are required",
        },
        { status: 400 }
      );
    }

    // Create new tool
    const newTool: Tool = {
      id: uuidv4(),
      name: data.name,
      description: data.description || "",
      category: data.category,
      icon: data.icon || "/placeholder.svg?height=40&width=40",
      favorite: data.favorite || false,
      inputs: data.inputs,
      outputs: data.outputs,
    };

    if (data.lastUsed) newTool.lastUsed = data.lastUsed;

    // Add to tools array
    tools.push(newTool);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ tool: newTool }, { status: 201 });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      {
        error: "Failed to create tool",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
