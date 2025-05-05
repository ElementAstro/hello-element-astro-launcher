// Import types we depend on first
import type { Software } from "@/types";
export type { Category } from "./constants";

export interface SoftwareFilter {
  category?: string;
  tags?: string[];
}

export type ViewMode = "grid" | "list";
export type SortField = "name" | "downloads" | "lastUpdated";
export type SortDirection = "asc" | "desc";

export interface SoftwareWithAction extends Software {
  actionType: 'update-info' | 'launched' | 'installing';
}

export interface ActionHandler {
  (software: SoftwareWithAction): void;
}

export interface ChangeHandler<T> {
  (value: T): void;
}

// Re-export dependent types
export type { Software };