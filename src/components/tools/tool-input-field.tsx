import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolInput, ToolInputValue } from "@/types/tool";
import { VARIANTS } from "./animation-constants";

interface ToolInputFieldProps {
  input: ToolInput;
  value: ToolInputValue | undefined;
  onChange: (value: ToolInputValue) => void;
  error?: string;
}

export function ToolInputField({
  input,
  value,
  onChange,
  error,
}: ToolInputFieldProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // 处理表单失焦验证
  const handleBlur = () => {
    setTouched(true);
    validate();
  };

  // 验证输入值
  const validate = (): boolean => {
    // 如果必填项为空
    if (
      input.required &&
      (value === undefined || value === "" || value === null)
    ) {
      setLocalError(`${input.description} 是必填项`);
      return false;
    }

    // 数字类型验证
    if (input.type === "number" && typeof value === "number") {
      if (input.validation?.min !== undefined && value < input.validation.min) {
        setLocalError(`${input.description} 不能小于 ${input.validation.min}`);
        return false;
      }
      if (input.validation?.max !== undefined && value > input.validation.max) {
        setLocalError(`${input.description} 不能大于 ${input.validation.max}`);
        return false;
      }
    }

    // 文本类型验证
    if (
      input.type === "text" &&
      typeof value === "string" &&
      input.validation?.pattern
    ) {
      const regex = new RegExp(input.validation.pattern);
      if (!regex.test(value)) {
        setLocalError(`${input.description} 格式不正确`);
        return false;
      }
    }

    // 自定义验证器（如果有）
    if (input.validation?.customValidator && typeof window !== "undefined") {
      try {
        const validatorFunc = new Function(
          "value",
          input.validation.customValidator
        );
        const result = validatorFunc(value);
        if (result !== true) {
          setLocalError(
            typeof result === "string" ? result : `${input.description} 无效`
          );
          return false;
        }
      } catch (err) {
        console.error("Custom validator error:", err);
      }
    }

    setLocalError(null);
    return true;
  };

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value: inputValue } = e.target;
    let newValue: ToolInputValue;

    if (type === "number") {
      newValue = inputValue === "" ? "" : Number(inputValue);
    } else if (type === "checkbox") {
      newValue = e.target.checked;
    } else {
      newValue = inputValue;
    }

    onChange(newValue);

    if (touched) {
      setTimeout(() => validate(), 0);
    }
  };

  // 检查外部错误并更新本地错误状态
  useEffect(() => {
    if (error) {
      setLocalError(error);
      setTouched(true);
    }
  }, [error]);

  const renderInput = () => {
    // 确定错误状态
    const hasError = touched && (localError || error);
    const errorClass = hasError ? "border-red-500 focus:ring-red-500" : "";

    switch (input.type) {
      case "text":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Input
              id={input.id}
              value={typeof value === "string" ? value : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={input.description}
              required={input.required}
              className={errorClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );

      case "number":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Input
              id={input.id}
              type="number"
              value={typeof value === "number" || value === "" ? value : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={input.description}
              required={input.required}
              min={input.validation?.min}
              max={input.validation?.max}
              step="any"
              className={errorClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );

      case "date":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Input
              id={input.id}
              type="date"
              value={typeof value === "string" ? value : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              required={input.required}
              className={errorClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );

      case "time":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Input
              id={input.id}
              type="time"
              value={typeof value === "string" ? value : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              required={input.required}
              className={errorClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );

      case "checkbox":
        return (
          <motion.div
            className="flex items-center space-x-2"
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
            whileHover={{ scale: 1.02 }}
          >
            <Checkbox
              id={input.id}
              checked={Boolean(value)}
              onCheckedChange={(checked) => {
                onChange(Boolean(checked));
              }}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
            <Label
              htmlFor={input.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {input.description}
            </Label>
          </motion.div>
        );

      case "select":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Select
              value={
                typeof value === "string"
                  ? value
                  : typeof value === "number"
                  ? value.toString()
                  : ""
              }
              onValueChange={(val) => {
                onChange(
                  (input.options?.find((opt) => String(opt.value) === val)
                    ?.value as ToolInputValue) ?? (val as ToolInputValue)
                );
                setTouched(true);
                setTimeout(() => validate(), 0);
              }}
            >
              <SelectTrigger
                className={errorClass}
                aria-invalid={hasError ? "true" : "false"}
                aria-describedby={hasError ? `${input.id}-error` : undefined}
              >
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
          </motion.div>
        );

      case "file":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Input
              id={input.id}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file?.name || "");
                if (touched) setTimeout(() => validate(), 0);
              }}
              onBlur={handleBlur}
              required={input.required}
              className={errorClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={VARIANTS.fadeIn}
          >
            <Input
              id={input.id}
              value={typeof value === "string" ? value : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={input.description}
              required={input.required}
              className={errorClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );
    }
  };

  const displayError = (touched && localError) || error;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label
          htmlFor={input.id}
          className={`text-sm ${displayError ? "text-red-500" : ""}`}
        >
          {input.description}
          {input.required && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-red-500 ml-1">*</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>此字段为必填项</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
      </div>

      {renderInput()}

      {displayError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center text-red-500 text-sm mt-1"
          id={`${input.id}-error`}
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>{displayError}</span>
        </motion.div>
      )}
    </div>
  );
}
