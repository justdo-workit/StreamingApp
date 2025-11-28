"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Thermometer, Droplets } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import LiveTrackMap from "./LiveTrackMap";

type TrackInfoWidgetsProps = {
    lapCount: number;
    trackMapImage?: ImagePlaceholder;
    showHud?: boolean;
    currentLap?: number; // live override
    useLiveMap?: boolean;
    livePoints?: Array<{ num: number; x: number; y: number; colour?: string }>;
    liveTrails?: Array<{ num: number; pts: Array<{ x: number; y: number }>; colour?: string }>;
    liveBackgroundUrl?: string;
    liveBackgroundAlt?: string;
}

export default function TrackInfoWidgets({ lapCount, trackMapImage, showHud = true, currentLap: currentLapProp, useLiveMap, livePoints, liveTrails, liveBackgroundUrl, liveBackgroundAlt }: TrackInfoWidgetsProps) {
    const [currentLap, setCurrentLap] = useState(currentLapProp ?? 1);
    const [remainingLaps, setRemainingLaps] = useState(lapCount - (currentLapProp ?? 1));
    const [elapsed, setElapsed] = useState(0);
    
    // Simulate laps only when live currentLap is not provided
    useEffect(() => {
        if (typeof currentLapProp === 'number') {
            setCurrentLap(currentLapProp);
            setRemainingLaps(Math.max(0, lapCount - currentLapProp));
            return;
        }
        const lapInterval = setInterval(() => {
            setCurrentLap(prev => {
                const nextLap = prev < lapCount ? prev + 1 : lapCount;
                setRemainingLaps(lapCount - nextLap);
                return nextLap;
            });
        }, 90000); //~90 seconds per lap

        return () => clearInterval(lapInterval);
    }, [lapCount, currentLapProp]);

    useEffect(() => {
        const t = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    const timer = `${hh}:${mm}:${ss}`;

    return (
        <div className="space-y-4">
            {showHud && (
            <Card className="bg-secondary">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="font-mono text-3xl md:text-4xl font-bold">{timer}</div>
                        <div className="font-mono text-2xl font-bold">{currentLap}/{lapCount}</div>
                    </div>
                    <div className="mt-4 flex items-end gap-6">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center rounded-full border-2 border-muted-foreground h-12 w-12 font-bold">17</div>
                            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">TRC</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center rounded-full border-2 border-muted-foreground h-12 w-12 font-bold">16</div>
                            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Thermometer className="h-3 w-3" />AIR</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center rounded-full border-2 border-muted-foreground h-12 w-12 font-bold">39</div>
                            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Droplets className="h-3 w-3" /></div>
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Remaining: {remainingLaps} laps</div>
                </CardContent>
            </Card>
            )}

            {(trackMapImage) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Live Track Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video w-full">
                            <LiveTrackMap
                              backgroundUrl={useLiveMap ? liveBackgroundUrl : undefined}
                              backgroundAlt={liveBackgroundAlt || trackMapImage.description}
                              points={livePoints || []}
                              trails={liveTrails}
                              heightClass="aspect-video"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
