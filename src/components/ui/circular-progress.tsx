import React from 'react';
import { cn } from '@/lib/utils';
interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: string;
}
export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  color = "text-emerald-500"
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle */}
        <circle
          className="text-muted/20"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={cn("transition-all duration-1000 ease-out", color)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}