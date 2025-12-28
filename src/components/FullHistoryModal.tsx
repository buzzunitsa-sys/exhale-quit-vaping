import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format, isToday, isYesterday } from 'date-fns';
import { Trash2, Pencil, History } from 'lucide-react';
import type { JournalEntry } from '@shared/types';
import { cn } from '@/lib/utils';
interface FullHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
}
export function FullHistoryModal({ isOpen, onClose, entries, onDelete, onEdit }: FullHistoryModalProps) {
  const groupedEntries = useMemo(() => {
    const groups: Record<string, JournalEntry[]> = {};
    // Sort entries by timestamp descending first
    const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
    sorted.forEach(entry => {
      const date = new Date(entry.timestamp);
      let key = format(date, 'MMMM d, yyyy');
      if (isToday(date)) key = 'Today';
      else if (isYesterday(date)) key = 'Yesterday';
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    return groups;
  }, [entries]);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col p-0 gap-0 bg-card border-border">
        <DialogHeader className="p-6 pb-2 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <History className="w-5 h-5 text-sky-500" />
            Full History
          </DialogTitle>
          <DialogDescription>
            Your complete log of cravings and slips.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 p-0">
          <div className="p-6 space-y-8">
            {Object.entries(groupedEntries).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No entries found.
              </div>
            ) : (
              Object.entries(groupedEntries).map(([dateLabel, dayEntries]) => (
                <div key={dateLabel} className="space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card py-2 z-10">
                    {dateLabel}
                  </h3>
                  <div className="space-y-2">
                    {dayEntries.map((entry) => {
                      const isHighIntensity = entry.intensity >= 7;
                      const isMediumIntensity = entry.intensity >= 4 && entry.intensity < 7;
                      return (
                        <div
                          key={entry.id}
                          className="group flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors border border-border/50"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {/* Intensity Indicator */}
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs",
                              isHighIntensity ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                              isMediumIntensity ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                              "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            )}>
                              {entry.intensity}
                            </div>
                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-foreground truncate">
                                  {entry.trigger}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {format(entry.timestamp, 'h:mm a')}
                                </span>
                              </div>
                              {entry.note && (
                                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                  {entry.note}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {entry.puffs && entry.puffs > 0 ? (
                              <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full mr-2">
                                {entry.puffs} PUFFS
                              </span>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(entry)}
                              className="h-8 w-8 text-muted-foreground hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(entry.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border/50 bg-secondary/10">
          <Button onClick={onClose} className="w-full" variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}