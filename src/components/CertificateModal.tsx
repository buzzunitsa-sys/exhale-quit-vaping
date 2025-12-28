import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Share2, Award } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/use-haptic';
import { toast } from 'sonner';
interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  date: Date;
  userName?: string;
}
export function CertificateModal({ isOpen, onClose, title, description, date, userName }: CertificateModalProps) {
  const { vibrate } = useHaptic();
  const handleShare = async () => {
    vibrate('light');
    const shareText = `I just earned the "${title}" certificate on Exhale! 🏆 #QuitVaping #ExhaleApp`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Exhale Certificate',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        // Ignore abort errors
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 border-none bg-transparent shadow-none overflow-hidden">
        <DialogTitle className="sr-only">Certificate of Achievement</DialogTitle>
        <DialogDescription className="sr-only">
          Certificate for {title}: {description}
        </DialogDescription>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-[#fff9f0] dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl overflow-hidden shadow-2xl border-8 border-double border-amber-400/50"
        >
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-500 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-500 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-500 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-500 rounded-br-xl" />
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900 via-transparent to-transparent" />
          <div className="relative z-10 p-8 flex flex-col items-center text-center">
            {/* Header */}
            <div className="mb-6">
              <Award className="w-16 h-16 text-amber-500 mx-auto mb-4 drop-shadow-sm" />
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
                Certificate
              </h2>
              <p className="text-xs sm:text-sm font-medium text-amber-600/60 dark:text-amber-400/60 uppercase tracking-[0.2em] mt-1">
                of Achievement
              </p>
            </div>
            {/* Content */}
            <div className="space-y-6 w-full">
              <div>
                <p className="text-sm text-muted-foreground italic mb-2">This certifies that</p>
                <p className="text-2xl font-bold font-serif border-b border-slate-300 dark:border-slate-700 pb-2 inline-block min-w-[200px]">
                  {userName || "Exhale User"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground italic mb-2">Has successfully achieved</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  {description}
                </p>
              </div>
              <div className="pt-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Awarded on {format(date, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            {/* Footer Actions */}
            <div className="mt-8 flex gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button 
                onClick={handleShare}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}