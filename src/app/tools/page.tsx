"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { AppLayout } from "@/components/app-layout";

import { useAppStore } from "@/store/store";
import type { Tool, ToolInputValue, ToolResult as ToolResultType } from "@/types/tool";

import { SearchAndFilter } from "@/components/tools/search-and-filter";
import { ToolList } from "@/components/tools/tool-list";
import { ToolInputField } from "@/components/tools/tool-input-field";
import { ToolResult } from "@/components/tools/tool-result";

export default function ToolsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolInputs, setToolInputs] = useState<Record<string, ToolInputValue>>({});
  const [toolResult, setToolResult] = useState<ToolResultType | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    tools,
    isToolLoading,
    fetchTools,
    fetchToolCategories,
    deleteTool,
    runTool,
    toggleToolFavorite,
  } = useAppStore();

  // Fetch tools and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTools(), fetchToolCategories()]);
      } catch {
        toast("Failed to load tools. Please try again.");
      }
    };

    loadData();
  }, [fetchTools, fetchToolCategories]);

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "favorites" && tool.favorite) ||
      tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle tool actions
  const handleDeleteTool = async () => {
    if (!toolToDelete) return;

    try {
      await deleteTool(toolToDelete);
      setIsDeleteDialogOpen(false);
      setToolToDelete(null);
      toast("Tool Deleted", {
        description: "The tool has been deleted successfully.",
      });
    } catch {
      toast.error("Error", {
        description: "Failed to delete tool. Please try again.",
      });
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleToolFavorite(id);
    } catch {
      toast.error("Error", {
        description: "Failed to update favorite status. Please try again.",
      });
    }
  };

  const handleRunTool = async () => {
    if (!selectedTool) return;

    // Validate required inputs
    const missingInputs = selectedTool.inputs
      .filter((input) => input.required && !toolInputs[input.name])
      .map((input) => input.name);

    if (missingInputs.length > 0) {
      toast.error("Missing Required Inputs", {
        description: `Please provide values for: ${missingInputs.join(", ")}`,
      });
      return;
    }

    setIsRunning(true);
    setToolResult(null);

    try {
      const result = await runTool(selectedTool.id, toolInputs);
      setToolResult(result);
      toast("Tool Executed", {
        description: "The tool has been executed successfully.",
      });
    } catch {
      toast.error("Error", {
        description: "Failed to run tool. Please try again.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleOpenRunDialog = (tool: Tool) => {
    setSelectedTool(tool);

    // Initialize inputs with default values
    const initialInputs: Record<string, ToolInputValue> = {};
    tool.inputs.forEach((input) => {
      if (input.default !== undefined && input.default !== null) {
        const defaultValue = input.default;
        if (
          typeof defaultValue === "string" ||
          typeof defaultValue === "number" ||
          typeof defaultValue === "boolean"
        ) {
          initialInputs[input.name] = defaultValue;
        }
      }
    });

    setToolInputs(initialInputs);
    setToolResult(null);
    setIsRunDialogOpen(true);
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([fetchTools(), fetchToolCategories()]);
      toast("Refreshed", {
        description: "Tool list has been refreshed.",
      });
    } catch {
      toast.error("Error", {
        description: "Failed to refresh tools. Please try again.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
              <p className="text-muted-foreground">
                Astronomy calculation and utility tools
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/tools/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tool
              </Button>
            </div>
          </div>

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onRefresh={handleRefresh}
          />

          <ToolList
            tools={filteredTools}
            isLoading={isToolLoading}
            searchQuery={searchQuery}
            onRunTool={handleOpenRunDialog}
            onDeleteTool={(id) => {
              setToolToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tool and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setToolToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTool}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Run Tool Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTool?.name}</DialogTitle>
            <DialogDescription>{selectedTool?.description}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Inputs</h3>

                {selectedTool?.inputs.map((input) => (
                  <ToolInputField
                    key={input.id}
                    input={input}
                    value={toolInputs[input.name]}
                    onChange={(value) =>
                      setToolInputs((prev) => ({
                        ...prev,
                        [input.name]: value,
                      }))
                    }
                  />
                ))}

                <div className="pt-4">
                  <Button
                    onClick={handleRunTool}
                    disabled={isRunning}
                    className="w-full"
                  >
                    {isRunning ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Running...
                      </>
                    ) : (
                      "Run Tool"
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Results</h3>
                <ToolResult
                  tool={selectedTool}
                  result={toolResult}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </AppLayout>
  );
}
