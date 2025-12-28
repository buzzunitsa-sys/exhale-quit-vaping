import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, PlusSquare, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export function InstallPWA() {
  const {
    isStandalone,
    promptInstall,
    showInstructions,
    setShowInstructions,
    isIOS
  } = useInstallPrompt();
  // If already installed/standalone, hide component
  if (isStandalone) return null;
  return (
    <>
      <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Download className="w-5 h-5 text-sky-500" />
            Get the Android App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Install Exhale for the full native app experience. Works offline and looks great on your home screen.
          </p>
          <Button onClick={promptInstall} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold">
            Install App
          </Button>
        </CardContent>
      </Card>
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install Exhale App</DialogTitle>
            <DialogDescription>
              Follow these steps to install the app on your device.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={isIOS ? "ios" : "android"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ios">iOS (Safari)</TabsTrigger>
              <TabsTrigger value="android">Android / Chrome</TabsTrigger>
            </TabsList>
            <TabsContent value="ios" className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <p className="text-sm">1. Tap the <strong>Share</strong> button in your browser menu bar.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <p className="text-sm">2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
              </div>
            </TabsContent>
            <TabsContent value="android" className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </div>
                <p className="text-sm">1. Tap the <strong>Menu</strong> (three dots) button in Chrome.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <p className="text-sm">2. Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}