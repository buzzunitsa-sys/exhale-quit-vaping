import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={cn(
        "text-2xl hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90 z-50",
        // Default absolute positioning if no className provided, otherwise let parent control layout
        !className && "absolute top-4 right-4",
        className
      )}
    >
      {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </Button>
  );
}