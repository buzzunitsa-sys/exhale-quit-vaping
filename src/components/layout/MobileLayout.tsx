import React, { useState } from 'react';
import { Calendar, BarChart3, Plus, Crown, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JournalForm } from '@/components/JournalForm';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
interface MobileLayoutProps {
  children?: React.ReactNode;
  className?: string;
}
export function MobileLayout({ children, className }: MobileLayoutProps) {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const location = useLocation();
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
      toast.success("Craving logged. Stay strong!");
    } catch (err) {
      toast.error("Failed to log entry");
    }
  };
  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className={cn("flex-1 pb-24 md:pb-0 md:pl-64", className)}>
        <div className="w-full h-full">
            {children || <Outlet />}
        </div>
      </main>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      {showNav && (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r bg-card flex-col p-6 z-50">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-500">Exhale</span>
          </div>
          <nav className="space-y-2 flex-1">
            <NavItem to="/dashboard" icon={<Calendar className="w-5 h-5" />} label="Dashboard" />
            <NavItem to="/journal" icon={<Calendar className="w-5 h-5" />} label="Journal" />
            <NavItem to="/health" icon={<BarChart3 className="w-5 h-5" />} label="Stats" />
            <NavItem to="/achievements" icon={<Crown className="w-5 h-5" />} label="Achievements" />
            <NavItem to="/profile" icon={<Settings2 className="w-5 h-5" />} label="Settings" />
          </nav>
        </aside>
      )}
      {/* Mobile Bottom Nav (Reference Style) */}
      {showNav && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <nav className="bg-white rounded-full shadow-lg shadow-slate-200/50 border border-slate-100 h-16 px-6 flex items-center justify-between relative">
            {/* Left: Dashboard/Calendar */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) => cn(
                "p-2 rounded-full transition-colors",
                isActive ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Calendar className="w-6 h-6" />
            </NavLink>
            {/* Center: FAB */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <button
                onClick={() => setIsLogOpen(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center transition-transform active:scale-95"
              >
                <Plus className="w-8 h-8" />
              </button>
            </div>
            {/* Right: Stats */}
            <NavLink
              to="/health"
              className={({ isActive }) => cn(
                "p-2 rounded-full transition-colors",
                isActive ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <BarChart3 className="w-6 h-6" />
            </NavLink>
          </nav>
        </div>
      )}
      {/* Log Craving Dialog */}
      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log a Craving</DialogTitle>
          </DialogHeader>
          <JournalForm onSubmit={handleAddEntry} onCancel={() => setIsLogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
function NavItem({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive
          ? "bg-violet-50 text-violet-600 font-medium"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}