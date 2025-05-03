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
  autocomplete?: string;
  placeholder?: string;
  step?: string | number;
  help?: string;
  accept?: string;
}

export interface InputOption {
  label: string;
  value: unknown;
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

export type ToolInputValue = string | number | boolean;

export interface TableRow {
  [key: string]: CellValue;
}

// 改为类型别名
export type TableData = TableRow[];

// 添加具体的图表数据类型定义
export interface ChartData {
  type: "line" | "bar" | "pie" | "scatter" | "area";
  data: {
    labels?: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }>;
  };
}

export type CellValue = string | number | boolean | null;
