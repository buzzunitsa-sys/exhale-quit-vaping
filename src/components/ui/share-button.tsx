import React from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface ShareButtonProps {
  secondsFree?: number;
  moneySaved?: number;
  currency?: string;
  className?: string;
  customTitle?: string;
  customText?: string;
}
export function ShareButton({
  secondsFree,
  moneySaved,
  currency = 'USD',
  className,
  customTitle,
  customText
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);
  // Construct share text
  let shareText = '';
  if (customText) {
    shareText = customText;
  } else if (secondsFree !== undefined && moneySaved !== undefined) {
    const days = Math.floor(secondsFree / (3600 * 24));
    shareText = `I've been smoke-free for ${days} days and saved ${currency === 'USD' ? '$' : currency + ' '}${moneySaved.toFixed(2)} with Exhale! 🌬️💪 #QuitVaping #ExhaleApp`;
  } else {
    shareText = "Check out Exhale - the best app to quit vaping! 🌬️ #QuitVaping #ExhaleApp";
  }
  const shareUrl = window.location.origin;
  const fullShareText = `${shareText} ${shareUrl}`;
  const handleShare = async () => {
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: customTitle || 'My Exhale Progress',
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
        return;
      } catch (error) {
        // User cancelled or share failed, fallback to copy
        if ((error as Error).name !== 'AbortError') {
          console.warn('Share failed, falling back to clipboard', error);
        } else {
          return; // User cancelled
        }
      }
    }
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard failed', err);
      toast.error("Could not share or copy to clipboard");
    }
  };
  return (
    <Button
      onClick={handleShare}
      variant="ghost"
      size="icon"
      className={cn(
        "bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-200",
        className
      )}
      title="Share"
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
    </Button>
  );
}