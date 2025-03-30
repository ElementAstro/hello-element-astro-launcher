import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { ToolResult } from "@/types/tool";

// This would normally be imported from a database
// For this example, we'll use the tools array from the main route
// In a real app, you would use a database
const tools = [
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { inputs } = await request.json();

    const tool = tools.find((t) => t.id === id);
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found", message: `Tool with id ${id} not found` },
        { status: 404 }
      );
    }

    // Validate required inputs
    const missingInputs = tool.inputs
      .filter((input) => input.required && !inputs[input.name])
      .map((input) => input.name);

    if (missingInputs.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required inputs",
          message: `The following required inputs are missing: ${missingInputs.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Update tool lastUsed
    tool.lastUsed = new Date().toISOString();

    // Simulate tool execution
    const startTime = Date.now();

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    type OutputValue =
      | string
      | number
      | boolean
      | null
      | { [key: string]: string | number }[] // 用于表格数据
      | string[]; // 用于图表数据

    // 替换原来的 Record<string, any>
    let outputs: Record<string, OutputValue> = {};

    if (id === "1") {
      // Exposure Calculator
      outputs = {
        exposureTime: Math.round(Math.random() * 300 + 30),
        iso: [100, 200, 400, 800, 1600, 3200][Math.floor(Math.random() * 6)],
        gain: Math.round(Math.random() * 200 + 50),
        frameCount: Math.round(Math.random() * 50 + 20),
      };
    } else if (id === "2") {
      // Polar Alignment Assistant
      outputs = {
        polarStarPosition: "/placeholder.svg?height=200&width=200",
        azimuth: `${(Math.random() * 2 - 1).toFixed(2)}° ${
          Math.random() > 0.5 ? "East" : "West"
        }`,
        altitude: `${(Math.random() * 2 - 1).toFixed(2)}° ${
          Math.random() > 0.5 ? "Up" : "Down"
        }`,
      };
    } else if (id === "3") {
      // Imaging Session Planner
      const targets = inputs.targets.split(",").map((t: string) => t.trim());

      outputs = {
        visibilityChart: "/placeholder.svg?height=300&width=600",
        optimalTimes: targets.map((target: string) => ({
          target,
          start: `${Math.floor(Math.random() * 4 + 20)}:${Math.floor(
            Math.random() * 60
          )
            .toString()
            .padStart(2, "0")}`,
          end: `${Math.floor(Math.random() * 4 + 1)}:${Math.floor(
            Math.random() * 60
          )
            .toString()
            .padStart(2, "0")}`,
          altitude: `${Math.floor(Math.random() * 60 + 30)}°`,
          azimuth: `${Math.floor(Math.random() * 360)}°`,
        })),
        weatherForecast:
          Math.random() > 0.3
            ? "Clear skies expected with good seeing conditions"
            : "Partly cloudy with moderate seeing conditions",
      };
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Create result
    const result: ToolResult = {
      id: uuidv4(),
      toolId: tool.id,
      timestamp: new Date().toISOString(),
      inputs,
      outputs,
      duration,
      status: "completed",
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error(`Error running tool ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to run tool",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
