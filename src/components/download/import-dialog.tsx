import { useRef, useState } from "react";
import { FileJson, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ImportableSoftware, ImportResult } from "./types";

interface ImportDialogProps {
  onImport: (data: ImportableSoftware[]) => Promise<ImportResult>;
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [importData, setImportData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportSoftware = async () => {
    try {
      setImportError("");
      setIsImporting(true);

      // Parse the JSON data
      const parsedData = JSON.parse(importData) as ImportableSoftware[];

      // Validate with the API
      const response = await fetch("/api/software/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to import software");
      }

      // Import the validated software
      const importResult = await onImport(result.data);

      if (importResult.success) {
        // Reset the form
        setImportData("");
        setIsImporting(false);

        toast.success("Import Successful", {
          description: importResult.message,
        });

        return true;
      } else {
        throw new Error(importResult.message);
      }
    } catch (error) {
      console.error("Error importing software:", error);
      setImportError(
        error instanceof Error ? error.message : "Failed to import software"
      );
      setIsImporting(false);

      toast.info("Import Failed", {
        description:
          error instanceof Error ? error.message : "Failed to import software",
      });

      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportData(content);
      } catch {
        setImportError("Failed to read file");
        toast.error("File Read Error", {
          description: "Failed to read the uploaded file.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Software List</DialogTitle>
          <DialogDescription>
            Paste a JSON array of software to import or upload a JSON file. The
            system will check for duplicates and merge with existing software.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="import-data">JSON Data</Label>
            <textarea
              id="import-data"
              className="w-full min-h-[200px] p-2 border rounded-md"
              placeholder='[{"name": "Example Software", "description": "Description", "category": "utilities", "version": "1.0.0"}]'
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload JSON File</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileJson className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>

          {importError && (
            <div className="flex items-center gap-2 p-2 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p>{importError}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setImportData("")}>
            Clear
          </Button>
          <Button
            onClick={handleImportSoftware}
            disabled={isImporting || !importData.trim()}
          >
            {isImporting ? "Importing..." : "Import Software"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}