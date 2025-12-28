import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BreathingCircle } from '@/components/ui/breathing-circle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useHaptic } from '@/hooks/use-haptic';
import { motion } from 'framer-motion';
export function BreathingPage() {
  const navigate = useNavigate();
  const { vibrate } = useHaptic();
  const handleExit = () => {
    vibrate('success');
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col transition-colors duration-300">
      {/* Minimal Header */}
      <header className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold text-foreground">SOS Assistant</h1>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">4-7-8 Breathing</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Follow the rhythm to lower your heart rate and reduce cravings.
          </p>
        </div>
        <BreathingCircle />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5 }} // Show button after a full cycle roughly
          className="mt-8 w-full max-w-xs"
        >
          <Button 
            onClick={handleExit}
            className="w-full h-12 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white shadow-lg shadow-emerald-500/20 rounded-full"
          >
            <Check className="w-5 h-5 mr-2" />
            I'm feeling better
          </Button>
        </motion.div>
      </main>
    </div>
  );
}