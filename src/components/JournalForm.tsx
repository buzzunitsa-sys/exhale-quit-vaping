import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertCircle, Plus, Minus } from 'lucide-react';
const TRIGGERS = [
  "Stress", "Boredom", "Social Pressure", "Habit/Routine", "Alcohol", "Coffee", "After Meal", "Other"
];
interface JournalFormProps {
  onSubmit: (data: { intensity: number; trigger: string; note: string; puffs?: number }) => void;
  onCancel?: () => void;
}
export function JournalForm({ onSubmit, onCancel }: JournalFormProps) {
  const [intensity, setIntensity] = useState([5]);
  const [trigger, setTrigger] = useState("Habit/Routine");
  const [note, setNote] = useState("");
  const [isLogPuff, setIsLogPuff] = useState(true); // Default to true for usage tracking
  const [puffs, setPuffs] = useState<number>(1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If logging puff, trigger is optional or default
    if (!isLogPuff && !trigger) {
      toast.error("Please select a trigger");
      return;
    }
    onSubmit({
      intensity: intensity[0],
      trigger: trigger || "Quick Log",
      note,
      puffs: isLogPuff ? puffs : undefined
    });
    // Reset form
    setIntensity([5]);
    setTrigger("Habit/Routine");
    setNote("");
    setIsLogPuff(true);
    setPuffs(1);
  };
  const incrementPuffs = () => setPuffs(p => p + 1);
  const decrementPuffs = () => setPuffs(p => Math.max(1, p - 1));
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-xl">
        <Label className="text-base font-medium">Log Usage (Puffs)</Label>
        <Switch
          checked={isLogPuff}
          onCheckedChange={setIsLogPuff}
        />
      </div>
      {isLogPuff ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Label className="text-lg font-semibold">How many puffs?</Label>
            <div className="flex items-center gap-6">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={decrementPuffs}
              >
                <Minus className="w-6 h-6" />
              </Button>
              <div className="text-5xl font-bold text-sky-600 w-20 text-center">
                {puffs}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={incrementPuffs}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label>Craving Intensity (1-10)</Label>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold w-8 text-center text-sky-600">{intensity[0]}</span>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
        </div>
      )}
      {/* Common Fields (Optional/Context) */}
      <div className="space-y-4 pt-2 border-t border-border/50">
        <div className="space-y-2">
          <Label>Trigger (Optional)</Label>
          <Select value={trigger} onValueChange={setTrigger}>
            <SelectTrigger>
              <SelectValue placeholder="What triggered this?" />
            </SelectTrigger>
            <SelectContent>
              {TRIGGERS.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Notes (Optional)</Label>
          <Textarea
            placeholder="Any context?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none h-20"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button
          type="submit"
          className={isLogPuff ? "bg-sky-500 hover:bg-sky-600 text-white w-full" : "bg-violet-500 hover:bg-violet-600 text-white w-full"}
        >
          {isLogPuff ? "Log Puffs" : "Log Craving"}
        </Button>
      </div>
    </form>
  );
}