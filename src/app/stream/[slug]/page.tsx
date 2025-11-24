import { notFound } from "next/navigation";
import {
  grandPrixes,
  driverStandings,
  streamSources,
  streamingUrl,
  placeholderImages
} from "@/lib/data";
import StreamLayout from "@/components/stream/StreamLayout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type StreamPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return grandPrixes.map((g) => ({ slug: g.slug }));
}

export default function StreamPage({ params }: StreamPageProps) {
  const gp = grandPrixes.find((g) => g.slug === params.slug);

  if (!gp) {
    notFound();
  }

  const trackMapImage = placeholderImages.find(img => img.id === 'track-map-small');
  const flagBySlug: Record<string, string> = {
    bahrain: "https://flagcdn.com/w80/bh.png",
    "saudi-arabia": "https://flagcdn.com/w80/sa.png",
    YasMarina: "https://flagcdn.com/w80/ae.png",
  };
  const flagUrl = flagBySlug[gp.slug as keyof typeof flagBySlug];

  return (
    <div className="flex min-h-screen flex-col">
       <Header grandPrixName={gp.name} showBack a_href={`/grand-prix/${gp.slug}`} showTimer sessionTitle="Race" flagUrl={flagUrl} lapCount={gp.circuit.lapCount} />
      <main className="flex-grow">
        <StreamLayout
          grandPrix={gp}
          driverStandings={driverStandings}
          streamSources={streamSources}
          streamingUrl={streamingUrl}
          trackMapImage={trackMapImage}
        />
      </main>
      <Footer />
    </div>
  );
}
