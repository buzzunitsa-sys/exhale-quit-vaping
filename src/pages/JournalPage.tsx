import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
import { CravingsChart } from '@/components/CravingsChart';
const TRIGGERS = [
  "Stress", "Boredom", "Social Pressure", "Habit/Routine", "Alcohol", "Coffee", "After Meal", "Other"
];
export function JournalPage() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleAddEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    if (!user) return;
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry
    };
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/journal`, {
        method: 'POST',
        body: JSON.stringify({ entry: newEntry }),
      });
      setUser(updatedUser);
      setIsDialogOpen(false);
      toast.success("Craving logged. Stay strong!");
    } catch (err) {
      toast.error("Failed to log entry");
    }
  };
  if (!user) return null;
  const entries = user.journal || [];
  return (
    <div className="p-4 space-y-6 pt-8 md:pt-12 pb-24">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Journal</h2>
            <p className="text-slate-500">Track cravings and identify triggers.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-10 h-10 p-0 shadow-lg shadow-emerald-500/30">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log a Craving</DialogTitle>
            </DialogHeader>
            <JournalForm onSubmit={handleAddEntry} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </header>
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <CravingsChart entries={entries} />
        </motion.div>
      )}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-60">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-muted-foreground">No entries yet. <br/>Tap + to log a craving or thought.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Logs</h3>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        entry.intensity > 7 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        entry.intensity > 4 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        Intensity: {entry.intensity}/10
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(entry.timestamp, 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                      {entry.trigger}
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                      {entry.note}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
function JournalForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [intensity, setIntensity] = useState([5]);
  const [trigger, setTrigger] = useState("");
  const [note, setNote] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger) {
      toast.error("Please select a trigger");
      return;
    }
    onSubmit({
      intensity: intensity[0],
      trigger,
      note
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Craving Intensity (1-10)</Label>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold w-8 text-center">{intensity[0]}</span>
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
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Log Entry</Button>
      </div>
    </form>
  );
}