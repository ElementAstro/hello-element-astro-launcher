"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { useAppStore } from "@/store/store";
import { toast } from "sonner";
import type { Software, DownloadItem } from "@/types";
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

import {
  DownloadItem as DownloadItemComponent,
  AvailableSoftwareCard,
  ImportDialog,
  NoActiveDownloads,
  NoDownloadHistory,
  NoSearchResults,
  downloadListVariants,
  ImportableSoftware,
} from "@/components/download";

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

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

    const newDownload: DownloadItem = {
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

  // Transform ImportableSoftware to Software for the store
  const handleImport = async (data: ImportableSoftware[]) => {
    const transformedSoftware: Software[] = data.map((item) => ({
      ...item,
      id: 0, // Will be assigned by the store
      actionLabel: "Download",
      featured: false,
      downloads: 0,
      lastUpdated: new Date().toISOString(),
      installed: false,
      rating: item.rating || 0,
    }));

    return importSoftware(transformedSoftware);
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
              <ImportDialog onImport={handleImport} />
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
                <NoActiveDownloads onBrowse={() => setActiveTab("available")} />
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={downloadListVariants}
                  className="space-y-4"
                >
                  {downloads.map((download) => (
                    <DownloadItemComponent
                      key={download.id}
                      download={download}
                      onCancel={() => removeDownload(download.id)}
                      onPause={() =>
                        updateDownload(download.id, {
                          status: "paused" as const,
                          speed: "0 MB/s",
                        })
                      }
                      onResume={() =>
                        updateDownload(download.id, {
                          status: "downloading" as const,
                          speed: "2.5 MB/s",
                          estimatedTimeRemaining: `${Math.ceil(
                            (100 - download.progress) / 20
                          )} min`,
                        })
                      }
                    />
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              {downloadHistory.length === 0 ? (
                <NoDownloadHistory />
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
                            Are you sure you want to clear your download history?
                            This action cannot be undone.
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

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={downloadListVariants}
                    className="space-y-4"
                  >
                    {downloadHistory.map((download) => (
                      <DownloadItemComponent key={download.id} download={download} />
                    ))}
                  </motion.div>
                </>
              )}
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSoftware.length === 0 ? (
                  <div className="col-span-full">
                    <NoSearchResults />
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
