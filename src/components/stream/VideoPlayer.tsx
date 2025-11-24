"use client";

import { useState, useRef } from 'react';
import { Card } from "../ui/card";
import { Maximize } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type VideoPlayerProps = {
  url: string;
  isHd: boolean;
  onFirstFullscreenClick: () => void;
  curved?: boolean;
};

export default function VideoPlayer({ url, isHd, onFirstFullscreenClick, curved = false }: VideoPlayerProps) {
  const [isFirstFullscreen, setIsFirstFullscreen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullscreen = () => {
    if (isFirstFullscreen) {
      onFirstFullscreenClick();
      setIsFirstFullscreen(false);
    }
    iframeRef.current?.requestFullscreen();
  };

  return (
    <Card className={cn("relative aspect-video w-full overflow-hidden bg-black group", curved && "rounded-[28px] p-1")}> 
      <div
        className={cn(
          "relative h-full w-full overflow-hidden",
          curved && "rounded-[24px] shadow-[inset_0_20px_40px_rgba(0,0,0,0.6),inset_0_-20px_40px_rgba(0,0,0,0.6)] [transform:perspective(1200px)_rotateX(2deg)]"
        )}
      >
        <iframe
          ref={iframeRef}
          src={url}
          allowFullScreen
          className="h-full w-full border-0"
          title="F1 Stream"
        />
      </div>
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
