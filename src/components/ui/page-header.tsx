import React from 'react';
import { cn } from '@/lib/utils';
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}
export function PageHeader({ 
  title, 
  subtitle, 
  rightElement, 
  className,
  children 
}: PageHeaderProps) {
  return (
    <div className={cn(
      "bg-gradient-to-b from-sky-400 to-cyan-300 rounded-b-[40px] pt-8 pb-16 px-6 text-white shadow-lg shadow-sky-200/50 mb-[-2rem] relative z-0",
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-4">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sky-100 font-medium text-sm leading-relaxed opacity-90">
              {subtitle}
            </p>
          )}
        </div>
        {rightElement && (
          <div className="flex-shrink-0">
            {rightElement}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}