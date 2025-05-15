"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { TranslationProvider } from "@/components/i18n";
import { commonTranslations } from "@/components/i18n/common-translations";
import { translations } from "@/components/tools/translations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChevronLeft,
  Plus,
  ArrowLeft,
  Save,
  Trash2,
  AlertCircle,
  MoveUp,
  MoveDown,
  Eye,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { InputEditor } from "@/components/tools/input-editor";
import { OutputEditor } from "@/components/tools/output-editor";
import { PreviewTool } from "@/components/tools/preview-tool";

import type {
  Tool,
  ToolInput,
  ToolOutput,
  ToolCreateParams,
} from "@/types/tool";

// 定义表单验证架构
const formSchema = z.object({
  name: z
    .string()
    .min(3, "名称至少需要3个字符")
    .max(50, "名称不能超过50个字符"),
  description: z
    .string()
    .min(10, "描述至少需要10个字符")
    .max(500, "描述不能超过500个字符"),
  category: z.enum(
    ["calculation", "conversion", "planning", "analysis", "utility"],
    {
      required_error: "请选择工具类别",
    }
  ),
  icon: z.string().min(1, "请选择图标"),
});

type FormValues = z.infer<typeof formSchema>;

function ToolCreatePageContent() {
  const router = useRouter();
  const { createTool } = useAppStore();

  const [inputs, setInputs] = useState<ToolInput[]>([]);
  const [outputs, setOutputs] = useState<ToolOutput[]>([]);
  const [activeTab, setActiveTab] = useState<string>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 使用react-hook-form处理基本表单
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "utility",
      icon: "settings",
    },
  });

  const addInput = useCallback(() => {
    const newInput: ToolInput = {
      id: uuidv4(),
      name: `input_${inputs.length + 1}`,
      description: "描述此输入参数",
      type: "text",
      required: false,
    };
    setInputs((prev) => [...prev, newInput]);
  }, [inputs.length]);

  const updateInput = useCallback((updatedInput: ToolInput) => {
    setInputs((prev) =>
      prev.map((input) => (input.id === updatedInput.id ? updatedInput : input))
    );
  }, []);

  const removeInput = useCallback((id: string) => {
    setInputs((prev) => prev.filter((input) => input.id !== id));
  }, []);

  const moveInput = useCallback((id: string, direction: "up" | "down") => {
    setInputs((prev) => {
      const index = prev.findIndex((input) => input.id === id);
      if (index < 0) return prev;

      const newInputs = [...prev];
      const newIndex =
        direction === "up"
          ? Math.max(0, index - 1)
          : Math.min(prev.length - 1, index + 1);

      if (newIndex === index) return prev;

      // Swap elements
      [newInputs[index], newInputs[newIndex]] = [
        newInputs[newIndex],
        newInputs[index],
      ];
      return newInputs;
    });
  }, []);

  const addOutput = useCallback(() => {
    const newOutput: ToolOutput = {
      id: uuidv4(),
      name: `output_${outputs.length + 1}`,
      description: "描述此输出参数",
      type: "text",
    };
    setOutputs((prev) => [...prev, newOutput]);
  }, [outputs.length]);

  const updateOutput = useCallback((updatedOutput: ToolOutput) => {
    setOutputs((prev) =>
      prev.map((output) =>
        output.id === updatedOutput.id ? updatedOutput : output
      )
    );
  }, []);

  const removeOutput = useCallback((id: string) => {
    setOutputs((prev) => prev.filter((output) => output.id !== id));
  }, []);

  const moveOutput = useCallback((id: string, direction: "up" | "down") => {
    setOutputs((prev) => {
      const index = prev.findIndex((output) => output.id === id);
      if (index < 0) return prev;

      const newOutputs = [...prev];
      const newIndex =
        direction === "up"
          ? Math.max(0, index - 1)
          : Math.min(prev.length - 1, index + 1);

      if (newIndex === index) return prev;

      // Swap elements
      [newOutputs[index], newOutputs[newIndex]] = [
        newOutputs[newIndex],
        newOutputs[index],
      ];
      return newOutputs;
    });
  }, []);

  // 表单提交处理
  const onSubmit = async (values: FormValues) => {
    if (inputs.length === 0) {
      toast.error("错误", {
        description: "至少需要添加一个输入参数",
      });
      setActiveTab("inputs");
      return;
    }

    if (outputs.length === 0) {
      toast.error("错误", {
        description: "至少需要添加一个输出参数",
      });
      setActiveTab("outputs");
      return;
    }

    // 验证输入参数名称唯一性
    const inputNames = inputs.map((input) => input.name);
    if (new Set(inputNames).size !== inputNames.length) {
      toast.error("错误", {
        description: "输入参数名称必须唯一",
      });
      setActiveTab("inputs");
      return;
    }

    // 验证输出参数名称唯一性
    const outputNames = outputs.map((output) => output.name);
    if (new Set(outputNames).size !== outputNames.length) {
      toast.error("错误", {
        description: "输出参数名称必须唯一",
      });
      setActiveTab("outputs");
      return;
    }

    setIsSubmitting(true);

    try {
      const toolData: ToolCreateParams = {
        name: values.name,
        description: values.description,
        category: values.category,
        icon: values.icon,
        favorite: false,
        inputs,
        outputs,
      };

      await createTool(toolData);

      toast.success("成功", {
        description: "工具创建成功",
      });

      router.push("/tools");
    } catch (error) {
      toast.error("错误", {
        description: error instanceof Error ? error.message : "创建工具失败",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 当表单值发生变化时更新预览模式
  const watchedValues = form.watch();

  const previewTool: Tool = {
    id: "preview",
    name: watchedValues.name || "新工具",
    description: watchedValues.description || "工具描述",
    category: watchedValues.category || "utility",
    icon: watchedValues.icon || "settings",
    favorite: false,
    inputs,
    outputs,
  };

  // 初始添加一个输入和输出示例
  useEffect(() => {
    if (inputs.length === 0) {
      addInput();
    }
    if (outputs.length === 0) {
      addOutput();
    }
  }, [inputs.length, outputs.length, addInput, addOutput]);

  return (
    <AppLayout>
      <div className="flex-1 overflow-hidden pb-12 md:pb-0 flex flex-col">
        {/* 页面标题和按钮 */}
        <div className="container max-w-6xl py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/tools")}
              className="mr-1"
              aria-label="返回"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                创建工具
              </h1>
              <p className="text-sm text-muted-foreground">
                创建新的天文计算或分析工具
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.push("/tools")}
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              取消
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 sm:flex-initial"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "隐藏预览" : "显示预览"}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存工具
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 overflow-hidden">
          <div className="container max-w-6xl h-full flex flex-col md:flex-row gap-6">
            {/* 编辑表单部分 */}
            <div
              className={`flex-1 ${
                showPreview ? "md:w-1/2" : "w-full"
              } overflow-hidden`}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full flex flex-col"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basics">基本信息</TabsTrigger>
                  <TabsTrigger value="inputs">输入参数</TabsTrigger>
                  <TabsTrigger value="outputs">输出参数</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 overflow-y-auto px-1">
                  {/* 基本信息表单 */}
                  <TabsContent value="basics" className="space-y-4 mt-0">
                    <Form {...form}>
                      <form className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>工具名称</FormLabel>
                              <FormControl>
                                <Input placeholder="输入工具名称" {...field} />
                              </FormControl>
                              <FormDescription>
                                简洁明了的名称，用于在工具列表中显示
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>描述</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="描述此工具的功能和用途"
                                  className="min-h-20"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                详细说明工具的功能、用途和使用方法
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>类别</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="选择类别" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="calculation">
                                      计算工具
                                    </SelectItem>
                                    <SelectItem value="conversion">
                                      转换工具
                                    </SelectItem>
                                    <SelectItem value="planning">
                                      规划工具
                                    </SelectItem>
                                    <SelectItem value="analysis">
                                      分析工具
                                    </SelectItem>
                                    <SelectItem value="utility">
                                      实用工具
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  工具的分类，便于用户查找
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>图标</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="选择图标" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="settings">
                                      设置
                                    </SelectItem>
                                    <SelectItem value="calculator">
                                      计算器
                                    </SelectItem>
                                    <SelectItem value="chart">图表</SelectItem>
                                    <SelectItem value="compass">
                                      指南针
                                    </SelectItem>
                                    <SelectItem value="calendar">
                                      日历
                                    </SelectItem>
                                    <SelectItem value="stars">星空</SelectItem>
                                    <SelectItem value="moon">月球</SelectItem>
                                    <SelectItem value="sun">太阳</SelectItem>
                                    <SelectItem value="telescope">
                                      望远镜
                                    </SelectItem>
                                    <SelectItem value="camera">相机</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  工具的图标，在工具列表中显示
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* 输入参数配置 */}
                  <TabsContent value="inputs" className="space-y-4 mt-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">输入参数</h3>
                      <Button onClick={addInput} size="sm" className="h-8">
                        <Plus className="h-4 w-4 mr-2" />
                        添加参数
                      </Button>
                    </div>

                    {inputs.length === 0 ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>未添加输入</AlertTitle>
                        <AlertDescription>
                          至少添加一个输入参数以创建工具。
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-6">
                        {inputs.map((input, index) => (
                          <Card key={input.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">
                                  参数 {index + 1}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveInput(input.id, "up")}
                                    disabled={index === 0}
                                    className="h-7 w-7"
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveInput(input.id, "down")}
                                    disabled={index === inputs.length - 1}
                                    className="h-7 w-7"
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => removeInput(input.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <InputEditor
                                input={input}
                                onChange={updateInput}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* 输出参数配置 */}
                  <TabsContent value="outputs" className="space-y-4 mt-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">输出参数</h3>
                      <Button onClick={addOutput} size="sm" className="h-8">
                        <Plus className="h-4 w-4 mr-2" />
                        添加输出
                      </Button>
                    </div>

                    {outputs.length === 0 ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>未添加输出</AlertTitle>
                        <AlertDescription>
                          至少添加一个输出参数以创建工具。
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-6">
                        {outputs.map((output, index) => (
                          <Card key={output.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">
                                  输出 {index + 1}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveOutput(output.id, "up")}
                                    disabled={index === 0}
                                    className="h-7 w-7"
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      moveOutput(output.id, "down")
                                    }
                                    disabled={index === outputs.length - 1}
                                    className="h-7 w-7"
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => removeOutput(output.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <OutputEditor
                                output={output}
                                onChange={updateOutput}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>

            {/* 预览区域 */}
            {showPreview && (
              <>
                <Separator orientation="vertical" className="hidden md:block" />
                <div className="md:w-1/2 flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">工具预览</h3>
                    <div className="flex-1 overflow-auto border rounded-md p-4">
                      <PreviewTool tool={previewTool} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>      </div>
    </AppLayout>
  );
}

export default function ToolCreatePage() {
  // 检测浏览器语言，设置为英文或中文
  const userLanguage = typeof navigator !== 'undefined' ? 
    (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US') : 'en-US';
  
  // 从用户区域确定地区
  const userRegion = userLanguage === 'zh-CN' ? 'CN' : 'US';
  
  return (
    <TranslationProvider 
      initialDictionary={{...commonTranslations[userLanguage], ...translations}}
      lang={userLanguage.split('-')[0]}
      initialRegion={userRegion}
    >
      <ToolCreatePageContent />
    </TranslationProvider>
  );
}
