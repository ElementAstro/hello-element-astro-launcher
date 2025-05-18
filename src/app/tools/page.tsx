"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import type {
  Tool,
  ToolInputValue,
  ToolResult as ToolResultType,
} from "@/types/tool";

import { SearchAndFilter } from "@/components/tools/search-and-filter";
import { ToolList } from "@/components/tools/tool-list";
import { ToolInputField } from "@/components/tools/tool-input-field";
import { ToolResult } from "@/components/tools/tool-result";

function ToolsPageContent() {
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

  // 使用 useCallback 优化函数引用
  const loadData = useCallback(async () => {
    try {
      await Promise.all([fetchTools(), fetchToolCategories()]);
    } catch {
      toast("加载工具失败。请重试。");
    }
  }, [fetchTools, fetchToolCategories]);

  // 在组件挂载时加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 使用 useMemo 优化工具过滤
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "favorites" && tool.favorite) ||
        tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  // 处理删除工具
  const handleDeleteTool = async () => {
    if (!toolToDelete) return;

    try {
      await deleteTool(toolToDelete);
      setIsDeleteDialogOpen(false);
      setToolToDelete(null);
      toast("工具已删除", {
        description: "工具已成功删除。",
      });
    } catch {
      toast.error("错误", {
        description: "删除工具失败。请重试。",
      });
    }
  };

  // 处理收藏工具
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      try {
        await toggleToolFavorite(id);
      } catch {
        toast.error("错误", {
          description: "更新收藏状态失败。请重试。",
        });
      }
    },
    [toggleToolFavorite]
  );

  // 处理工具运行
  const handleRunTool = async () => {
    if (!selectedTool) return;

    // 验证必填输入
    const missingInputs = selectedTool.inputs
      .filter((input) => input.required && !toolInputs[input.name])
      .map((input) => input.name);

    if (missingInputs.length > 0) {
      toast.error("缺少必填输入", {
        description: `请提供以下字段的值: ${missingInputs.join(", ")}`,
      });
      return;
    }

    setIsRunning(true);
    setToolResult(null);

    try {
      const result = await runTool(selectedTool.id, toolInputs);
      setToolResult(result);
      toast("工具已执行", {
        description: "工具已成功执行。",
      });
    } catch {
      toast.error("错误", {
        description: "运行工具失败。请重试。",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // 处理打开运行对话框
  const handleOpenRunDialog = useCallback((tool: Tool) => {
    setSelectedTool(tool);

    // 初始化输入默认值
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
  }, []);

  // 刷新工具列表
  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([fetchTools(), fetchToolCategories()]);
      toast("已刷新", {
        description: "工具列表已刷新。",
      });
    } catch {
      toast.error("错误", {
        description: "刷新工具列表失败。请重试。",
      });
    }
  }, [fetchTools, fetchToolCategories]);

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto pb-12 md:pb-0">
        <div className="container max-w-6xl py-4 md:py-6 space-y-4 md:space-y-6">
          {/* 标题区域 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                工具
              </h1>
              <p className="text-sm text-muted-foreground">
                天文计算和工具集合
              </p>
            </div>
            <Button
              onClick={() => router.push("/tools/create")}
              className="w-full sm:w-auto group"
              aria-label="创建工具"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              创建工具
            </Button>
          </div>

          {/* 搜索和筛选 */}
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onRefresh={handleRefresh}
          />

          {/* 工具列表 */}
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

      {/* 删除确认对话框 */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤消。这将永久删除该工具及其所有数据。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setToolToDelete(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTool}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 运行工具对话框 */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent className="sm:max-w-xl lg:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTool?.name}</DialogTitle>
            <DialogDescription>{selectedTool?.description}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto py-3 md:py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* 输入部分 */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-sm font-medium">输入</h3>

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

                <div className="pt-3 md:pt-4">
                  <Button
                    onClick={handleRunTool}
                    disabled={isRunning}
                    className="w-full transition-all"
                  >
                    {isRunning ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        正在运行...
                      </>
                    ) : (
                      "运行工具"
                    )}
                  </Button>
                </div>
              </div>

              {/* 结果部分 */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-sm font-medium">结果</h3>
                <ToolResult
                  tool={selectedTool}
                  result={toolResult}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-3 md:mt-4">
            <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </AppLayout>
  );
}

export default function ToolsPage() {
  // 现在使用统一的PageTranslationProvider和ToolsTranslationProvider
  // 它们在layout.tsx中配置，这里直接渲染内容
  return <ToolsPageContent />;
}
