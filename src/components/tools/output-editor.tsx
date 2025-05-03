import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import type { ToolOutput } from "@/types/tool";

// 验证表单数据
const outputSchema = z.object({
  name: z
    .string()
    .min(1, "名称不能为空")
    .max(50, "名称过长")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "只能包含字母、数字和下划线，且必须以字母或下划线开头"
    ),
  description: z.string().min(1, "描述不能为空").max(200, "描述过长"),
  type: z.enum(["text", "number", "date", "image", "file", "chart", "table"]),
});

type OutputFormValues = z.infer<typeof outputSchema>;

interface OutputEditorProps {
  output: ToolOutput;
  onChange: (output: ToolOutput) => void;
}

export function OutputEditor({ output, onChange }: OutputEditorProps) {
  const form = useForm<OutputFormValues>({
    resolver: zodResolver(outputSchema),
    defaultValues: {
      name: output.name,
      description: output.description,
      type: output.type,
    },
  });

  // 监听表单变化并更新父组件 - 移除 any 类型
  const onFormChange = (
    fieldName: keyof OutputFormValues,
    value: string | undefined
  ) => {
    const updatedOutput = { ...output };
    // 使用类型断言为 Record 而不是 any
    (updatedOutput as Record<keyof OutputFormValues, string | undefined>)[
      fieldName
    ] = value;
    onChange(updatedOutput);
  };

  // 监听表单提交
  form.watch((value, { name }) => {
    if (name) {
      onFormChange(
        name as keyof OutputFormValues,
        value[name as keyof OutputFormValues]
      );
    }
  });

  // 获取输出类型的说明
  const getOutputTypeDescription = (type: string) => {
    switch (type) {
      case "text":
        return "文本输出，如计算结果、状态信息等";
      case "number":
        return "数值输出，如计算结果、测量值等";
      case "date":
        return "日期输出，如计算得到的日期时间";
      case "image":
        return "图像输出，如图表、天体图像等";
      case "file":
        return "文件输出，如生成的报告或数据文件";
      case "chart":
        return "图表输出，如折线图、柱状图等";
      case "table":
        return "表格数据输出，如数据列表、结果集等";
      default:
        return "输出结果的数据类型";
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        {/* 基本设置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>输出名称 *</FormLabel>
                <FormControl>
                  <Input placeholder="输入名称" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  用于标识此输出的唯一名称
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>输出类型 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">文本</SelectItem>
                    <SelectItem value="number">数字</SelectItem>
                    <SelectItem value="date">日期</SelectItem>
                    <SelectItem value="image">图像</SelectItem>
                    <SelectItem value="file">文件</SelectItem>
                    <SelectItem value="chart">图表</SelectItem>
                    <SelectItem value="table">表格</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  {getOutputTypeDescription(form.watch("type"))}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述 *</FormLabel>
              <FormControl>
                <Textarea placeholder="描述此输出的内容和用途" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                帮助用户理解此输出的含义
              </FormDescription>
            </FormItem>
          )}
        />

        {/* 输出类型的高级帮助信息 */}
        {["chart", "table"].includes(form.watch("type")) && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="typeHelp">
              <AccordionTrigger>类型说明</AccordionTrigger>
              <AccordionContent>
                {form.watch("type") === "chart" && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-medium">图表输出</h4>
                    <p className="text-sm text-muted-foreground">
                      图表输出将以可视化图表的形式呈现数据，支持以下图表类型：
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>
                        线图（Line Chart）- 显示数据随时间或序列的变化趋势
                      </li>
                      <li>柱状图（Bar Chart）- 比较不同类别的数据</li>
                      <li>饼图（Pie Chart）- 展示部分与整体的关系</li>
                      <li>散点图（Scatter Plot）- 显示两个变量之间的关系</li>
                      <li>面积图（Area Chart）- 强调总量随时间的变化趋势</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      工具需要返回符合标准图表数据格式的结果。
                    </p>
                  </div>
                )}

                {form.watch("type") === "table" && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-medium">表格输出</h4>
                    <p className="text-sm text-muted-foreground">
                      表格输出将以行和列的形式组织数据，适用于多维数据展示：
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>支持任意数量的行和列</li>
                      <li>数据可包括文本、数字、日期等</li>
                      <li>可进行排序和简单的数据操作</li>
                      <li>适合多维数据的比较和分析</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      工具需要返回符合标准表格数据格式（行和列的数组）的结果。
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </form>
    </Form>
  );
}
