"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Star,
  Calculator,
  ArrowLeftRight,
  Calendar,
  BarChart,
  Wrench,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Play,
  Edit,
  Trash2,
  Copy,
  History,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppStore } from "@/store/store";
import type {
  Tool,
  ToolInput,
  ToolResult,
  ToolInputValue,
  TableData,
  ChartData,
  CellValue,
} from "@/types/tool";
import { format, parseISO } from "date-fns";

export default function ToolsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolInputs, setToolInputs] = useState<Record<string, ToolInputValue>>(
    {}
  );
  const [toolResult, setToolResult] = useState<ToolResult | null>(null);
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
      if (input.default !== undefined) {
        initialInputs[input.name] = input.default;
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

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-full md:w-auto"
              >
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="flex items-center gap-1"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="calculation">Calculation</TabsTrigger>
                  <TabsTrigger value="planning">Planning</TabsTrigger>
                  <TabsTrigger value="utility">Utility</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isToolLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Calculator className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tools found</h3>
              <p className="text-muted-foreground mt-2 mb-4 max-w-md">
                {searchQuery
                  ? "No tools match your search criteria. Try a different search term."
                  : "You haven't created any tools yet. Create your first tool to help with your astronomy calculations."}
              </p>
              <Button onClick={() => router.push("/tools/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tool
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onRun={() => handleOpenRunDialog(tool)}
                  onEdit={() => router.push(`/tools/edit/${tool.id}`)}
                  onDelete={() => {
                    setToolToDelete(tool.id);
                    setIsDeleteDialogOpen(true);
                  }}
                  onToggleFavorite={() => handleToggleFavorite(tool.id)}
                />
              ))}
            </div>
          )}
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
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Tool
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Results</h3>

                {!toolResult ? (
                  <div className="border rounded-md p-8 flex items-center justify-center h-[300px]">
                    <div className="text-center text-muted-foreground">
                      {isRunning ? (
                        <div className="space-y-2">
                          <RefreshCw className="h-8 w-8 mx-auto animate-spin" />
                          <p>Processing...</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Play className="h-8 w-8 mx-auto" />
                          <p>Run the tool to see results</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className="text-green-500 border-green-500"
                      >
                        Completed
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Duration: {(toolResult.duration / 1000).toFixed(2)}s
                      </span>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {selectedTool?.outputs.map((output) => {
                        const value = toolResult.outputs[output.name];

                        if (!value) return null;

                        return (
                          <div key={output.id} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              {output.description}
                            </Label>

                            {output.type === "image" ? (
                              <div className="border rounded-md p-2 flex justify-center">
                                <Image
                                  src={
                                    typeof value === "string"
                                      ? value
                                      : "/placeholder.svg"
                                  }
                                  alt={output.name}
                                  width={300}
                                  height={200}
                                  className="object-contain"
                                />
                              </div>
                            ) : output.type === "table" ? (
                              <div className="border rounded-md overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      {Object.keys(value[0] || {}).map(
                                        (key) => (
                                          <TableHead key={key}>{key}</TableHead>
                                        )
                                      )}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {(value as TableRow[]).map((row, i) => (
                                      <TableRow key={i}>
                                        {Object.values(row).map((cell, j) => (
                                          <TableCell key={j}>
                                            {cell?.toString()}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : output.type === "chart" ? (
                              <div className="border rounded-md p-2 flex justify-center">
                                <Image
                                  src={
                                    typeof value === "string"
                                      ? value
                                      : "/placeholder.svg"
                                  }
                                  alt={output.name}
                                  width={400}
                                  height={200}
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="p-2 bg-muted rounded-md">
                                <span className="text-sm">
                                  {value.toString()}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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

interface ToolCardProps {
  tool: Tool;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

function ToolCard({
  tool,
  onRun,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ToolCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">{getCategoryIcon(tool.category)}</div>
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {tool.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Star
              className={`h-4 w-4 ${
                tool.favorite ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          {tool.lastUsed ? (
            <>
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Last used: {format(parseISO(tool.lastUsed), "MMM d, yyyy")}
              </span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-2" />
              <span>Never used</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <History className="h-4 w-4 mr-2" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onRun}>
          <Play className="h-4 w-4 mr-2" />
          Run
        </Button>
      </CardFooter>
    </Card>
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "calculation":
      return <Calculator className="h-4 w-4" />;
    case "conversion":
      return <ArrowLeftRight className="h-4 w-4" />;
    case "planning":
      return <Calendar className="h-4 w-4" />;
    case "analysis":
      return <BarChart className="h-4 w-4" />;
    case "utility":
      return <Wrench className="h-4 w-4" />;
    default:
      return <Wrench className="h-4 w-4" />;
  }
}

interface ToolInputFieldProps {
  input: ToolInput;
  value: ToolInputValue;
  onChange: (value: ToolInputValue) => void;
}

function ToolInputField({ input, value, onChange }: ToolInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value: inputValue } = e.target;

    if (type === "number") {
      onChange(inputValue === "" ? "" : Number(inputValue));
    } else if (type === "checkbox") {
      onChange(e.target.checked);
    } else {
      onChange(inputValue);
    }
  };

  const renderInput = () => {
    switch (input.type) {
      case "text":
        return (
          <Input
            id={input.id}
            value={value || ""}
            onChange={handleChange}
            placeholder={input.description}
            required={input.required}
          />
        );

      case "number":
        return (
          <Input
            id={input.id}
            type="number"
            value={value ?? ""}
            onChange={handleChange}
            placeholder={input.description}
            required={input.required}
            min={input.validation?.min}
            max={input.validation?.max}
          />
        );

      case "date":
        return (
          <Input
            id={input.id}
            type="date"
            value={value || ""}
            onChange={handleChange}
            required={input.required}
          />
        );

      case "time":
        return (
          <Input
            id={input.id}
            type="time"
            value={value || ""}
            onChange={handleChange}
            required={input.required}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              id={input.id}
              type="checkbox"
              checked={value || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={input.id}>{input.description}</Label>
          </div>
        );

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={input.description} />
            </SelectTrigger>
            <SelectContent>
              {input.options?.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            id={input.id}
            value={value || ""}
            onChange={handleChange}
            placeholder={input.description}
            required={input.required}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={input.id} className="flex items-center gap-1">
        {input.description}
        {input.required && <span className="text-red-500">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
}
