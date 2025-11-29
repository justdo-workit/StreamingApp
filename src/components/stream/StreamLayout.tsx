"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import VideoPlayer from "./VideoPlayer";
import AdModals, { AdModalHandles } from "./AdModals";
import StreamingBannerAd from "./StreamingBannerAd";
import { Button } from "../ui/button";
import { Tv, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import RightSidePoll from "./RightSidePoll";
import RightSideChat from "./RightSideChat";
 

 

type GrandPrix = {
  name: string;
  slug: string;
  circuit: {
    lapCount: number;
    mapImageUrl?: string;
  };
};
type StreamSource = { id: string; name: string };

type StreamLayoutProps = {
  grandPrix: GrandPrix;
  streamSources: StreamSource[];
  streamingUrls: Record<string, string>;
};

function BackupSelect({ sources, current, onChange }: { sources: StreamSource[]; current: StreamSource; onChange: (s: StreamSource) => void }) {
  const currentIsBackup = current.id.startsWith("bk");
  const currentLabel = currentIsBackup ? current.name : "More";
  return (
    <Select value={currentIsBackup ? current.id : undefined} onValueChange={(val) => {
      const found = sources.find(s => s.id === val);
      if (found) onChange(found);
    }}>
      <SelectTrigger className="h-8 w-[140px]">
        <SelectValue placeholder={currentLabel} />
      </SelectTrigger>
      <SelectContent>
        {sources.map((s, i) => (
          <SelectItem key={s.id} value={s.id}>{`Backup ${i + 1}`}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function StreamLayout({
  grandPrix,
  streamSources,
  streamingUrls,
}: StreamLayoutProps) {
  const [isTheatreMode, setIsTheatreMode] = useState(false);
  // Start with a synthetic "Default" selection so no language button is red until clicked
  const defaultSource: StreamSource = { id: "default", name: "Default" };
  const hdSource: StreamSource = { id: "unlockHD", name: "HD" };
  const [currentSource, setCurrentSource] = useState<StreamSource>(defaultSource);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adModalRef = useRef<AdModalHandles>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = dir === 'left' ? -240 : 240;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Determine if row is scrollable on mount and resize (mobile UX)
  useEffect(() => {
    const update = () => {
      const el = scrollRef.current;
      if (!el) return;
      setIsScrollable(el.scrollWidth > el.clientWidth + 2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  

  // Simple timer for TV mode overlay
  useEffect(() => {
    if (!isTheatreMode) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isTheatreMode]);

  // Sync TV mode with browser fullscreen state (ESC should exit TV mode)
  useEffect(() => {
    const onFsChange = () => {
      const active = !!document.fullscreenElement;
      if (!active) setIsTheatreMode(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleTvMode = () => {
    if (isTheatreMode) {
      (document as any).exitFullscreen?.().catch?.(() => {});
      setIsTheatreMode(false);
    } else {
      const el = containerRef.current ?? document.documentElement;
      // requestFullscreen can throw if denied; ignore
      (el as any).requestFullscreen?.().catch(() => {});
      setIsTheatreMode(true);
    }
  };

const handleUnlockHD = () => {
  if (typeof window !== "undefined") {
    const encoded =
      "aHR0cHM6Ly93d3cuZWZmZWN0aXZlZ2F0ZWNwbS5jb20vc2Zjdm1hczF4P2tleT0yMTk2MzRiNDJjYTYzYTAzYTlhZWQ4YzEyMjM3OGM0ZQ==";

    const adUrl = window.atob(encoded);

    window.open(adUrl, "_blank", "noopener,noreferrer");
  }

  setCurrentSource(hdSource);
};


  const currentUrl = (() => {
    const key = currentSource.id;
    return streamingUrls[key] ?? streamingUrls["default"];
  })();

  useEffect(() => {
    if (!currentUrl) return;
    setIsStreamLoading(true);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    loadingTimeoutRef.current = setTimeout(() => {
      setIsStreamLoading(false);
      loadingTimeoutRef.current = null;
    }, 2000);
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [currentUrl]);

  const handleStreamLoaded = () => {
    setIsStreamLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "transition-all duration-300",
        isTheatreMode
          ? "w-full bg-black"
          : "container mx-auto max-w-none px-0 py-4 lg:px-4"
      )}
    >
        <AdModals ref={adModalRef} />
        <div className={cn(
            "grid w-full gap-4 transition-all duration-300",
            isTheatreMode 
            ? "grid-cols-1" 
            : "grid-cols-1 lg:grid-cols-[280px_1fr_320px]"
        )}>
            {/* Left Panel: Driver Standings */}
            <div className={cn("hidden lg:block", isTheatreMode && "!hidden")}>
                <div className="w-full max-w-full overflow-hidden">
                  <RightSidePoll />
                </div>
            </div>

            {/* Center: Video Player */}
            <div className="flex flex-col gap-4">
                <div className="relative">
                  <VideoPlayer 
                      url={currentUrl} 
                      isHd={currentSource.id === "unlockHD"}
                      showLoading={isStreamLoading}
                      onLoaded={handleStreamLoaded}
                      onFirstFullscreenClick={() => adModalRef.current?.showOnClickAd()}
                      curved={false}
                  />
                  {/* Subtle dark overlay on non-HD streams in normal mode */}
                  {!isTheatreMode && currentSource.id !== "unlockHD" && (
                    <div className="pointer-events-none absolute inset-0 bg-black/20" />
                  )}
                  {isTheatreMode && (
                    <div className="absolute inset-0 flex items-end justify-end pb-4 pr-4 z-30">
                      <button
                        type="button"
                        onClick={toggleTvMode}
                        className="rounded-md bg-black/70 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-black/80"
                      >
                        Exit TV Mode
                      </button>
                    </div>
                  )}
                </div>

                {!isTheatreMode && (
                <div className="px-4 lg:px-0">
                    <div className="rounded-lg border bg-card p-2">
                        <div className="flex items-center justify-between gap-2">
                            {/* Scrollable controls; arrows moved below on mobile */}
                            <div className="flex-1 min-w-0">
                                <div ref={scrollRef} className="w-full overflow-x-auto whitespace-nowrap snap-x snap-mandatory touch-pan-x scroll-smooth [-ms-overflow-style:none]" style={{ scrollbarWidth: 'none' }}>
                                    <div className="inline-flex items-center gap-2 px-4 py-1">
                                        {/* Default first (selected by default) */}
                                        <Button
                                            variant={currentSource.id === defaultSource.id ? 'destructive' : 'secondary'}
                                            size="sm"
                                            className="shrink-0"
                                            onClick={() => setCurrentSource(defaultSource)}
                                        >
                                            Default
                                        </Button>

                                        {/* Unlock HD second on mobile */}
                                        {currentSource.id !== "unlockHD" && (
                                        <Button onClick={handleUnlockHD} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black shrink-0 lg:hidden">
                                            <Crown className="mr-2 h-4 w-4" />
                                            Unlock HD
                                        </Button>
                                        )}

                                        {/* Language sources (non-backup) - normal until selected */}
                                        {streamSources
                                            .filter(s => !s.id.startsWith('bk'))
                                            .map(source => (
                                            <Button
                                                key={source.id}
                                                variant={currentSource.id === source.id ? 'destructive' : 'secondary'}
                                                size="sm"
                                                className="shrink-0"
                                                onClick={() => setCurrentSource(source)}
                                            >
                                                {source.name}
                                            </Button>
                                        ))}

                                        {/* More (backup) dropdown */}
                                        <BackupSelect
                                            sources={streamSources.filter(s => s.id.startsWith('bk'))}
                                            current={currentSource}
                                            onChange={setCurrentSource}
                                        />
                                    </div>
                                </div>
                                {/* Mobile-only arrows below if needed */}
                                {isScrollable && (
                                  <>
                                    <div className="mt-2 flex items-center justify-between lg:hidden px-1">
                                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => scrollByAmount('left')}>
                                        <ChevronLeft className="h-4 w-4" />
                                      </Button>
                                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => scrollByAmount('right')}>
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="mt-1 lg:hidden text-[11px] text-muted-foreground flex items-center justify-center gap-2">
                                      <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                                      <span>← Swipe to view more →</span>
                                    </div>
                                  </>
                                )}
                            </div>

                            {/* Right-side controls on large screens */}
                            <div className="hidden lg:flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={toggleTvMode}>
                                    <Tv className="mr-2 h-4 w-4" />
                                    {isTheatreMode ? "Exit TV Mode" : "TV Mode"}
                                </Button>
                                {currentSource.id !== "unlockHD" && (
                                    <Button onClick={handleUnlockHD} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                        <Crown className="mr-2 h-4 w-4" />
                                        Unlock HD
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {isTheatreMode && (
                  <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center">
                    <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border bg-black/70 px-3 py-2 shadow-lg backdrop-blur" role="group" aria-label="TV controls">
                      <Button
                        variant={currentSource.id === defaultSource.id ? 'destructive' : 'secondary'}
                        size="sm"
                        className="shrink-0"
                        onClick={() => setCurrentSource(defaultSource)}
                      >
                        Default
                      </Button>
                      {streamSources.filter(s => !s.id.startsWith('bk')).map(source => (
                        <Button
                          key={source.id}
                          variant={currentSource.id === source.id ? 'destructive' : 'secondary'}
                          size="sm"
                          className="shrink-0"
                          onClick={() => setCurrentSource(source)}
                        >
                          {source.name}
                        </Button>
                      ))}
                      <BackupSelect
                        sources={streamSources.filter(s => s.id.startsWith('bk'))}
                        current={currentSource}
                        onChange={setCurrentSource}
                      />
                      {currentSource.id !== "unlockHD" && (
                        <Button onClick={handleUnlockHD} size="sm" className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Crown className="mr-2 h-4 w-4" /> Unlock HD
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Sticky banner under video - hidden in TV mode */}
                {!isTheatreMode && (
                  <div className="px-4 lg:px-0">
                      <StreamingBannerAd />
                  </div>
                )}
            </div>

            {/* Right Panel: Widgets (desktop) - show map only, hide HUD */}
            <div className={cn("hidden lg:block", isTheatreMode && "!hidden")}> 
                {/* LiveTrackMap duplicated card removed; TrackInfoWidgets shows live map */}
                <div className="w-full max-w-full overflow-hidden">
                  <RightSideChat />
                </div>
            </div>

            {/* Mobile-only Panels */}
            {!isTheatreMode && (
            <div className="lg:hidden px-4">
          
                {/* LiveTrackMap duplicated card removed on mobile; TrackInfoWidgets shows live map */}
             
                <div className="w-full max-w-full overflow-hidden mt-4">
                  <RightSidePoll />
                </div>
                <div className="w-full max-w-full overflow-hidden mt-4">
                  <RightSideChat />
                </div>
            </div>
            )}

        </div>
    </div>
  );
}
