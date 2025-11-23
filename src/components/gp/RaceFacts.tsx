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
  details: string;
  trackLength: string;
  lapCount: number;
  drsZones: number;
};

type RaceFactsProps = {
  circuit: Circuit;
};

const FactItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex items-center">
    <Icon className="h-6 w-6 text-primary mr-4" />
    <div>
      <p className="text-sm font-normal text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);

export default function RaceFacts({ circuit }: RaceFactsProps) {
  const mapImage = placeholderImages.find((img) => img.id === circuit.mapImageId);

  return (
    <section>
      <h2 className="mb-6 text-center font-headline text-4xl font-bold">
        Race Facts
      </h2>
      <Card>
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-2">
          <div className="p-6">
            <CardTitle className="font-headline font-bold">{circuit.name}</CardTitle>
            <p className="mt-2 font-normal text-muted-foreground">{circuit.details}</p>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <FactItem icon={Gauge} label="Track Length" value={circuit.trackLength} />
              <FactItem icon={Repeat} label="Lap Count" value={circuit.lapCount} />
              <FactItem icon={DraftingCompass} label="DRS Zones" value={circuit.drsZones} />
              <AdPlaceholder label="Square Ad (250x250)" className="h-[250px] w-[250px] aspect-square"/>
            </div>
          </div>
          {mapImage && (
            <div className="relative min-h-[400px]">
              <Image
                src={mapImage.imageUrl}
                alt={`Map of ${circuit.name}`}
                fill
                className="object-cover rounded-r-lg"
                data-ai-hint={mapImage.imageHint}
              />
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
            <Collapsible>
                <CollapsibleTrigger asChild>
                     <div className="flex items-center justify-between p-6">
                        <div>
                            <CardTitle className="font-headline font-bold">{circuit.name}</CardTitle>
                            <p className="text-sm font-normal text-muted-foreground">Tap to see track info</p>
                        </div>
                        <Button variant="ghost" size="sm">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                     </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                         {mapImage && (
                            <div className="relative h-[200px] w-full mb-4">
                                <Image
                                    src={mapImage.imageUrl}
                                    alt={`Map of ${circuit.name}`}
                                    fill
                                    className="object-cover rounded-lg"
                                    data-ai-hint={mapImage.imageHint}
                                />
                            </div>
                        )}
                        <p className="mb-6 font-normal text-muted-foreground">{circuit.details}</p>
                        <div className="grid grid-cols-1 gap-4">
                            <FactItem icon={Gauge} label="Track Length" value={circuit.trackLength} />
                            <FactItem icon={Repeat} label="Lap Count" value={circuit.lapCount} />
                            <FactItem icon={DraftingCompass} label="DRS Zones" value={circuit.drsZones} />
                        </div>
                        <AdPlaceholder label="Square Ad (250x250)" className="h-[250px] w-full mt-6"/>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </div>
      </Card>
    </section>
  );
}
