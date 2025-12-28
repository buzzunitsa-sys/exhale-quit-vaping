import React from 'react';
import { Home, Activity, Trophy, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}
export function MobileLayout({ children, className }: MobileLayoutProps) {
  const user = useAppStore(s => s.user);
  // Only show nav if user is logged in
  const showNav = !!user?.profile;
  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className={cn("flex-1 pb-20 md:pb-0 md:pl-64", className)}>
        <div className="max-w-md mx-auto md:max-w-7xl w-full h-full">
            {children}
        </div>
      </main>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      {showNav && (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r bg-card flex-col p-6 z-50">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Exhale</span>
          </div>
          <nav className="space-y-2 flex-1">
            <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" active />
            <NavItem icon={<Activity className="w-5 h-5" />} label="Health" />
            <NavItem icon={<Trophy className="w-5 h-5" />} label="Achievements" />
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" />
          </nav>
        </aside>
      )}
      {/* Mobile Bottom Nav (Hidden on Desktop) */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            <MobileNavItem icon={<Home className="w-6 h-6" />} label="Home" active />
            <MobileNavItem icon={<Activity className="w-6 h-6" />} label="Health" />
            <MobileNavItem icon={<Trophy className="w-6 h-6" />} label="Awards" />
            <MobileNavItem icon={<UserIcon className="w-6 h-6" />} label="Profile" />
          </div>
        </nav>
      )}
    </div>
  );
}
function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
      active 
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
function MobileNavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
      active 
        ? "text-emerald-600 dark:text-emerald-400" 
        : "text-muted-foreground hover:text-foreground"
    )}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}