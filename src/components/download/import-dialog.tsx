import { useRef, useState, useEffect } from "react";
import { ErrorObject } from "ajv";

interface ValidationError
  extends Omit<ErrorObject, "dataPath" | "instancePath"> {
  instancePath?: string;
  dataPath?: string;
}
import {
  FileJson,
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ImportableSoftware, ImportResult } from "./types";
import { loadingVariants } from "./animation-variants";

// 导入JSON schema验证库
import Ajv from "ajv";
const ajv = new Ajv();

// 定义软件导入JSON数据的schema
const softwareSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["name", "version", "category"],
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      version: { type: "string", minLength: 1 },
      category: { type: "string", minLength: 1 },
      size: { type: "string" },
      icon: { type: "string" },
      developer: { type: "string" },
      website: { type: "string" },
      dependencies: {
        type: "array",
        items: { type: "string" },
      },
      tags: {
        type: "array",
        items: { type: "string" },
      },
      releaseNotes: { type: "string" },
      rating: { type: "number", minimum: 0, maximum: 5 },
    },
  },
};

const validate = ajv.compile(softwareSchema);

interface ImportDialogProps {
  onImport: (data: ImportableSoftware[]) => Promise<ImportResult>;
}

enum ImportStage {
  INITIAL = "initial",
  VALIDATING = "validating",
  IMPORTING = "importing",
  SUCCESS = "success",
  ERROR = "error",
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [importData, setImportData] = useState("");
  const [importStage, setImportStage] = useState<ImportStage>(
    ImportStage.INITIAL
  );
  const [parsedDataCache, setParsedDataCache] = useState<ImportableSoftware[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [showData, setShowData] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    conflicts: number;
  }>({ total: 0, success: 0, conflicts: 0 });
  const [open, setOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 模拟进度更新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      importStage === ImportStage.VALIDATING ||
      importStage === ImportStage.IMPORTING
    ) {
      let currentProgress = 0;
      const targetProgress = importStage === ImportStage.VALIDATING ? 40 : 100;

      interval = setInterval(() => {
        if (currentProgress < targetProgress) {
          // 模拟非线性进度，开始慢，中间快，接近目标时再慢下来
          const increment =
            importStage === ImportStage.VALIDATING
              ? Math.max(1, 5 - Math.floor(currentProgress / 10))
              : Math.max(1, 5 - Math.floor((currentProgress - 40) / 15));

          currentProgress = Math.min(
            targetProgress,
            currentProgress + increment
          );
          setProgress(currentProgress);
        } else {
          clearInterval(interval);

          if (importStage === ImportStage.VALIDATING) {
            handleValidatedData();
          }
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [importStage]);

  const resetState = () => {
    setImportData("");
    setImportStage(ImportStage.INITIAL);
    setProgress(0);
    setValidationErrors([]);
    setImportStats({ total: 0, success: 0, conflicts: 0 });
  };

  const closeAndReset = () => {
    setOpen(false);
    // 延迟重置状态，以便在关闭动画完成后执行
    setTimeout(resetState, 300);
  };

  const validateImportData = (): boolean => {
    try {
      // 验证JSON格式
      const parsedData = JSON.parse(importData);
      setParsedDataCache(parsedData);

      // 使用AJV验证数据结构
      const valid = validate(parsedData);
      setParsedDataCache(parsedData); // Cache the parsed data upon successful validation

      if (!valid && validate.errors) {
        // 将验证错误转换为可读的消息
        const errors = validate.errors.map((err) => {
          const path =
            (err as ValidationError).instancePath ||
            (err as ValidationError).dataPath ||
            "根元素";
          return `${path} ${err.message}`;
        });

        setValidationErrors(errors);
        setImportStage(ImportStage.ERROR);
        return false;
      }

      return true;
    } catch {
      setValidationErrors(["无效的JSON格式。请检查您的数据格式是否正确。"]);
      setImportStage(ImportStage.ERROR);
      return false;
    }
  };

  const handleValidatedData = async () => {
    try {
      setImportStage(ImportStage.IMPORTING);

      // 解析数据
      const parsedData = parsedDataCache as ImportableSoftware[];
      setImportStats((prev) => ({ ...prev, total: parsedData.length }));

      // 导入数据
      const importResult = await onImport(parsedData);

      // 更新导入统计信息
      setImportStats({
        total: parsedData.length,
        success: importResult.success
          ? parsedData.length - (importResult.conflicts || 0)
          : 0,
        conflicts: importResult.conflicts || 0,
      });

      if (importResult.success) {
        setImportStage(ImportStage.SUCCESS);

        toast.success("导入成功", {
          description: importResult.message,
          action: {
            label: "关闭",
            onClick: () => {},
          },
        });
      } else {
        throw new Error(importResult.message);
      }
    } catch (error) {
      console.error("Error importing software:", error);

      setValidationErrors([
        error instanceof Error ? error.message : "导入过程中出现错误",
      ]);

      setImportStage(ImportStage.ERROR);

      toast.error("导入失败", {
        description: error instanceof Error ? error.message : "导入软件时出错",
      });
    }
  };

  const handleImportSoftware = async () => {
    if (importData.trim() === "") {
      setValidationErrors(["请输入JSON数据或上传文件"]);
      setImportStage(ImportStage.ERROR);
      return;
    }

    setValidationErrors([]);
    setImportStage(ImportStage.VALIDATING);

    // 先进行前端数据验证
    validateImportData();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件是否为JSON
    if (!file.name.endsWith(".json")) {
      setValidationErrors(["请上传JSON格式的文件"]);
      setImportStage(ImportStage.ERROR);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportData(content);
        // 清除错误状态
        if (importStage === ImportStage.ERROR) {
          setImportStage(ImportStage.INITIAL);
          setValidationErrors([]);
        }
      } catch {
        setValidationErrors(["读取文件失败"]);
        setImportStage(ImportStage.ERROR);
        toast.error("文件读取错误", {
          description: "无法读取上传的文件。",
        });
      }
    };
    reader.readAsText(file);
  };

  const formatJSON = () => {
    try {
      const parsedData = JSON.parse(importData);
      const formatted = JSON.stringify(parsedData, null, 2);
      setImportData(formatted);
    } catch {
      toast.error("无法格式化", {
        description: "输入的JSON格式无效，无法格式化。",
      });
    }
  };

  const getDialogContent = () => {
    switch (importStage) {
      case ImportStage.VALIDATING:
      case ImportStage.IMPORTING:
        return (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 flex flex-col items-center"
          >
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {importStage === ImportStage.VALIDATING
                ? "正在验证数据"
                : "正在导入软件"}
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {importStage === ImportStage.VALIDATING
                ? "正在验证您的数据格式和结构..."
                : "正在将软件数据导入到系统中..."}
            </p>

            <div className="w-full space-y-1">
              <div className="w-full bg-muted rounded-full h-2 mb-1 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>验证</span>
                <span>导入</span>
                <span>完成</span>
              </div>
            </div>
          </motion.div>
        );

      case ImportStage.SUCCESS:
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>

            <h3 className="text-lg font-medium mb-2">导入成功</h3>
            <p className="text-muted-foreground text-center mb-6">
              软件数据已成功导入到系统
            </p>

            <div className="grid grid-cols-3 w-full gap-4 mb-6">
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-medium">{importStats.total}</div>
                <div className="text-xs text-muted-foreground">总数</div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-lg font-medium text-green-600 dark:text-green-400">
                  {importStats.success}
                </div>
                <div className="text-xs text-muted-foreground">成功</div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center">
                <div className="text-lg font-medium text-amber-600 dark:text-amber-400">
                  {importStats.conflicts}
                </div>
                <div className="text-xs text-muted-foreground">冲突</div>
              </div>
            </div>

            <Button onClick={closeAndReset} className="w-full">
              完成
            </Button>
          </motion.div>
        );

      case ImportStage.ERROR:
        return (
          <motion.div
            key="error"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-medium">导入失败</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-xs">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-data">JSON 数据</Label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="import-data"
                  className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                  placeholder='[{"name": "示例软件", "description": "描述", "category": "工具", "version": "1.0.0"}]'
                  value={importData}
                  onChange={(e) => {
                    setImportData(e.target.value);
                    // 当用户开始编辑，重置错误状态
                    if (importStage === ImportStage.ERROR) {
                      setImportStage(ImportStage.INITIAL);
                      setValidationErrors([]);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={formatJSON}
                  className="text-xs"
                  disabled={!importData.trim()}
                >
                  格式化 JSON
                </Button>
              </div>
            </div>

            {/* 文件上传部分保持不变 */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">或者</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">上传 JSON 文件</Label>
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
                  选择文件
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={closeAndReset}>
                取消
              </Button>
              <Button
                onClick={handleImportSoftware}
                disabled={!importData.trim()}
              >
                重试导入
              </Button>
            </div>
          </motion.div>
        );

      default: // INITIAL 状态
        return (
          <motion.div
            key="initial"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="import-data">JSON 数据</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>
                      需要遵循特定的JSON格式，至少包含name、version和category字段。
                      例如：
                      <br />
                      <code>
                        [{"{"}&quot;name&quot;: &quot;示例软件&quot;,
                        &quot;version&quot;: &quot;1.0&quot;,
                        &quot;category&quot;: &quot;工具&quot;{"}"}]
                      </code>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="import-data"
                  className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                  placeholder='[{"name": "示例软件", "description": "描述", "category": "工具", "version": "1.0.0"}]'
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={formatJSON}
                  className="text-xs"
                  disabled={!importData.trim()}
                >
                  格式化 JSON
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">或者</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">上传 JSON 文件</Label>
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
                  选择文件
                </Button>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          导入
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导入软件列表</DialogTitle>
          <DialogDescription>
            粘贴软件的 JSON 数组或上传 JSON
            文件。系统将检查重复并与现有软件合并。
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">{getDialogContent()}</AnimatePresence>

        {importStage === ImportStage.INITIAL && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportData("")}>
              清空
            </Button>
            <Button
              onClick={handleImportSoftware}
              disabled={!importData.trim()}
            >
              导入软件
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
