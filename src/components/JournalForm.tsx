import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger) {
      toast.error("Please select a trigger");
      return;
    }
    onSubmit({
      intensity: intensity[0],
      trigger: trigger,
      note,
      puffs: undefined // Explicitly undefined as this form is now ONLY for cravings
    });
    // Reset form
    setIntensity([5]);
    setTrigger("Habit/Routine");
    setNote("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
      <div className="space-y-4 pt-2 border-t border-border/50">
        <div className="space-y-2">
          <Label>Trigger</Label>
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
          className="bg-violet-500 hover:bg-violet-600 text-white w-full"
        >
          Log Craving
        </Button>
      </div>
    </form>
  );
}