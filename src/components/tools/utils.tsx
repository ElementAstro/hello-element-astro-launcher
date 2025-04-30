import { Calculator, ArrowLeftRight, Calendar, BarChart, Wrench } from "lucide-react";

export function getCategoryIcon(category: string) {
  switch (category) {
    case "calculation":
      return <Calculator className="h-4 w-4" />;
    case "conversion":
      return <ArrowLeftRight className="h-4 w-4" />;
    case "planning":
      return <Calendar className="h-4 w-4" />;
    case "analysis":
      return <BarChart className="h-4 w-4" />;
    case "utility":
      return <Wrench className="h-4 w-4" />;
    default:
      return <Wrench className="h-4 w-4" />;
  }
}