"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from "../ui/card";
import { Maximize, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import AdPlaceholder from '../shared/AdPlaceholder';

type VideoPlayerProps = {
  url: string;
  isHd: boolean;
  onFirstFullscreenClick: () => void;
};

export default function VideoPlayer({ url, isHd, onFirstFullscreenClick }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstFullscreen, setIsFirstFullscreen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Show pre-roll ad on initial load
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate pre-roll
    return () => clearTimeout(timer);
  }, []);

  const handleFullscreen = () => {
    if (isFirstFullscreen) {
      onFirstFullscreenClick();
      setIsFirstFullscreen(false);
    }
    iframeRef.current?.requestFullscreen();
  };

  if (isLoading) {
    return (
      <Card className="aspect-video w-full flex flex-col items-center justify-center bg-black">
        <AdPlaceholder label="Pre-roll Ad Loader" className="w-full h-full border-none"/>
        <div className="absolute flex flex-col items-center text-white">
            <Loader className="h-12 w-12 animate-spin mb-4" />
            <p>Your stream will begin after this message...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative aspect-video w-full overflow-hidden bg-black group">
      <iframe
        ref={iframeRef}
        src={url}
        allowFullScreen
        className="h-full w-full border-0"
        title="F1 Stream"
      />
      <div className="absolute inset-0 bg-transparent transition-opacity opacity-0 group-hover:opacity-100 flex items-start justify-end p-2">
         <div className="absolute top-2 left-2 flex items-center gap-2">
            <span className={cn("px-2 py-1 rounded-md text-xs font-bold text-white", isHd ? "bg-yellow-500" : "bg-primary")}>
                {isHd ? "HD" : "SD"}
            </span>
         </div>
        <Button variant="secondary" size="icon" onClick={handleFullscreen}>
            <Maximize className="h-5 w-5" />
            <span className="sr-only">Fullscreen</span>
        </Button>
      </div>
    </Card>
  );
}
