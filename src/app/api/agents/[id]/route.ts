import { type NextRequest, NextResponse } from "next/server";
import type {
  AgentUpdateParams,
  AgentLog,
  AgentConfig,
} from "@/types/agent";
import { v4 as uuidv4 } from "uuid";

// This would normally be imported from a database
// For this example, we'll use the agents array from the main route
// In a real app, you would use a database
const agents = [
  {
    id: "1",
    name: "Nightly Imaging Sequence",
    description:
      "Automatically captures a series of deep sky objects based on visibility and weather conditions",
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
    description:
      "Monitors weather conditions and sends alerts when conditions change",
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
];

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const id = params.id;
    const agent = agents.find((a) => a.id === id);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found", message: `Agent with id ${id} not found` },
        { status: 404 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({ agent });
  } catch (error) {
    console.error(`Error fetching agent ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch agent",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const id = params.id;
    const updates: AgentUpdateParams = await request.json();

    const agentIndex = agents.findIndex((a) => a.id === id);
    if (agentIndex === -1) {
      return NextResponse.json(
        { error: "Agent not found", message: `Agent with id ${id} not found` },
        { status: 404 }
      );
    }

    // Update agent while preserving the original structure
    const updatedAgent = {
      ...agents[agentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      lastRun: updates.lastRun ?? agents[agentIndex].lastRun,
      nextRun: updates.nextRun ?? agents[agentIndex].nextRun ?? undefined,
    };

    // Add new logs if provided with proper typing
    if (updates.logs) {
      const newLogs: AgentLog[] = updates.logs.map((log) => ({
        ...log,
        id: uuidv4(), // Always generate a new ID for each log
      }));
      updatedAgent.logs = [
        ...(updatedAgent.logs || []),
        ...newLogs,
      ] as AgentLog[];
    }

    // Ensure config structure is maintained
    if (updates.config) {
      updatedAgent.config = {
        ...agents[agentIndex].config,
        ...updates.config,
      } as AgentConfig;
    }

    agents[agentIndex] = updatedAgent as typeof agents[number];

    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({ agent: updatedAgent });
  } catch (error) {
    console.error(`Error updating agent ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to update agent",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const id = params.id;

    const agentIndex = agents.findIndex((a) => a.id === id);
    if (agentIndex === -1) {
      return NextResponse.json(
        { error: "Agent not found", message: `Agent with id ${id} not found` },
        { status: 404 }
      );
    }

    // Remove agent
    agents.splice(agentIndex, 1);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting agent ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to delete agent",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
