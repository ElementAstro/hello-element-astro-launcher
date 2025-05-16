import { useRef, useState, useEffect, useCallback } from "react";
import { ErrorObject } from "ajv";
import { useTranslations } from "@/components/i18n/client"; // 引入 i18n hook

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

// Import JSON schema validation library
import Ajv from "ajv";
const ajv = new Ajv();

// Define the schema for software import JSON data
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
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (data: ImportableSoftware[]) => Promise<ImportResult>;
  trigger?: React.ReactNode;
}

enum ImportStage {
  INITIAL = "initial",
  VALIDATING = "validating",
  IMPORTING = "importing",
  SUCCESS = "success",
  ERROR = "error",
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
  trigger,
}: ImportDialogProps) {
  const [importData, setImportData] = useState<string>("");
  const [importStage, setImportStage] = useState<ImportStage>(
    ImportStage.INITIAL
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [parsedDataCache, setParsedDataCache] = useState<
    ImportableSoftware[] | null
  >(null);
  const [importStats, setImportStats] = useState({
    total: 0,
    success: 0,
    conflicts: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslations(); // 使用 i18n hook

  const [progress, setProgress] = useState(0);
  const [showData, setShowData] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetState = () => {
    setImportData("");
    setImportStage(ImportStage.INITIAL);
    setProgress(0);
    setValidationErrors([]);
    setImportStats({ total: 0, success: 0, conflicts: 0 });
  };

  const closeAndReset = () => {
    onOpenChange(false);
    // Delay resetting state to allow the closing animation to complete
    setTimeout(resetState, 300);
  };

  const validateImportData = (): boolean => {
    try {
      // Validate JSON format
      const parsedData = JSON.parse(importData);
      setParsedDataCache(parsedData);

      // Use AJV to validate data structure
      const valid = validate(parsedData);
      setParsedDataCache(parsedData); // Cache the parsed data upon successful validation

      if (!valid && validate.errors) {
        // Convert validation errors to readable messages
        const errors = validate.errors.map((err) => {
          const path =
            (err as ValidationError).instancePath ||
            (err as ValidationError).dataPath ||
            "Root element"; // Changed from "根元素"
          return `${path} ${err.message}`;
        });

        setValidationErrors(errors);
        setImportStage(ImportStage.ERROR);
        return false;
      }

      return true;
    } catch {
      setValidationErrors([
        "Invalid JSON format. Please check your data format.",
      ]); // Changed from "无效的JSON格式。请检查您的数据格式是否正确。"
      setImportStage(ImportStage.ERROR);
      return false;
    }
  };

  const handleValidatedData = useCallback(async () => {
    try {
      setImportStage(ImportStage.IMPORTING);

      // Parse data
      const parsedData = parsedDataCache as ImportableSoftware[];
      setImportStats((prev) => ({ ...prev, total: parsedData.length }));

      // Import data
      const importResult = await onImport(parsedData);

      // Update import statistics
      setImportStats({
        total: parsedData.length,
        success: importResult.success
          ? parsedData.length - (importResult.conflicts || 0)
          : 0,
        conflicts: importResult.conflicts || 0,
      });

      if (importResult.success) {
        setImportStage(ImportStage.SUCCESS);

        toast.success(
          t("download.import.successTitle", {
            defaultValue: "Import successful",
          }),
          {
            description: importResult.message,
            action: {
              label: t("common.close", { defaultValue: "Close" }),
              onClick: () => {},
            },
          }
        );
      } else {
        throw new Error(importResult.message);
      }
    } catch (error) {
      console.error("Error importing software:", error);

      setValidationErrors([
        error instanceof Error
          ? error.message
          : t("download.import.genericError", {
              defaultValue: "An error occurred during import",
            }),
      ]);

      setImportStage(ImportStage.ERROR);

      toast.error(
        t("download.import.failedTitle", { defaultValue: "Import failed" }),
        {
          description:
            error instanceof Error
              ? error.message
              : t("download.import.errorDescription", {
                  defaultValue: "Error importing software",
                }),
        }
      );
    }
  }, [onImport, parsedDataCache, t]);

  // Simulate progress update
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
          // Simulate non-linear progress: slow start, fast middle, slow near target
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
  }, [importStage, handleValidatedData]);

  const handleImportSoftware = async () => {
    if (importData.trim() === "") {
      setValidationErrors([
        t("download.import.emptyInput", {
          defaultValue: "Please enter JSON data or upload a file",
        }),
      ]);
      setImportStage(ImportStage.ERROR);
      return;
    }

    setValidationErrors([]);
    setImportStage(ImportStage.VALIDATING);

    // Perform front-end data validation first
    validateImportData();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate if the file is JSON
    if (!file.name.endsWith(".json")) {
      setValidationErrors([
        t("download.import.invalidFile", {
          defaultValue: "Please upload a JSON format file",
        }),
      ]);
      setImportStage(ImportStage.ERROR);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportData(content);
        // Clear error state
        if (importStage === ImportStage.ERROR) {
          setImportStage(ImportStage.INITIAL);
          setValidationErrors([]);
        }
      } catch {
        setValidationErrors(["Failed to read file"]); // Changed from "读取文件失败"
        setImportStage(ImportStage.ERROR);
        toast.error("File read error", {
          // Changed from "文件读取错误"
          description: "Could not read the uploaded file.", // Changed from "无法读取上传的文件。"
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
      toast.error("Cannot format", {
        // Changed from "无法格式化"
        description:
          "The input JSON format is invalid and cannot be formatted.", // Changed from "输入的JSON格式无效，无法格式化。"
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
            className="py-5 flex flex-col items-center"
          >
            <Shield className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-base font-medium mb-1.5">
              {importStage === ImportStage.VALIDATING
                ? "Validating data"
                : "Importing software"}
            </h3>
            <p className="text-xs text-muted-foreground text-center mb-4">
              {importStage === ImportStage.VALIDATING
                ? "Validating your data format and structure..."
                : "Importing software data into the system..."}
            </p>

            <div className="w-full space-y-1">
              <div className="w-full bg-muted rounded-full h-1.5 mb-1 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Validate</span>
                <span>Import</span>
                <span>Complete</span>
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
            className="py-5 flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mb-3"
            >
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-base font-medium mb-1.5">Import Successful</h3>
            <p className="text-xs text-muted-foreground text-center mb-4">
              Software data has been successfully imported into the system.
            </p>
            <div className="grid grid-cols-3 w-full gap-3 mb-4">
              <div className="p-2 bg-muted rounded-lg text-center">
                <div className="text-base font-medium">{importStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-base font-medium text-green-600 dark:text-green-400">
                  {importStats.success}
                </div>
                <div className="text-xs text-muted-foreground">Success</div>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center">
                <div className="text-base font-medium text-amber-600 dark:text-amber-400">
                  {importStats.conflicts}
                </div>
                <div className="text-xs text-muted-foreground">Conflicts</div>
              </div>
            </div>
            <Button onClick={closeAndReset} className="w-full h-8 text-xs">
              Done
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
            className="space-y-3 py-3"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 text-xs text-destructive bg-destructive/10 rounded-md">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <p className="font-medium">Import Failed</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-[10px]">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="import-data" className="text-xs">
                JSON Data
              </Label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="import-data"
                  className="w-full min-h-[150px] p-2 border rounded-md font-mono text-xs"
                  placeholder='[{"name": "Example Software", "description": "Description", "category": "Tools", "version": "1.0.0"}]'
                  value={importData}
                  onChange={(e) => {
                    setImportData(e.target.value);
                    // Reset error state when user starts editing
                    if (importStage === ImportStage.ERROR) {
                      setImportStage(ImportStage.INITIAL);
                      setValidationErrors([]);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1.5 right-1.5 h-5 w-5 p-0.5"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={formatJSON}
                  className="text-xs h-7"
                  disabled={!importData.trim()}
                >
                  Format JSON
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="file-upload" className="text-xs">
                Upload JSON File
              </Label>
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
                  className="w-full h-8 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileJson className="h-3.5 w-3.5 mr-1.5" />
                  Select File
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={closeAndReset}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleImportSoftware}
                disabled={!importData.trim()}
                className="h-7 text-xs"
              >
                Retry Import
              </Button>
            </div>
          </motion.div>
        );

      default: // INITIAL state
        return (
          <motion.div
            key="initial"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-3 py-3"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="import-data" className="text-xs">
                  JSON Data
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0.5">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px] p-2 text-xs">
                    <p>
                      Must follow a specific JSON format, including at least
                      name, version, and category fields. Example:
                      <br />
                      <code className="text-[10px]">
                        [{"{"}&quot;name&quot;: &quot;Example Software&quot;,
                        &quot;version&quot;: &quot;1.0&quot;,
                        &quot;category&quot;: &quot;Tools&quot;{"}"}]
                      </code>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="import-data"
                  className="w-full min-h-[150px] p-2 border rounded-md font-mono text-xs"
                  placeholder='[{"name": "Example Software", "description": "Description", "category": "Tools", "version": "1.0.0"}]'
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1.5 right-1.5 h-5 w-5 p-0.5"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={formatJSON}
                  className="text-xs h-7"
                  disabled={!importData.trim()}
                >
                  Format JSON
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="file-upload" className="text-xs">
                Upload JSON File
              </Label>
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
                  className="w-full h-8 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileJson className="h-3.5 w-3.5 mr-1.5" />
                  Select File
                </Button>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
            <Upload className="h-3.5 w-3.5" />
            {t("download.import.button", { defaultValue: "导入软件" })}
          </Button>
        )}
      </DialogTrigger>{" "}
      <DialogContent className="max-w-md p-3">
        <DialogHeader className="pb-1.5 space-y-1">
          <DialogTitle className="text-base flex items-center gap-1.5">
            <FileJson className="h-4 w-4" />
            {t("download.import.title", { defaultValue: "导入软件" })}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t("download.import.description", {
              defaultValue: "从JSON文件或直接粘贴JSON数据导入软件清单。",
            })}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">{getDialogContent()}</AnimatePresence>

        {importStage === ImportStage.INITIAL && (
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportData("")}
              className="h-7 text-xs"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleImportSoftware}
              disabled={!importData.trim()}
              className="h-7 text-xs"
            >
              Import Software
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
