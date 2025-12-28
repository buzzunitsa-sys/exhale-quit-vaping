import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
const TRIGGERS = [
  "Stress", "Boredom", "Social Pressure", "Habit/Routine", "Alcohol", "Coffee", "After Meal", "Other"
];
interface JournalFormProps {
  onSubmit: (data: { intensity: number; trigger: string; note: string; puffs?: number }) => void;
  onCancel?: () => void;
}
export function JournalForm({ onSubmit, onCancel }: JournalFormProps) {
  const [intensity, setIntensity] = useState([5]);
  const [trigger, setTrigger] = useState("");
  const [note, setNote] = useState("");
  const [hadSlip, setHadSlip] = useState(false);
  const [puffs, setPuffs] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger) {
      toast.error("Please select a trigger");
      return;
    }
    const puffsNum = hadSlip && puffs ? parseInt(puffs, 10) : 0;
    onSubmit({
      intensity: intensity[0],
      trigger,
      note,
      puffs: puffsNum > 0 ? puffsNum : undefined
    });
    // Reset form
    setIntensity([5]);
    setTrigger("");
    setNote("");
    setHadSlip(false);
    setPuffs("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
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
        {/* Slip Tracking Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Did you vape?</Label>
              <p className="text-xs text-muted-foreground">Log any slips to track your usage.</p>
            </div>
            <Switch
              checked={hadSlip}
              onCheckedChange={setHadSlip}
            />
          </div>
          {hadSlip && (
            <div className="pt-2 animate-accordion-down overflow-hidden">
              <Label className="mb-2 block text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                How many puffs?
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={puffs}
                onChange={(e) => setPuffs(e.target.value)}
                className="bg-background border-red-200 focus-visible:ring-red-500"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Be honest. Tracking slips helps you understand your patterns.
              </p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Notes (Optional)</Label>
          <Textarea
            placeholder="How are you feeling? What happened?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none h-24"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button 
          type="submit" 
          className={hadSlip ? "bg-red-500 hover:bg-red-600 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}
        >
          {hadSlip ? "Log Slip" : "Log Craving"}
        </Button>
      </div>
    </form>
  );
}