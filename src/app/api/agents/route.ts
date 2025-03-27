import { type NextRequest, NextResponse } from "next/server"
import type { Agent, AgentCreateParams } from "@/types/agent"
import { v4 as uuidv4 } from "uuid"

// Mock data for agents
const agents: Agent[] = [
  {
    id: "1",
    name: "Nightly Imaging Sequence",
    description: "Automatically captures a series of deep sky objects based on visibility and weather conditions",
    status: "idle",
    type: "imaging",
    lastRun: "2023-12-15T20:30:00Z",
    nextRun: "2023-12-16T20:30:00Z",
    createdAt: "2023-11-01T12:00:00Z",
    updatedAt: "2023-12-15T21:45:00Z",
    config: {
      schedule: {
        type: "daily",
        time: "20:30",
      },
      triggers: {
        onSunset: true,
        onWeatherClear: true,
      },
      actions: [
        {
          id: "a1",
          type: "capture",
          name: "Capture M31",
          parameters: {
            target: "M31",
            exposure: 300,
            count: 20,
            filter: "L",
          },
          order: 1,
        },
        {
          id: "a2",
          type: "capture",
          name: "Capture M42",
          parameters: {
            target: "M42",
            exposure: 180,
            count: 30,
            filter: "L",
          },
          order: 2,
        },
      ],
      conditions: [
        {
          id: "c1",
          type: "weather",
          operator: "lessThan",
          parameter: "cloudCover",
          value: 20,
        },
      ],
      notifications: {
        onComplete: true,
        channels: ["email"],
      },
    },
    logs: [
      {
        id: "l1",
        timestamp: "2023-12-15T20:30:00Z",
        level: "info",
        message: "Agent started",
      },
      {
        id: "l2",
        timestamp: "2023-12-15T21:45:00Z",
        level: "info",
        message: "Agent completed successfully",
      },
    ],
  },
  {
    id: "2",
    name: "Weather Monitor",
    description: "Monitors weather conditions and sends alerts when conditions change",
    status: "running",
    type: "observation",
    lastRun: "2023-12-16T18:00:00Z",
    createdAt: "2023-10-15T09:30:00Z",
    updatedAt: "2023-12-16T18:00:00Z",
    config: {
      actions: [
        {
          id: "a3",
          type: "script",
          name: "Check Weather API",
          parameters: {
            script: "weather_check.py",
            args: ["--location=home", "--interval=15m"],
          },
          order: 1,
        },
        {
          id: "a4",
          type: "notification",
          name: "Send Alert",
          parameters: {
            message: "Weather conditions have changed: {{conditions}}",
            condition: "cloudCover > 50 || precipitation > 0",
          },
          order: 2,
        },
      ],
      notifications: {
        onError: true,
        channels: ["push", "email"],
      },
    },
    logs: [
      {
        id: "l3",
        timestamp: "2023-12-16T18:00:00Z",
        level: "info",
        message: "Agent started",
      },
    ],
  },
]

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { error: "Failed to fetch agents", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: AgentCreateParams = await request.json()

    // Validate required fields
    if (!data.name || !data.type || !data.config) {
      return NextResponse.json(
        { error: "Missing required fields", message: "Name, type, and config are required" },
        { status: 400 },
      )
    }

    // Create new agent
    const newAgent: Agent = {
      id: uuidv4(),
      name: data.name,
      description: data.description || "",
      status: data.status || "idle",
      type: data.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: data.config,
      logs: data.logs?.map((log) => ({ ...log, id: uuidv4() })) || [],
    }

    if (data.lastRun) newAgent.lastRun = data.lastRun
    if (data.nextRun) newAgent.nextRun = data.nextRun

    // Add to agents array
    agents.push(newAgent)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ agent: newAgent }, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json(
      { error: "Failed to create agent", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

