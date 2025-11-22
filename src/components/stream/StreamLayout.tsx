"use client";

import { useState } from "react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import VideoPlayer from "./VideoPlayer";
import DriverStandings from "./DriverStandings";
import TrackInfoWidgets from "./TrackInfoWidgets";
import AdPlaceholder from "../shared/AdPlaceholder";
import { Button } from "../ui/button";
import { Tv, Crown } from "lucide-react";
import AdModals, { AdModalHandles } from "./AdModals";
import { useRef } from "react";

type GrandPrix = {
  name: string;
  slug: string;
  lapCount: number;
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
  streamingUrl: string;
  trackMapImage?: ImagePlaceholder;
};

export default function StreamLayout({
  grandPrix,
  driverStandings,
  streamSources,
  streamingUrl,
  trackMapImage
}: StreamLayoutProps) {
  const [isTheatreMode, setIsTheatreMode] = useState(false);
  const [isHdUnlocked, setIsHdUnlocked] = useState(false);
  const [currentSource, setCurrentSource] = useState(streamSources[0]);
  const adModalRef = useRef<AdModalHandles>(null);

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

  return (
    <div
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
                <DriverStandings drivers={driverStandings} />
            </div>

            {/* Center: Video Player */}
            <div className="flex flex-col gap-4">
                <VideoPlayer 
                    url={streamingUrl} 
                    isHd={isHdUnlocked}
                    onFirstFullscreenClick={() => adModalRef.current?.showOnClickAd()}
                />

                <div className="px-4 lg:px-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-2">
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="mr-2 text-sm font-medium">Source:</span>
                            {streamSources.map(source => (
                                <Button 
                                    key={source.id} 
                                    variant={currentSource.id === source.id ? 'destructive' : 'secondary'}
                                    size="sm"
                                    onClick={() => setCurrentSource(source)}
                                >
                                    {source.name}
                                </Button>
                            ))}
                        </div>
                         <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" onClick={() => setIsTheatreMode(!isTheatreMode)}>
                                 <Tv className="mr-2 h-4 w-4" />
                                 {isTheatreMode ? "Exit Theatre" : "Theatre Mode"}
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

                {/* Sticky banner under video */}
                <div className="px-4 lg:px-0">
                    <AdPlaceholder label="Sticky Banner Under Video (728x90)" className="h-[90px] w-full" />
                </div>
            </div>

            {/* Right Panel: Widgets */}
            <div className={cn("hidden lg:block", isTheatreMode && "!hidden")}>
                <TrackInfoWidgets lapCount={grandPrix.lapCount} trackMapImage={trackMapImage} />
            </div>

            {/* Mobile-only Panels */}
            <div className="lg:hidden px-4">
                <DriverStandings drivers={driverStandings} />
                <div className="my-4">
                    <TrackInfoWidgets lapCount={grandPrix.lapCount} trackMapImage={trackMapImage} />
                </div>
                <div className="my-4">
                     <AdPlaceholder label="Rewarded Ad Pop-up Trigger" className="h-[100px] w-full" />
                     <Button onClick={handleUnlockStats} className="w-full mt-2">Unlock Stats</Button>
                </div>
            </div>

        </div>
    </div>
  );
}
