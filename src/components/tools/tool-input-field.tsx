import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";
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
import { VARIANTS, DURATION, EASE } from "./animation-constants";
import { useToolsTranslations } from "./i18n-provider";

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
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useToolsTranslations();

  // 使用 useCallback 优化验证逻辑
  const validate = useCallback((): boolean => {
    // 如果必填项为空
    if (
      input.required &&
      (value === undefined || value === "" || value === null)
    ) {
      setLocalError(
        t("tools.validation.requiredField", { name: input.description })
      );
      return false;
    }

    // 数字类型验证
    if (input.type === "number" && typeof value === "number") {
      if (input.validation?.min !== undefined && value < input.validation.min) {
        setLocalError(
          t("tools.validation.minValue", {
            name: input.description,
            min: input.validation.min,
          })
        );
        return false;
      }
      if (input.validation?.max !== undefined && value > input.validation.max) {
        setLocalError(
          t("tools.validation.maxValue", {
            name: input.description,
            max: input.validation.max,
          })
        );
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
        setLocalError(
          t("tools.validation.invalidFormat", { name: input.description })
        );
        return false;
      }
    }

    // 自定义验证器
    if (input.validation?.customValidator && typeof window !== "undefined") {
      try {
        const validatorFunc = new Function(
          "value",
          input.validation.customValidator
        );
        const result = validatorFunc(value);
        if (result !== true) {
          setLocalError(
            typeof result === "string"
              ? result
              : t("tools.validation.invalid", { name: input.description })
          );
          return false;
        }
      } catch (err) {
        console.error("Custom validator error:", err);
      }
    }

    setLocalError(null);
    return true;
  }, [input, value, t]);

  // 处理表单获得焦点
  const handleFocus = () => {
    setIsFocused(true);
  };

  // 处理表单失焦验证
  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
    validate();
  };

  // 处理输入变化
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [onChange, touched, validate]
  );

  // 检查外部错误并更新本地错误状态
  useEffect(() => {
    if (error) {
      setLocalError(error);
      setTouched(true);
    }
  }, [error]);

  // 渲染输入字段
  const renderInput = () => {
    // 确定错误状态
    const hasError = touched && (localError || error);
    const inputClass = `${
      hasError ? "border-red-500 focus-visible:ring-red-500" : ""
    } 
                        ${isFocused ? "border-primary" : ""}
                        transition-all duration-200`;

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
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={input.description}
              required={input.required}
              className={inputClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
              autoComplete={input.autocomplete || "off"}
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={input.placeholder || input.description}
              required={input.required}
              min={input.validation?.min}
              max={input.validation?.max}
              step={input.step || "any"}
              className={inputClass}
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={input.required}
              className={inputClass}
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={input.required}
              className={inputClass}
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
            whileHover={{ scale: 1.01 }}
          >
            <Checkbox
              id={input.id}
              checked={Boolean(value)}
              onCheckedChange={(checked) => {
                onChange(Boolean(checked));
                setTouched(true);
                setTimeout(() => validate(), 0);
              }}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
            <Label
              htmlFor={input.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
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
            className="w-full"
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
              onOpenChange={(open) => {
                setIsFocused(open);
                if (!open) {
                  setTouched(true);
                  validate();
                }
              }}
            >
              <SelectTrigger
                className={`w-full ${inputClass}`}
                aria-invalid={hasError ? "true" : "false"}
                aria-describedby={hasError ? `${input.id}-error` : undefined}
              >
                <SelectValue
                  placeholder={input.placeholder || input.description}
                />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={input.required}
              className={`cursor-pointer ${inputClass}`}
              accept={input.accept || "*/*"}
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={input.placeholder || input.description}
              required={input.required}
              className={inputClass}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${input.id}-error` : undefined}
            />
          </motion.div>
        );
    }
  };

  // 显示错误信息
  const displayError = (touched && localError) || error;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label
          htmlFor={input.id}
          className={`text-sm font-medium ${
            displayError ? "text-red-500" : ""
          } ${isFocused ? "text-primary" : ""} transition-colors`}
        >
          {input.description}
          {input.required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>

        {input.help && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger type="button" className="inline-flex">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="max-w-xs text-xs"
              >
                <p>{input.help}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {renderInput()}

      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.smooth }}
            className="flex items-center text-red-500 text-xs mt-1"
            id={`${input.id}-error`}
            role="alert"
          >
            <AlertCircle className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span>{displayError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
