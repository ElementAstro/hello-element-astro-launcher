import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import type { ToolInput } from "@/types/tool";

// 验证表单数据
const inputSchema = z.object({
  name: z
    .string()
    .min(1, "名称不能为空")
    .max(50, "名称过长")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "只能包含字母、数字和下划线，且必须以字母或下划线开头"
    ),
  description: z.string().min(1, "描述不能为空").max(200, "描述过长"),
  type: z.enum([
    "text",
    "number",
    "date",
    "time",
    "select",
    "checkbox",
    "file",
  ]),
  // 修复：将 required 改为可选属性，与输入类型匹配
  required: z.boolean().default(false).optional(),
  default: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
  placeholder: z.string().optional(),
  help: z.string().optional(),
});

type InputFormValues = z.infer<typeof inputSchema>;

interface InputEditorProps {
  input: ToolInput;
  onChange: (input: ToolInput) => void;
}

export function InputEditor({ input, onChange }: InputEditorProps) {
  const [selectOptions, setSelectOptions] = useState<
    { label: string; value: string }[]
  >(
    input.options?.map((o) =>
      typeof o.value === "string"
        ? { label: o.label, value: o.value }
        : { label: o.label, value: String(o.value) }
    ) || []
  );
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");

  const form = useForm<InputFormValues>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      name: input.name,
      description: input.description,
      type: input.type,
      required: input.required ?? false,
      default: input.default as string | number | boolean | null | undefined,
      placeholder: input.placeholder,
      help: input.help,
    },
  });

  // 监听表单变化并更新父组件 - 移除 any 类型
  const onFormChange = (
    fieldName: keyof InputFormValues,
    value: string | number | boolean | null | undefined
  ) => {
    const updatedInput = { ...input };

    if (fieldName === "default") {
      // 根据类型转换默认值
      if (
        input.type === "number" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        updatedInput.default = Number(value);
      } else if (input.type === "checkbox") {
        updatedInput.default = Boolean(value);
      } else {
        updatedInput.default = value;
      }
    } else if (fieldName === "type") {
      // 当类型变化时，重置默认值和选项
      updatedInput.type = value as typeof input.type;
      updatedInput.default = undefined;

      // 如果切换到select类型但没有选项，添加默认选项
      if (
        value === "select" &&
        (!updatedInput.options || updatedInput.options.length === 0)
      ) {
        updatedInput.options = [{ label: "选项1", value: "option1" }];
        setSelectOptions([{ label: "选项1", value: "option1" }]);
      }
    } else {
      // 使用类型断言为 Record 而不是 any
      (updatedInput as Record<keyof InputFormValues, typeof value>)[fieldName] =
        value;
    }

    // 如果是选择项类型，更新选项
    if (input.type === "select") {
      updatedInput.options = selectOptions.map((o) => ({
        label: o.label,
        value: o.value,
      }));
    }

    onChange(updatedInput);
  };

  // 监听表单提交
  form.watch((value, { name }) => {
    if (name) {
      onFormChange(
        name as keyof InputFormValues,
        value[name as keyof InputFormValues]
      );
    }
  });

  // 添加新选项
  const addOption = () => {
    if (!newOptionLabel.trim() || !newOptionValue.trim()) return;

    const newOption = { label: newOptionLabel, value: newOptionValue };
    const newOptions = [...selectOptions, newOption];
    setSelectOptions(newOptions);

    // 更新父组件
    const updatedInput = { ...input, options: newOptions };
    onChange(updatedInput);

    // 重置输入
    setNewOptionLabel("");
    setNewOptionValue("");
  };

  // 删除选项
  const removeOption = (index: number) => {
    const newOptions = [...selectOptions];
    newOptions.splice(index, 1);
    setSelectOptions(newOptions);

    // 更新父组件
    const updatedInput = { ...input, options: newOptions };
    onChange(updatedInput);
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
                <FormLabel>参数名称 *</FormLabel>
                <FormControl>
                  <Input placeholder="输入名称" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  用于标识此参数的唯一名称
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>参数类型 *</FormLabel>
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
                    <SelectItem value="time">时间</SelectItem>
                    <SelectItem value="select">选择项</SelectItem>
                    <SelectItem value="checkbox">复选框</SelectItem>
                    <SelectItem value="file">文件</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  参数值的数据类型
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
                <Textarea placeholder="描述此参数的用途" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                帮助用户理解此参数的用途
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>必填</FormLabel>
                <FormDescription className="text-xs">
                  标记为必填的参数必须提供值才能运行工具
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* 高级设置 */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced">
            <AccordionTrigger>高级选项</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {/* 默认值 - 根据类型呈现不同控件 */}
                {form.watch("type") !== "file" && (
                  <FormField
                    control={form.control}
                    name="default"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>默认值</FormLabel>
                        <FormControl>
                          {form.watch("type") === "text" && (
                            <Input
                              placeholder="默认文本"
                              {...field}
                              value={(field.value as string) || ""}
                            />
                          )}
                          {form.watch("type") === "number" && (
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              value={(field.value as number) || ""}
                            />
                          )}
                          {form.watch("type") === "date" && (
                            <Input
                              type="date"
                              {...field}
                              value={(field.value as string) || ""}
                            />
                          )}
                          {form.watch("type") === "time" && (
                            <Input
                              type="time"
                              {...field}
                              value={(field.value as string) || ""}
                            />
                          )}
                          {form.watch("type") === "select" &&
                            selectOptions.length > 0 && (
                              <Select
                                onValueChange={field.onChange}
                                value={(field.value as string) || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择默认值" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {selectOptions.map((option, index) => (
                                    <SelectItem
                                      key={index}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          {form.watch("type") === "checkbox" && (
                            <Checkbox
                              checked={(field.value as boolean) || false}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        </FormControl>
                        <FormDescription className="text-xs">
                          参数的初始默认值
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}

                {/* 占位符文本 */}
                {["text", "number"].includes(form.watch("type")) && (
                  <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>占位符</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="输入占位符"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          输入框的占位提示文本
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}

                {/* 帮助文本 */}
                <FormField
                  control={form.control}
                  name="help"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>帮助文本</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="帮助文本"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        向用户提供的额外帮助信息
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 选择项选项管理 */}
                {form.watch("type") === "select" && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">选项</h4>
                      <FormDescription className="text-xs mb-2">
                        定义下拉选择框中的选项
                      </FormDescription>

                      {selectOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Input
                            value={option.label}
                            onChange={(e) => {
                              const newOptions = [...selectOptions];
                              newOptions[index].label = e.target.value;
                              setSelectOptions(newOptions);
                              onFormChange("type", form.watch("type")); // 触发更新
                            }}
                            placeholder="选项标签"
                            className="flex-1"
                          />
                          <Input
                            value={option.value}
                            onChange={(e) => {
                              const newOptions = [...selectOptions];
                              newOptions[index].value = e.target.value;
                              setSelectOptions(newOptions);
                              onFormChange("type", form.watch("type")); // 触发更新
                            }}
                            placeholder="选项值"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Separator className="my-2" />

                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={newOptionLabel}
                          onChange={(e) => setNewOptionLabel(e.target.value)}
                          placeholder="新选项标签"
                          className="flex-1"
                        />
                        <Input
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          placeholder="新选项值"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                          className="whitespace-nowrap"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          添加选项
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 接受的文件类型 */}
                {form.watch("type") === "file" && (
                  <FormItem>
                    <FormLabel>接受的文件类型</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const updatedInput = { ...input, accept: value };
                        onChange(updatedInput);
                      }}
                      defaultValue={input.accept || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择文件类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">所有文件</SelectItem>
                        <SelectItem value="image/*">图片文件</SelectItem>
                        <SelectItem value=".fits,.fit,.fts">
                          FITS文件
                        </SelectItem>
                        <SelectItem value=".csv,.xlsx,.xls">
                          表格文件
                        </SelectItem>
                        <SelectItem value=".txt,.md,.json">文本文件</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      限制可上传的文件类型
                    </FormDescription>
                  </FormItem>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
