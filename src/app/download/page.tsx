"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  PauseCircle,
  X,
  Upload,
  FileJson,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";
import type { DownloadItem as DownloadItemType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface AvailableSoftwareCardProps {
  software: {
    id: number;
    name: string;
    version: string;
    description: string;
    size: string;
    icon: string;
    category: string;
    installed: boolean;
  };
  onDownload: () => void;
}

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    software,
    downloads,
    downloadHistory,
    addDownload,
    updateDownload,
    removeDownload,
    moveToHistory,
    importSoftware,
    clearDownloadHistory,
  } = useAppStore();

  // Filter available downloads based on search
  const filteredSoftware = software.filter(
    (item) =>
      !item.installed &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle software download
  const handleDownload = (softwareId: number) => {
    const softwareToDownload = software.find((s) => s.id === softwareId);
    if (!softwareToDownload) return;

    const newDownload: DownloadItemType = {
      id: Date.now(),
      name: softwareToDownload.name,
      version: softwareToDownload.version,
      size: softwareToDownload.size,
      icon: softwareToDownload.icon,
      category: softwareToDownload.category,
      status: "downloading",
      progress: 0,
      date: new Date().toISOString().split("T")[0],
      speed: "2.5 MB/s",
      estimatedTimeRemaining: "5 min",
    };

    addDownload(newDownload);

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        moveToHistory(newDownload.id);

        toast.success("Download Complete", {
          description: `${softwareToDownload.name} has been downloaded successfully.`,
        });
      } else {
        updateDownload(newDownload.id, {
          progress,
          estimatedTimeRemaining: `${Math.ceil((100 - progress) / 20)} min`,
        });
      }
    }, 1000);
  };

  // Handle import of software list
  const handleImportSoftware = async () => {
    try {
      setImportError("");
      setIsImporting(true);

      // Parse the JSON data
      const parsedData = JSON.parse(importData);

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
      const importResult = await importSoftware(result.data);

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

  // Handle file upload
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
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Download Center
              </h1>
              <p className="text-muted-foreground">
                Manage your downloads and find new software
              </p>
            </div>
            <div className="w-full md:w-auto flex gap-2">
              <Input
                placeholder="Search available downloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-[300px]"
              />

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
                      Paste a JSON array of software to import or upload a JSON
                      file. The system will check for duplicates and merge with
                      existing software.
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
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Downloads</TabsTrigger>
              <TabsTrigger value="history">Download History</TabsTrigger>
              <TabsTrigger value="available">Available Software</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 mt-6">
              {downloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Download className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Active Downloads</h3>
                  <p className="text-muted-foreground mt-2">
                    You don&apos;t have any active downloads. Browse available
                    software to start downloading.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("available")}
                  >
                    Browse Available Software
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {downloads.map((download) => (
                    <DownloadItem
                      key={download.id}
                      download={download}
                      onCancel={() => removeDownload(download.id)}
                      onPause={() =>
                        updateDownload(download.id, {
                          status: "paused",
                          speed: "0 MB/s",
                        })
                      }
                      onResume={() =>
                        updateDownload(download.id, {
                          status: "downloading",
                          speed: "2.5 MB/s",
                          estimatedTimeRemaining: `${Math.ceil(
                            (100 - download.progress) / 20
                          )} min`,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              {downloadHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Download History</h3>
                  <p className="text-muted-foreground mt-2">
                    Your download history will appear here once you&apos;ve
                    completed some downloads.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear History
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Clear Download History
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to clear your download
                            history? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearDownloadHistory}>
                            Clear History
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="space-y-4">
                    {downloadHistory.map((download) => (
                      <DownloadItem key={download.id} download={download} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSoftware.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Results Found</h3>
                    <p className="text-muted-foreground mt-2">
                      No software matches your search criteria. Try a different
                      search term.
                    </p>
                  </div>
                ) : (
                  filteredSoftware.map((software) => (
                    <AvailableSoftwareCard
                      key={software.id}
                      software={software}
                      onDownload={() => handleDownload(software.id)}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

interface DownloadItemProps {
  download: DownloadItemType;
  onCancel?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

function DownloadItem({
  download,
  onCancel,
  onPause,
  onResume,
}: DownloadItemProps) {
  const getStatusIcon = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="mr-4">
            <Image
              src={download.icon || "/placeholder.svg"}
              alt={download.name}
              width={40}
              height={40}
              className="rounded"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{download.name}</h3>
                <div className="text-sm text-muted-foreground">
                  Version {download.version} • {download.size}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(download.status)}
                  {getStatusText(download.status)}
                </Badge>
                {download.status !== "completed" &&
                  download.status !== "error" &&
                  onCancel && (
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
              </div>
            </div>

            {download.status !== "completed" && download.status !== "error" && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{download.progress.toFixed(0)}%</span>
                  {download.status === "downloading" &&
                    download.estimatedTimeRemaining && (
                      <span>{download.estimatedTimeRemaining} remaining</span>
                    )}
                </div>
                <Progress value={download.progress} />

                {(download.status === "downloading" ||
                  download.status === "paused") && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {download.speed}
                    </span>
                    <div>
                      {download.status === "downloading" && onPause && (
                        <Button variant="outline" size="sm" onClick={onPause}>
                          Pause
                        </Button>
                      )}
                      {download.status === "paused" && onResume && (
                        <Button variant="outline" size="sm" onClick={onResume}>
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AvailableSoftwareCard({
  software,
  onDownload,
}: AvailableSoftwareCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        <Image
          src={software.icon || "/placeholder.svg"}
          alt={software.name}
          width={40}
          height={40}
          className="rounded"
        />
        <div>
          <CardTitle className="text-lg">{software.name}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Version {software.version}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-2">
          {software.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="text-sm text-muted-foreground">{software.size}</div>
        <Button onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
