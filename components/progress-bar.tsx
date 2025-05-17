'use client';

import { motion } from '@/lib/motion';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  value: number;
  total: number;
}

export function ProgressBar({ value, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Task completion
        </span>
        <span className="text-sm font-medium">
          {value} / {total} ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {percentage === 100 
          ? "All tasks completed! Great job! 🎉" 
          : percentage > 50 
            ? "You're making good progress!" 
            : "Keep going!"}
      </p>
    </div>
  );
}