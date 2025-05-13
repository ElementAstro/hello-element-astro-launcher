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
import { useTranslations } from "@/components/i18n";

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
  const { t } = useTranslations();
  
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
        return t("editors.textOutputDesc");
      case "number":
        return t("editors.numberOutputDesc");
      case "date":
        return t("editors.dateOutputDesc");
      case "image":
        return t("editors.imageOutputDesc");
      case "file":
        return t("editors.fileOutputDesc");
      case "chart":
        return t("editors.chartOutputDesc");
      case "table":
        return t("editors.tableOutputDesc");
      default:
        return t("editors.defaultOutputDesc");
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
            render={({ field }) => (              <FormItem>
                <FormLabel>{t("editors.outputName")} *</FormLabel>
                <FormControl>
                  <Input placeholder={t("editors.enterName")} {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  {t("editors.outputNameDescription")}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (              <FormItem>
                <FormLabel>{t("editors.outputType")} *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("editors.selectType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">{t("editors.text")}</SelectItem>
                    <SelectItem value="number">{t("editors.number")}</SelectItem>
                    <SelectItem value="date">{t("editors.date")}</SelectItem>
                    <SelectItem value="image">{t("editors.image")}</SelectItem>
                    <SelectItem value="file">{t("editors.file")}</SelectItem>
                    <SelectItem value="chart">{t("editors.chart")}</SelectItem>
                    <SelectItem value="table">{t("editors.table")}</SelectItem>
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
          render={({ field }) => (            <FormItem>
              <FormLabel>{t("editors.description")} *</FormLabel>
              <FormControl>
                <Textarea placeholder={t("editors.descriptionPlaceholder")} {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                {t("editors.descriptionHelpText")}
              </FormDescription>
            </FormItem>
          )}
        />

        {/* 输出类型的高级帮助信息 */}
        {["chart", "table"].includes(form.watch("type")) && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="typeHelp">              <AccordionTrigger>{t("editors.typeHelp")}</AccordionTrigger>
              <AccordionContent>
                {form.watch("type") === "chart" && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-medium">{t("editors.chartOutput")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("editors.chartDescription")}
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
