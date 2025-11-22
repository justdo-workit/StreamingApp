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

export default function StreamPage({ params }: StreamPageProps) {
  const gp = grandPrixes.find((g) => g.slug === params.slug);

  if (!gp) {
    notFound();
  }

  const trackMapImage = placeholderImages.find(img => img.id === 'track-map-small');

  return (
    <div className="flex min-h-screen flex-col">
       <Header grandPrixName={gp.name} showBack a_href={`/grand-prix/${gp.slug}`} />
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
