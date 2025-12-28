import React, { useState } from 'react';
import { Calendar, BarChart3, Plus, Crown, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { JournalForm } from '@/components/JournalForm';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
import { useHaptic } from '@/hooks/use-haptic';
import { Button } from '@/components/ui/button';
import { GuestBanner } from '@/components/GuestBanner';
import { OfflineBanner } from '@/components/OfflineBanner';
interface MobileLayoutProps {
  children?: React.ReactNode;
  className?: string;
}
export function MobileLayout({ children, className }: MobileLayoutProps) {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const isGuest = useAppStore(s => s.isGuest);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const location = useLocation();
  const { vibrate } = useHaptic();
  // Only show nav if user is logged in
  const showNav = !!user?.profile;
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
      setIsLogOpen(false);
      vibrate('success');
      toast.success("Craving logged. Stay strong!");
    } catch (err) {
      vibrate('error');
      toast.error("Failed to log entry");
    }
  };
  const handleFabClick = () => {
    vibrate('medium');
    if (isGuest) {
      toast.info("Sign in to log cravings");
      return;
    }
    setIsLogOpen(true);
  };
  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-background flex flex-col transition-colors duration-300 overflow-x-hidden w-full">
      <OfflineBanner />
      <main className={cn("flex-1 pb-24 md:pb-0 md:pl-64 w-full", className)}>
        <div className="w-full h-full">
            {children || <Outlet />}
        </div>
      </main>
      {/* Guest Banner */}
      <GuestBanner />
      {/* Desktop Sidebar (Hidden on Mobile) */}
      {showNav && (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card flex-col p-6 z-50">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-500">Exhale</span>
          </div>
          <nav className="space-y-2 flex-1">
            <NavItem to="/dashboard" icon={<Calendar className="w-5 h-5" />} label="Dashboard" onClick={() => vibrate('light')} />
            <NavItem to="/health" icon={<BarChart3 className="w-5 h-5" />} label="Stats" onClick={() => vibrate('light')} />
            <NavItem to="/achievements" icon={<Crown className="w-5 h-5" />} label="Achievements" onClick={() => vibrate('light')} />
            <NavItem to="/profile" icon={<Settings2 className="w-5 h-5" />} label="Settings" onClick={() => vibrate('light')} />
          </nav>
          {/* Desktop Log Button */}
          <div className="pt-6 border-t border-border">
            <Button
              onClick={handleFabClick}
              className="w-full bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 text-white shadow-lg shadow-violet-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Craving
            </Button>
          </div>
        </aside>
      )}
      {/* Mobile Bottom Nav (Reference Style) */}
      {showNav && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <nav className="bg-white/80 backdrop-blur-md dark:bg-card/90 rounded-full shadow-lg shadow-slate-200/50 dark:shadow-violet-900/10 border border-border h-16 px-6 flex items-center justify-between relative transition-all duration-300">
            {/* Left: Dashboard */}
            <NavLink
              to="/dashboard"
              onClick={() => vibrate('light')}
              className={({ isActive }) => cn(
                "p-2 rounded-full transition-colors",
                isActive ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Calendar className="w-6 h-6" />
            </NavLink>
            {/* Center: FAB (Log Craving) */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <button
                onClick={handleFabClick}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center transition-transform active:scale-95"
              >
                <Plus className="w-8 h-8" />
              </button>
            </div>
            {/* Right: Stats */}
            <NavLink
              to="/health"
              onClick={() => vibrate('light')}
              className={({ isActive }) => cn(
                "p-2 rounded-full transition-colors",
                isActive ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart3 className="w-6 h-6" />
            </NavLink>
          </nav>
        </div>
      )}
      {/* Log Craving Dialog */}
      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border" aria-describedby="log-craving-desc">
          <DialogHeader>
            <DialogTitle className="text-foreground">Log a Craving</DialogTitle>
            <DialogDescription id="log-craving-desc">
              Record details about your current craving.
            </DialogDescription>
          </DialogHeader>
          <JournalForm onSubmit={handleAddEntry} onCancel={() => setIsLogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
function NavItem({ icon, label, to, onClick }: { icon: React.ReactNode, label: string, to: string, onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive
          ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}