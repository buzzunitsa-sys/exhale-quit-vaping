import React from 'react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
import { CravingsChart } from '@/components/CravingsChart';
import { JournalForm } from '@/components/JournalForm';
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
  if (!user) return null;
  const entries = user.journal || [];
  return (
    <div className="p-4 space-y-6 pt-8 md:pt-12 pb-32">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Journal</h2>
        <p className="text-slate-500">Track cravings and identify triggers.</p>
      </header>
      {/* Inline Form for Desktop / Quick Access */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b">
            <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">New Entry</h3>
          </div>
          <div className="p-4">
            <JournalForm onSubmit={handleAddEntry} />
          </div>
        </CardContent>
      </Card>
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