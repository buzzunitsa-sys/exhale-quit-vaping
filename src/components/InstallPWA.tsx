import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, PlusSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  useEffect(() => {
    // Check if standalone
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStandaloneMode);
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };
  // If already installed or not installable (and not iOS), hide component
  if (isStandalone) return null;
  if (!deferredPrompt && !isIOS) return null;
  return (
    <>
      <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Download className="w-5 h-5 text-sky-500" />
            Install App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Install Exhale on your home screen for quick access and a better experience.
          </p>
          <Button onClick={handleInstallClick} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
            Add to Home Screen
          </Button>
        </CardContent>
      </Card>
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install on iOS</DialogTitle>
            <DialogDescription>
              Follow these steps to add Exhale to your home screen:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-md">
                <Share className="w-5 h-5" />
              </div>
              <p className="text-sm">1. Tap the <strong>Share</strong> button in your browser menu.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-md">
                <PlusSquare className="w-5 h-5" />
              </div>
              <p className="text-sm">2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}