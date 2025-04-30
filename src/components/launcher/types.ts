// Import types we depend on first
import type { Software } from "@/types";
export type { Category } from "./constants";

export type ViewMode = "grid" | "list";
export type SortField = "name" | "downloads" | "lastUpdated";
export type SortDirection = "asc" | "desc";

export interface ActionHandler {
  (software: Software): void;
}

export interface ChangeHandler<T> {
  (value: T): void;
}

// Re-export dependent types
export type { Software };