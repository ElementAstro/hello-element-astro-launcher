import { useState } from "react";
import {
  Calculator,
  Calendar,
  Camera,
  ChartBarIcon,
  Compass,
  FileIcon,
  Settings,
  Stars,
  Moon,
  SunIcon,
  Telescope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// 移除未使用的导入
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter, // 移除未使用的导入
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import type { Tool, ToolInput, ToolOutput, InputOption } from "@/types/tool";

interface PreviewToolProps {
  tool: Tool;
}

export function PreviewTool({ tool }: PreviewToolProps) {
  const [selectedTab, setSelectedTab] = useState<"inputs" | "outputs">(
    "inputs"
  );

  // 工具图标映射
  const IconMap: Record<string, React.ReactNode> = {
    settings: <Settings className="h-5 w-5" />,
    calculator: <Calculator className="h-5 w-5" />,
    chart: <ChartBarIcon className="h-5 w-5" />,
    compass: <Compass className="h-5 w-5" />,
    calendar: <Calendar className="h-5 w-5" />,
    stars: <Stars className="h-5 w-5" />,
    moon: <Moon className="h-5 w-5" />,
    sun: <SunIcon className="h-5 w-5" />,
    telescope: <Telescope className="h-5 w-5" />,
    camera: <Camera className="h-5 w-5" />,
    file: <FileIcon className="h-5 w-5" />,
  };

  // 类别映射
  const categoryMap: Record<string, string> = {
    calculation: "计算工具",
    conversion: "转换工具",
    planning: "规划工具",
    analysis: "分析工具",
    utility: "实用工具",
  };

  // 根据工具类型渲染输入控件 - 修复 any 类型
  const renderInputField = (input: ToolInput, index: number) => {
    switch (input.type) {
      case "text":
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`input-${input.name}`}>
              {input.name}{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`input-${input.name}`}
              placeholder={input.placeholder || `输入${input.name}`}
              defaultValue={input.default as string}
              readOnly
            />
            {input.description && (
              <p className="text-xs text-muted-foreground">
                {input.description}
              </p>
            )}
          </div>
        );
      case "number":
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`input-${input.name}`}>
              {input.name}{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`input-${input.name}`}
              type="number"
              placeholder={input.placeholder || "0"}
              defaultValue={input.default as number}
              readOnly
            />
            {input.description && (
              <p className="text-xs text-muted-foreground">
                {input.description}
              </p>
            )}
          </div>
        );
      case "date":
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`input-${input.name}`}>
              {input.name}{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`input-${input.name}`}
              type="date"
              defaultValue={input.default as string}
              readOnly
            />
            {input.description && (
              <p className="text-xs text-muted-foreground">
                {input.description}
              </p>
            )}
          </div>
        );
      case "time":
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`input-${input.name}`}>
              {input.name}{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`input-${input.name}`}
              type="time"
              defaultValue={input.default as string}
              readOnly
            />
            {input.description && (
              <p className="text-xs text-muted-foreground">
                {input.description}
              </p>
            )}
          </div>
        );
      case "select":
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`input-${input.name}`}>
              {input.name}{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Select defaultValue={(input.default as string) || ""} disabled>
              <SelectTrigger id={`input-${input.name}`}>
                <SelectValue placeholder="选择选项" />
              </SelectTrigger>
              <SelectContent>
                {input.options?.map((option: InputOption, i: number) => (
                  <SelectItem key={i} value={option.value as string}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {input.description && (
              <p className="text-xs text-muted-foreground">
                {input.description}
              </p>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div key={index} className="flex items-start space-x-2 mt-2">
            <Checkbox
              id={`input-${input.name}`}
              defaultChecked={input.default as boolean}
              disabled
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={`input-${input.name}`}
                className="text-sm font-medium"
              >
                {input.name}{" "}
                {input.required && <span className="text-red-500">*</span>}
              </Label>
              {input.description && (
                <p className="text-xs text-muted-foreground">
                  {input.description}
                </p>
              )}
            </div>
          </div>
        );
      case "file":
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`input-${input.name}`}>
              {input.name}{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="border border-dashed rounded-md py-4 px-3">
              <div className="flex flex-col items-center justify-center gap-1">
                <FileIcon className="h-10 w-10 text-muted-foreground/70" />
                <p className="text-sm text-muted-foreground">
                  选择文件或拖放至此处
                </p>
                {input.accept && (
                  <p className="text-xs text-muted-foreground">
                    支持的格式: {input.accept}
                  </p>
                )}
              </div>
            </div>
            {input.description && (
              <p className="text-xs text-muted-foreground">
                {input.description}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // 根据类型渲染输出展示 - 修复 any 类型
  const renderOutputField = (output: ToolOutput, index: number) => {
    const getPlaceholderContent = () => {
      switch (output.type) {
        case "text":
          return "文本输出结果将显示在这里";
        case "number":
          return "数值计算结果将显示在这里";
        case "date":
          return "2025-05-03";
        case "image":
          return (
            <div className="border rounded-md p-6 flex flex-col items-center justify-center gap-2">
              <Camera className="h-10 w-10 text-muted-foreground/70" />
              <p className="text-sm text-muted-foreground">
                图像输出将展示在这里
              </p>
            </div>
          );
        case "file":
          return (
            <div className="border rounded-md p-6 flex flex-col items-center justify-center gap-2">
              <FileIcon className="h-10 w-10 text-muted-foreground/70" />
              <p className="text-sm text-muted-foreground">
                文件结果将提供下载链接
              </p>
            </div>
          );
        case "chart":
          return (
            <div className="border rounded-md p-6 flex flex-col items-center justify-center gap-2">
              <ChartBarIcon className="h-10 w-10 text-muted-foreground/70" />
              <p className="text-sm text-muted-foreground">
                图表结果将显示在这里
              </p>
            </div>
          );
        case "table":
          return (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-sm font-medium text-left">
                      列标题 1
                    </th>
                    <th className="p-2 text-sm font-medium text-left">
                      列标题 2
                    </th>
                    <th className="p-2 text-sm font-medium text-left">
                      列标题 3
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 text-sm">数据 1</td>
                    <td className="p-2 text-sm">数据 2</td>
                    <td className="p-2 text-sm">数据 3</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 text-sm">数据 4</td>
                    <td className="p-2 text-sm">数据 5</td>
                    <td className="p-2 text-sm">数据 6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        default:
          return "结果将显示在这里";
      }
    };

    return (
      <div key={index} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`output-${output.name}`}>{output.name}</Label>
          <Badge variant="outline" className="text-xs">
            {output.type}
          </Badge>
        </div>
        <div className="min-h-[100px] bg-muted/20 rounded-md p-2">
          {getPlaceholderContent()}
        </div>
        {output.description && (
          <p className="text-xs text-muted-foreground">{output.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="gap-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {IconMap[tool.icon] || <Settings className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle>{tool.name || "未命名工具"}</CardTitle>
                <CardDescription>
                  {categoryMap[tool.category] || "工具"}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {tool.description || "暂无描述"}
          </p>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              selectedTab === "inputs"
                ? "bg-primary/10 border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setSelectedTab("inputs")}
          >
            输入参数 ({tool.inputs.length})
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              selectedTab === "outputs"
                ? "bg-primary/10 border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setSelectedTab("outputs")}
          >
            输出结果 ({tool.outputs.length})
          </button>
        </div>

        <div className="p-4">
          {selectedTab === "inputs" ? (
            <div className="space-y-4">
              {tool.inputs.length > 0 ? (
                tool.inputs.map((input, index) =>
                  renderInputField(input, index)
                )
              ) : (
                <p className="text-muted-foreground text-sm">未配置输入参数</p>
              )}
              <Button className="w-full mt-4" disabled>
                运行工具
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {tool.outputs.length > 0 ? (
                tool.outputs.map((output, index) =>
                  renderOutputField(output, index)
                )
              ) : (
                <p className="text-muted-foreground text-sm">未配置输出结果</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
