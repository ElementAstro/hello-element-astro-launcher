import { CheckCircle, Download, PauseCircle, AlertCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "downloading":
      return <Download className="h-5 w-5 text-blue-500" />;
    case "paused":
      return <PauseCircle className="h-5 w-5 text-amber-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "downloading":
      return "Downloading";
    case "paused":
      return "Paused";
    case "error":
      return "Failed";
    default:
      return status;
  }
};