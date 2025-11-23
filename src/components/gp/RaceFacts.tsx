import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/data";
import { ChevronsUpDown, DraftingCompass, Gauge, Repeat } from "lucide-react";
import { Button } from "../ui/button";
import AdPlaceholder from "../shared/AdPlaceholder";

type Circuit = {
  name: string;
  mapImageId: string;
  mapImageUrl?: string;
  details: string;
  trackLength: string;
  lapCount: number;
  drsZones: number;
  firstGrandPrix?: string;
  raceDistance?: string;
  fastestLapTime?: string;
  fastestLapBy?: string; // e.g., "Lando Norris (2024)"
};

type RaceFactsProps = {
  circuit: Circuit;
};

export default function RaceFacts({ circuit }: RaceFactsProps) {
  const mapImage = circuit.mapImageUrl
    ? {
        imageUrl: circuit.mapImageUrl,
        imageHint: circuit.name,
      }
    : placeholderImages.find((img) => img.id === circuit.mapImageId);

  return (
    <section>
      <h2 className="mb-6 text-center font-headline text-4xl font-bold">
        Race Facts
      </h2>
      <Card className="border-0 shadow-none bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Circuit Image */}
          <div className="relative min-h-[220px] md:min-h-[360px] bg-black">
            {mapImage && (
              <Image
                src={mapImage.imageUrl}
                alt={`Map of ${circuit.name}`}
                fill
                className="object-contain"
                data-ai-hint={(mapImage as any).imageHint}
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={80}
              />
            )}
          </div>

          {/* Right: Stats Panel */}
          <div className="flex flex-col p-4 md:p-6 bg-background">
            <div className="text-sm text-white/70">Circuit Length</div>
            <div className="mt-1 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {circuit.trackLength}
            </div>
            <div className="my-3 h-px w-full bg-white/10" />

            <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-white">
              <div>
                <div className="text-xs uppercase text-white/60">First Grand Prix</div>
                <div className="mt-1 text-lg font-semibold">
                  {circuit.firstGrandPrix ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-white/60">Number of Laps</div>
                <div className="mt-1 text-lg font-semibold">{circuit.lapCount}</div>
              </div>
            </div>
            <div className="my-3 h-px w-full bg-white/10" />
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-white">
              <div>
                <div className="text-xs uppercase text-white/60">Fastest lap time</div>
                <div className="mt-1 text-lg font-extrabold">
                  {circuit.fastestLapTime ?? "—"}
                </div>
                {circuit.fastestLapBy && (
                  <div className="text-xs text-white/60">{circuit.fastestLapBy}</div>
                )}
              </div>
              <div>
                <div className="text-xs uppercase text-white/60">Race Distance</div>
                <div className="mt-1 text-lg font-semibold">
                  {circuit.raceDistance ?? "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
