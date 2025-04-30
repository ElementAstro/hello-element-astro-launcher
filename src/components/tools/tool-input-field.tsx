import React from "react";
import type { ToolInput, ToolInputValue } from "@/types/tool";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolInputFieldProps {
  input: ToolInput;
  value: ToolInputValue | undefined;
  onChange: (value: ToolInputValue) => void;
}

export function ToolInputField({ input, value, onChange }: ToolInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value: inputValue } = e.target;

    if (type === "number") {
      onChange(inputValue === "" ? 0 : Number(inputValue));
    } else if (type === "checkbox") {
      onChange(e.target.checked);
    } else {
      onChange(inputValue);
    }
  };

  const renderInput = () => {
    switch (input.type) {
      case "text":
        return (
          <Input
            id={input.id}
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            placeholder={input.description}
            required={input.required}
          />
        );

      case "number":
        return (
          <Input
            id={input.id}
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={handleChange}
            placeholder={input.description}
            required={input.required}
            min={input.validation?.min}
            max={input.validation?.max}
          />
        );

      case "date":
        return (
          <Input
            id={input.id}
            type="date"
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            required={input.required}
          />
        );

      case "time":
        return (
          <Input
            id={input.id}
            type="time"
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            required={input.required}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              id={input.id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={input.id}>{input.description}</Label>
          </div>
        );

      case "select":
        return (
          <Select
            value={
              typeof value === "string"
                ? value
                : typeof value === "number"
                ? value.toString()
                : ""
            }
            onValueChange={(val) => onChange(val)}
          >
            <SelectTrigger>
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
        );

      default:
        return (
          <Input
            id={input.id}
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            placeholder={input.description}
            required={input.required}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={input.id} className="flex items-center gap-1">
        {input.description}
        {input.required && <span className="text-red-500">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
}