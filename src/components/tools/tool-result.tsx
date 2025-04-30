import { RefreshCw, Play } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Tool, ToolOutput, ToolResult as ToolResultType } from "@/types/tool";

interface ToolResultProps {
  tool: Tool | null;
  result: ToolResultType | null;
  isRunning: boolean;
}

export function ToolResult({ tool, result, isRunning }: ToolResultProps) {
  if (!result) {
    return (
      <div className="border rounded-md p-8 flex items-center justify-center h-[300px]">
        <div className="text-center text-muted-foreground">
          {isRunning ? (
            <div className="space-y-2">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin" />
              <p>Processing...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Play className="h-8 w-8 mx-auto" />
              <p>Run the tool to see results</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-green-500 border-green-500">
          Completed
        </Badge>
        <span className="text-xs text-muted-foreground">
          Duration: {(result.duration / 1000).toFixed(2)}s
        </span>
      </div>

      <Separator />

      <div className="space-y-4">
        {tool?.outputs.map((output) => {
          const value = result.outputs[output.name];

          if (!value) return null;

          return (
            <OutputDisplay 
              key={output.id} 
              output={output} 
              value={value} 
            />
          );
        })}
      </div>
    </div>
  );
}

interface OutputDisplayProps {
  output: ToolOutput;
  value: unknown;
}

function OutputDisplay({ output, value }: OutputDisplayProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">
        {output.description}
      </Label>

      {output.type === "image" ? (
        <div className="border rounded-md p-2 flex justify-center">
          <Image
            src={typeof value === "string" ? value : "/placeholder.svg"}
            alt={output.name}
            width={300}
            height={200}
            className="object-contain"
          />
        </div>
      ) : output.type === "table" ? (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.isArray(value) &&
                  value.length > 0 &&
                  Object.keys(value[0] || {}).map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(value) &&
                value.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((cell, j) => (
                      <TableCell key={j}>
                        {cell?.toString()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : output.type === "chart" ? (
        <div className="border rounded-md p-2 flex justify-center">
          <Image
            src={typeof value === "string" ? value : "/placeholder.svg"}
            alt={output.name}
            width={400}
            height={200}
            className="object-contain"
          />
        </div>
      ) : (
        <div className="p-2 bg-muted rounded-md">
          <span className="text-sm">
            {value?.toString()}
          </span>
        </div>
      )}
    </div>
  );
}