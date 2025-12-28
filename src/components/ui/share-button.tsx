import React from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface ShareButtonProps {
  secondsFree: number;
  moneySaved: number;
  currency?: string;
  className?: string;
}
export function ShareButton({ 
  secondsFree, 
  moneySaved, 
  currency = 'USD',
  className 
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const days = Math.floor(secondsFree / (3600 * 24));
  const shareText = `I've been smoke-free for ${days} days and saved ${currency === 'USD' ? '$' : currency + ' '}${moneySaved.toFixed(2)} with Exhale! 🌬️💪 #QuitVaping #ExhaleApp`;
  const shareUrl = window.location.origin;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Exhale Progress',
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or share failed, fallback to copy
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
      title="Share Progress"
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
    </Button>
  );
}