import React from 'react';
import { Home, Activity, Trophy, User as UserIcon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { NavLink, Outlet } from 'react-router-dom';
interface MobileLayoutProps {
  children?: React.ReactNode;
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
            {children || <Outlet />}
        </div>
      </main>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      {showNav && (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r bg-card flex-col p-6 z-50">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bling-cyan to-bling-purple flex items-center justify-center shadow-lg shadow-bling-purple/20">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-bling-cyan to-bling-purple">Exhale</span>
          </div>
          <nav className="space-y-2 flex-1">
            <NavItem to="/dashboard" icon={<Home className="w-5 h-5" />} label="Dashboard" />
            <NavItem to="/health" icon={<Activity className="w-5 h-5" />} label="Health" />
            <NavItem to="/journal" icon={<BookOpen className="w-5 h-5" />} label="Journal" />
            <NavItem to="/achievements" icon={<Trophy className="w-5 h-5" />} label="Achievements" />
            <NavItem to="/profile" icon={<UserIcon className="w-5 h-5" />} label="Profile" />
          </nav>
          <div className="mt-auto pt-6 border-t">
             <p className="text-xs text-muted-foreground text-center">Built with ❤️ by Aurelia</p>
          </div>
        </aside>
      )}
      {/* Mobile Bottom Nav (Hidden on Desktop) */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            <MobileNavItem to="/dashboard" icon={<Home className="w-6 h-6" />} label="Home" />
            <MobileNavItem to="/health" icon={<Activity className="w-6 h-6" />} label="Health" />
            <MobileNavItem to="/journal" icon={<BookOpen className="w-6 h-6" />} label="Journal" />
            <MobileNavItem to="/achievements" icon={<Trophy className="w-6 h-6" />} label="Awards" />
            <MobileNavItem to="/profile" icon={<UserIcon className="w-6 h-6" />} label="Profile" />
          </div>
        </nav>
      )}
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
          ? "bg-gradient-to-r from-bling-cyan/10 to-bling-purple/10 font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {({ isActive }) => (
        <>
          <span className={cn(
            "transition-colors duration-200",
            isActive ? "text-bling-purple" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {icon}
          </span>
          <span className={cn(
            isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-bling-cyan to-bling-purple font-bold" : ""
          )}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
function MobileNavItem({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200",
        isActive
          ? "scale-105"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {({ isActive }) => (
        <>
          <span className={cn(
            "transition-colors duration-200",
            isActive ? "text-bling-purple drop-shadow-sm" : "text-muted-foreground"
          )}>
            {icon}
          </span>
          <span className={cn(
            "text-[10px] font-medium transition-all duration-200",
            isActive 
              ? "text-transparent bg-clip-text bg-gradient-to-r from-bling-cyan to-bling-purple font-bold" 
              : "text-muted-foreground"
          )}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}