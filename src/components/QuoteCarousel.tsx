import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote as QuoteIcon } from 'lucide-react';
import { getDailyQuote, QUOTES, type Quote } from '@/lib/quotes';
import { cn } from '@/lib/utils';
export function QuoteCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    // 1. Get Daily Quote
    const daily = getDailyQuote();
    // 2. Get 3-4 random other quotes
    const others = [...QUOTES]
      .filter(q => q.text !== daily.text)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    setQuotes([daily, ...others]);
  }, []);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  if (quotes.length === 0) return null;
  return (
    <div className="w-full mb-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {quotes.map((quote, index) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0" key={index}>
              <Card className={cn(
                "border-none shadow-sm relative overflow-hidden h-full transition-all",
                // Apply premium styling to ALL cards unconditionally
                "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-200 dark:border-violet-900/50"
              )}>
                <CardContent className="p-6 flex flex-col items-center text-center justify-center min-h-[140px]">
                  <QuoteIcon className="w-6 h-6 mb-3 opacity-50 text-violet-500" />
                  <p className="font-medium italic text-lg leading-relaxed mb-2 text-foreground">
                    "{quote.text}"
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    — {quote.author}
                  </p>
                  {/* Only show the DAILY badge for the first quote */}
                  {index === 0 && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">
                      DAILY
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {quotes.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === selectedIndex ? "bg-violet-500 w-4" : "bg-slate-300 dark:bg-slate-700"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}