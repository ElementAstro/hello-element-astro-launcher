import { NextResponse } from "next/server";
import type { ToolCategory } from "@/types/tool";

// Mock data for tool categories
const categories: ToolCategory[] = [
  {
    id: "calc",
    name: "Calculation",
    description: "Tools for astronomical calculations",
    icon: "Calculator",
    count: 3,
  },
  {
    id: "conv",
    name: "Conversion",
    description: "Unit conversion tools",
    icon: "ArrowLeftRight",
    count: 2,
  },
  {
    id: "plan",
    name: "Planning",
    description: "Session planning tools",
    icon: "Calendar",
    count: 4,
  },
  {
    id: "analysis",
    name: "Analysis",
    description: "Data analysis tools",
    icon: "BarChart",
    count: 3,
  },
  {
    id: "utility",
    name: "Utility",
    description: "General utility tools",
    icon: "Wrench",
    count: 5,
  },
];

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching tool categories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tool categories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
