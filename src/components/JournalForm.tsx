import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { JournalEntry } from '@shared/types';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff } from 'lucide-react';
import { useAppStore } from '@/lib/store';
const DEFAULT_TRIGGERS = [
  "Stress", "Boredom", "Social Pressure", "Habit/Routine", "Alcohol", "Coffee", "After Meal"
];
interface JournalFormProps {
  onSubmit: (data: { intensity: number; trigger: string; note: string; puffs?: number }) => void;
  onCancel?: () => void;
  initialData?: Partial<JournalEntry>;
}
export function JournalForm({ onSubmit, onCancel, initialData }: JournalFormProps) {
  const [intensity, setIntensity] = useState([5]);
  const [trigger, setTrigger] = useState("Habit/Routine");
  const [customTrigger, setCustomTrigger] = useState("");
  const [note, setNote] = useState("");
  const [puffs, setPuffs] = useState([0]);
  const [availableTriggers, setAvailableTriggers] = useState(DEFAULT_TRIGGERS);
  const isOnline = useOnlineStatus();
  const isGuest = useAppStore(s => s.isGuest);
  // Load custom triggers from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('exhale_custom_triggers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Merge saved triggers with defaults, removing duplicates
          const merged = Array.from(new Set([...DEFAULT_TRIGGERS, ...parsed]));
          setAvailableTriggers(merged);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom triggers', e);
    }
  }, []);
  useEffect(() => {
    if (initialData) {
      if (initialData.intensity !== undefined) setIntensity([initialData.intensity]);
      if (initialData.note !== undefined) setNote(initialData.note);
      if (initialData.puffs !== undefined) setPuffs([initialData.puffs]);
      if (initialData.trigger) {
        if (availableTriggers.includes(initialData.trigger)) {
          setTrigger(initialData.trigger);
        } else if (DEFAULT_TRIGGERS.includes(initialData.trigger)) {
           // Should be covered by availableTriggers, but just in case
           setTrigger(initialData.trigger);
        } else {
          // It's a custom trigger that might not be in our list yet (e.g. from another device)
          // or it's "Other"
          setTrigger("Other");
          setCustomTrigger(initialData.trigger);
        }
      }
    }
  }, [initialData, availableTriggers]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline && !isGuest) {
      toast.error("You are offline. Cannot submit entry.");
      return;
    }
    let finalTrigger = trigger;
    if (trigger === "Other") {
      if (!customTrigger.trim()) {
        toast.error("Please specify the trigger");
        return;
      }
      finalTrigger = customTrigger.trim();
      // Save custom trigger if it's new
      if (!availableTriggers.includes(finalTrigger)) {
        const newTriggers = [...availableTriggers, finalTrigger];
        setAvailableTriggers(newTriggers);
        // Persist only the custom ones to avoid bloating storage with defaults
        const customOnly = newTriggers.filter(t => !DEFAULT_TRIGGERS.includes(t));
        localStorage.setItem('exhale_custom_triggers', JSON.stringify(customOnly));
      }
    }
    onSubmit({
      intensity: intensity[0],
      trigger: finalTrigger,
      note,
      puffs: puffs[0]
    });
    // Reset form if not editing
    if (!initialData) {
      setIntensity([5]);
      setTrigger("Habit/Routine");
      setCustomTrigger("");
      setNote("");
      setPuffs([0]);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4 animate-fade-in">
        {/* Intensity Slider */}
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
        {/* Puffs Slider */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <Label>Did you vape? (Puffs taken)</Label>
          <div className="flex items-center gap-4">
            <span className={`text-2xl font-bold w-8 text-center ${puffs[0] > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {puffs[0]}
            </span>
            <Slider
              value={puffs}
              onValueChange={setPuffs}
              max={20}
              min={0}
              step={1}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">Leave at 0 if you resisted the craving.</p>
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
              {availableTriggers.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
              <SelectItem value="Other">Other (Custom)</SelectItem>
            </SelectContent>
          </Select>
          {trigger === "Other" && (
            <Input
              placeholder="Specify trigger..."
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              className="mt-2"
              autoFocus
            />
          )}
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
          disabled={!isOnline && !isGuest}
          className="bg-violet-500 hover:bg-violet-600 text-white w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {!isOnline && !isGuest ? (
            <span className="flex items-center gap-2"><WifiOff className="w-4 h-4" /> Offline</span>
          ) : (
            initialData ? "Update Entry" : "Log Entry"
          )}
        </Button>
      </div>
    </form>
  );
}