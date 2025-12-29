import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MapPinOff } from 'lucide-react';
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col items-center justify-center p-4 text-center transition-colors duration-300">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-float shadow-lg">
        <MapPinOff className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground max-w-xs mb-8 text-lg">
        The path you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 text-white shadow-lg shadow-sky-500/20 font-semibold text-lg transition-transform active:scale-95">
          <Home className="w-5 h-5 mr-2" />
          Return Home
        </Button>
      </Link>
    </div>
  );
}