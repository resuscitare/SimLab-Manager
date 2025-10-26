"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className, showLabel = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div className="flex justify-between items-center mb-2">
          {showLabel && (
            <>
              <span className="text-sm font-medium text-foreground">
                Progresso do Cenário
              </span>
              <span className="text-sm font-medium text-foreground">
                {Math.round(percentage)}%
              </span>
            </>
          )}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };