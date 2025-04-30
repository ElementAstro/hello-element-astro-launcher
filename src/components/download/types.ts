import type { Software, DownloadItem } from "@/types";

export type DownloadStatus = DownloadItem["status"];

export interface ImportableSoftware
  extends Pick<
    Software,
    | "name"
    | "description"
    | "category"
    | "version"
    | "size"
    | "icon"
    | "developer"
    | "website"
    | "dependencies"
    | "tags"
    | "releaseNotes"
  > {
  rating?: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  conflicts?: number;
}

export { type DownloadItem as DownloadItemType };