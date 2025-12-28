import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
import { CravingsChart } from '@/components/CravingsChart';
import { TriggerChart } from '@/components/TriggerChart';
import { JournalForm } from '@/components/JournalForm';
import { getTriggerDistribution } from '@/lib/stats-utils';
export function JournalPage() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
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
      toast.success("Craving logged. Stay strong!");
    } catch (err) {
      toast.error("Failed to log entry");
    }
  };
  const entries = useMemo(() => user?.journal || [], [user?.journal]);
  const triggerData = useMemo(() => getTriggerDistribution(entries), [entries]);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background p-4 space-y-6 pt-8 md:pt-12 pb-32 transition-colors duration-300">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Journal</h2>
        <p className="text-muted-foreground">Track cravings and identify triggers.</p>
      </header>
      {/* Inline Form for Desktop / Quick Access */}
      <Card className="border border-border/50 shadow-sm bg-card overflow-hidden transition-colors duration-300">
        <CardContent className="p-0">
          <div className="bg-secondary/50 p-4 border-b border-border/50">
            <h3 className="font-semibold text-sm text-foreground">New Entry</h3>
          </div>
          <div className="p-4">
            <JournalForm onSubmit={handleAddEntry} />
          </div>
        </CardContent>
      </Card>
      {/* Charts Section */}
      {entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CravingsChart entries={entries} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TriggerChart data={triggerData} />
          </motion.div>
        </div>
      )}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-60">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No entries yet.</p>
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
              <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        entry.intensity > 7 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        entry.intensity > 4 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        Intensity: {entry.intensity}/10
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(entry.timestamp, 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      {entry.trigger}
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-foreground mt-2 leading-relaxed">
                      {entry.note}
                    </p>
                  )}
                  {entry.puffs && entry.puffs > 0 && (
                    <div className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                      <span>•</span>
                      <span>{entry.puffs} puffs logged</span>
                    </div>
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