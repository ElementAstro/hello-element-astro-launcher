import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { AgentRunResult } from "@/types/agent"

// This would normally be imported from a database
// For this example, we'll use the agents array from the main route
// In a real app, you would use a database
const agents = [
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const agent = agents.find((a) => a.id === id)
    if (!agent) {
      return NextResponse.json({ error: "Agent not found", message: `Agent with id ${id} not found` }, { status: 404 })
    }

    // Check if agent is already running
    if (agent.status === "running") {
      return NextResponse.json(
        { error: "Agent already running", message: `Agent ${agent.name} is already running` },
        { status: 400 },
      )
    }

    // Update agent status
    agent.status = "running"
    agent.lastRun = new Date().toISOString()
    agent.updatedAt = new Date().toISOString()

    // Add log entry
    const logId = uuidv4()
    agent.logs.push({
      id: logId,
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Agent started",
    })

    // Create run result
    const result: AgentRunResult = {
      id: uuidv4(),
      agentId: agent.id,
      startTime: new Date().toISOString(),
      status: "running",
      actions: agent.config.actions.map((action) => ({
        id: action.id,
        name: action.name,
        startTime: new Date().toISOString(),
        status: "pending",
      })),
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ result })
  } catch (error) {
    console.error(`Error running agent ${params.id}:`, error)
    return NextResponse.json(
      { error: "Failed to run agent", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

