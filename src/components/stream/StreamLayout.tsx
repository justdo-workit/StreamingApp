"use client";

import { useState, useRef, useEffect } from "react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import VideoPlayer from "./VideoPlayer";
import AdModals, { AdModalHandles } from "./AdModals";
import AdPlaceholder from "../shared/AdPlaceholder";
import { Button } from "../ui/button";
import { Tv, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { useF1Stream } from "@/hooks/useF1Stream";
import LiveTimingTower from "./LiveTimingTower";
import LiveTrackMap from "./LiveTrackMap";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DriverStandings = dynamic(() => import("./DriverStandings"), {
  ssr: false,
});

const TrackInfoWidgets = dynamic(() => import("./TrackInfoWidgets"), {
  ssr: false,
});

type GrandPrix = {
  name: string;
  slug: string;
  circuit: {
    lapCount: number;
    mapImageUrl?: string;
  };
};
type Driver = {
  position: number;
  driver: string;
  time: string;
  points: number;
};
type StreamSource = { id: string; name: string };

type StreamLayoutProps = {
  grandPrix: GrandPrix;
  driverStandings: Driver[];
  streamSources: StreamSource[];
  streamingUrls: Record<string, string>;
  trackMapImage?: ImagePlaceholder;
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
  driverStandings,
  streamSources,
  streamingUrls,
  trackMapImage
}: StreamLayoutProps) {
  const [isTheatreMode, setIsTheatreMode] = useState(false);
  const [isHdUnlocked, setIsHdUnlocked] = useState(false);
  // Start with a synthetic "Default" selection so no language button is red until clicked
  const defaultSource: StreamSource = { id: "default", name: "Default" };
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

  // Resolve OpenF1 session params (free polling -> near-live)
  const countryBySlug: Record<string, string> = {
    "qatar": "Qatar",
    "abu-dhabi": "United Arab Emirates",
  };
  const country = countryBySlug[grandPrix.slug] ?? grandPrix.slug;
  const f1 = useF1Stream({ country, year: "latest", session: "Race" });

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
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      setIsTheatreMode(false);
    } else {
      const el = containerRef.current ?? document.documentElement;
      // requestFullscreen can throw if denied; ignore
      (el as any).requestFullscreen?.().catch(() => {});
      setIsTheatreMode(true);
    }
  };

  const handleUnlockHD = () => {
    adModalRef.current?.showCpvAd(() => {
        setIsHdUnlocked(true);
    });
  };

  const handleUnlockStats = () => {
     adModalRef.current?.showRewardedAd(() => {
        // In a real app, this would unlock the stats panel
        console.log("Stats unlocked!");
     });
  }

  const currentUrl = (() => {
    if (isHdUnlocked && streamingUrls["unlockHD"]) {
      return streamingUrls["unlockHD"];
    }
    const key = currentSource.id === "default" ? "default" : currentSource.id;
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
                <LiveTimingTower tower={f1.tower} connected={f1.connected} />
            </div>

            {/* Center: Video Player */}
            <div className="flex flex-col gap-4">
                <div className="relative">
                  <VideoPlayer 
                      url={currentUrl} 
                      isHd={isHdUnlocked}
                      showLoading={isStreamLoading}
                      onLoaded={handleStreamLoaded}
                      onFirstFullscreenClick={() => adModalRef.current?.showOnClickAd()}
                      curved={false}
                  />
                  {isTheatreMode && (
                    <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-30 rounded-md bg-black/60 px-3 py-1 text-white font-mono text-xl font-bold">
                      {String(Math.floor(elapsed/3600)).padStart(2,'0')}
                      :{String(Math.floor((elapsed%3600)/60)).padStart(2,'0')}
                      :{String(elapsed%60).padStart(2,'0')}
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
                                        {!isHdUnlocked && (
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
                                {!isHdUnlocked && (
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
                      {!isHdUnlocked && (
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
                      <AdPlaceholder label="Sticky Banner Under Video (728x90)" className="h-[90px] w-full" />
                  </div>
                )}
            </div>

            {/* Right Panel: Widgets (desktop) - show map only, hide HUD */}
            <div className={cn("hidden lg:block", isTheatreMode && "!hidden")}> 
                <TrackInfoWidgets
                  lapCount={grandPrix.circuit.lapCount}
                  trackMapImage={trackMapImage}
                  showHud={false}
                  currentLap={f1.currentLap}
                  useLiveMap
                  livePoints={f1.trackPoints.points}
                  liveTrails={f1.trackPoints.trails}
                  liveBackgroundUrl={undefined}
                  liveBackgroundAlt={`${grandPrix.name} live map`}
                />
                {/* LiveTrackMap duplicated card removed; TrackInfoWidgets shows live map */}
            </div>

            {/* Mobile-only Panels */}
            {!isTheatreMode && (
            <div className="lg:hidden px-4">
                <LiveTimingTower tower={f1.tower} connected={f1.connected} />
                <div className="my-4">
                    <TrackInfoWidgets
                      lapCount={grandPrix.circuit.lapCount}
                      trackMapImage={trackMapImage}
                      showHud
                      currentLap={f1.currentLap}
                      useLiveMap
                      livePoints={f1.trackPoints.points}
                      liveTrails={f1.trackPoints.trails}
                      liveBackgroundUrl={undefined}
                      liveBackgroundAlt={`${grandPrix.name} live map`}
                    />
                </div>
                {/* LiveTrackMap duplicated card removed on mobile; TrackInfoWidgets shows live map */}
                <div className="my-4">
                     <AdPlaceholder label="Rewarded Ad Pop-up Trigger" className="h-[100px] w-full" />
                     <Button onClick={handleUnlockStats} className="w-full mt-2">Unlock Stats</Button>
                </div>
            </div>
            )}

        </div>
    </div>
  );
}
