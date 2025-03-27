export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "paused" | "error";
  type: "observation" | "imaging" | "processing" | "analysis" | "custom";
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  updatedAt: string;
  config: AgentConfig;
  logs: AgentLog[];
}

export interface AgentConfig {
  schedule?: {
    type: "once" | "daily" | "weekly" | "monthly" | "custom";
    time?: string;
    days?: string[];
    date?: string;
    cronExpression?: string;
  };
  triggers?: {
    onEquipmentConnect?: boolean;
    onSunset?: boolean;
    onWeatherClear?: boolean;
    onCustomCondition?: string;
  };
  actions: AgentAction[];
  conditions?: AgentCondition[];
  notifications?: {
    onStart?: boolean;
    onComplete?: boolean;
    onError?: boolean;
    channels?: ("email" | "push" | "sms")[];
  };
}

export interface AgentAction {
  id: string;
  type:
    | "capture"
    | "focus"
    | "platesolve"
    | "process"
    | "script"
    | "command"
    | "notification";
  name: string;
  parameters: Record<string, unknown>;
  order: number;
  timeout?: number;
  retryCount?: number;
  dependsOn?: string[];
}

export interface AgentCondition {
  id: string;
  type: "weather" | "time" | "equipment" | "custom";
  operator:
    | "equals"
    | "notEquals"
    | "greaterThan"
    | "lessThan"
    | "contains"
    | "notContains";
  value: unknown;
  parameter: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  details?: unknown;
}

export interface AgentRunResult {
  id: string;
  agentId: string;
  startTime: string;
  endTime?: string;
  status: "running" | "completed" | "failed" | "cancelled";
  actions: {
    id: string;
    name: string;
    startTime: string;
    endTime?: string;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    output?: unknown;
    error?: string;
  }[];
  output?: unknown;
  error?: string;
}

export type AgentCreateParams = Omit<
  Agent,
  "id" | "createdAt" | "updatedAt" | "logs"
> & {
  logs?: Omit<AgentLog, "id">[];
};

export type AgentUpdateParams = Partial<
  Omit<Agent, "id" | "createdAt" | "updatedAt" | "logs">
> & {
  logs?: Omit<AgentLog, "id">[];
};
