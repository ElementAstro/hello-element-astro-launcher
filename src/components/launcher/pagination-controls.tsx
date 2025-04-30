import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChangeHandler } from "./types";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: ChangeHandler<number>;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const renderPageButtons = () => {
    const buttons = [];
    const totalShown = Math.min(5, totalPages);

    let startPage;
    if (totalPages <= 5) {
      startPage = 1;
    } else if (currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    } else {
      startPage = currentPage - 2;
    }

    for (let i = 0; i < totalShown; i++) {
      const pageNumber = startPage + i;
      buttons.push(
        <Button
          key={pageNumber}
          variant={currentPage === pageNumber ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(pageNumber)}
          className="w-8 h-8"
        >
          {pageNumber}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="p-4 border-t flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {renderPageButtons()}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </Button>
    </div>
  );
}