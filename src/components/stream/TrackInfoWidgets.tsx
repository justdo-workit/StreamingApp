"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Repeat, Clock, Wind } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

type TrackInfoWidgetsProps = {
    lapCount: number;
    trackMapImage?: ImagePlaceholder;
}

const InfoWidget = ({ icon: Icon, title, value, unit }: { icon: React.ElementType, title: string, value: string | number, unit?: string }) => (
    <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {value} {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
            </div>
        </CardContent>
    </Card>
);

export default function TrackInfoWidgets({ lapCount, trackMapImage }: TrackInfoWidgetsProps) {
    const [currentLap, setCurrentLap] = useState(1);
    const [remainingLaps, setRemainingLaps] = useState(lapCount - 1);
    
    // Simulate lap progression
    useEffect(() => {
        const lapInterval = setInterval(() => {
            setCurrentLap(prev => {
                const nextLap = prev < lapCount ? prev + 1 : lapCount;
                setRemainingLaps(lapCount - nextLap);
                return nextLap;
            });
        }, 90000); //~90 seconds per lap

        return () => clearInterval(lapInterval);
    }, [lapCount]);


    return (
        <div className="space-y-4">
            <InfoWidget icon={Repeat} title="Laps" value={`${currentLap}/${lapCount}`} />
            <InfoWidget icon={Clock} title="Remaining" value={remainingLaps} unit="laps" />
            <InfoWidget icon={Wind} title="Sector 1" value="31.45s" />

            {trackMapImage && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Track Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video w-full">
                            <Image 
                                src={trackMapImage.imageUrl}
                                alt={trackMapImage.description}
                                fill
                                className="object-contain"
                                data-ai-hint={trackMapImage.imageHint}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
