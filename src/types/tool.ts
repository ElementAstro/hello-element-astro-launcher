export interface Tool {
  id: string;
  name: string;
  description: string;
  category: "calculation" | "conversion" | "planning" | "analysis" | "utility";
  icon: string;
  lastUsed?: string;
  favorite: boolean;
  inputs: ToolInput[];
  outputs: ToolOutput[];
}

export interface ToolInput {
  id: string;
  name: string;
  description: string;
  type: "text" | "number" | "date" | "time" | "select" | "checkbox" | "file";
  required: boolean;
  default?: unknown;
  options?: { label: string; value: unknown }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidator?: string;
  };
}

export interface ToolOutput {
  id: string;
  name: string;
  description: string;
  type: "text" | "number" | "date" | "image" | "file" | "chart" | "table";
}

export interface ToolResult {
  id: string;
  toolId: string;
  timestamp: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  duration: number;
  status: "completed" | "failed";
  error?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export type ToolCreateParams = Omit<Tool, "id">;
export type ToolUpdateParams = Partial<Omit<Tool, "id">>;
